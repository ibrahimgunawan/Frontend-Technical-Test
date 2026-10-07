"use client";

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AuthUser } from "@/types";
import { RefreshCw } from "lucide-react";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export type AuthContextType = {
  status: AuthStatus;
  user: AuthUser | null;
  logout: () => Promise<void>;
  handleUnauthorized: () => void;
  refetchSession: () => Promise<void>;
  isLoggingOut: boolean;
};

type SessionResult =
  | { type: "authenticated"; user: AuthUser }
  | { type: "unauthenticated" }
  | { type: "error" };

async function fetchSessionApi(): Promise<SessionResult> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (res.status === 200) {
      const data = await res.json();
      return { type: "authenticated", user: data.user };
    }
    if (res.status === 401) {
      return { type: "unauthenticated" };
    }
    return { type: "error" };
  } catch {
    return { type: "error" };
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const applySessionResult = useCallback(
    (res: SessionResult) => {
      if (res.type === "authenticated") {
        setUser(res.user);
        setStatus("authenticated");
      } else if (res.type === "unauthenticated") {
        setUser(null);
        setStatus("unauthenticated");
        router.replace("/login");
      } else {
        setStatus("error");
      }
    },
    [router]
  );

  useEffect(() => {
    let isMounted = true;

    fetchSessionApi().then((res) => {
      if (isMounted) applySessionResult(res);
    });

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        fetchSessionApi().then(applySessionResult);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      isMounted = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [applySessionResult]);

  const handleUnauthorized = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  const refetchSession = useCallback(async () => {
    const res = await fetchSessionApi();
    applySessionResult(res);
  }, [applySessionResult]);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.status === 200) {
        setUser(null);
        setStatus("unauthenticated");
        toast.success("Berhasil keluar");
        router.replace("/login");
        router.refresh();
      } else {
        toast.error("Gagal keluar. Coba lagi.");
      }
    } catch {
      toast.error("Gagal keluar. Coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    refetchSession();
  }, [refetchSession]);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        logout,
        handleUnauthorized,
        refetchSession,
        isLoggingOut,
      }}
    >
      {status === "error" ? (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <p className="text-sm text-muted-foreground">
            Terjadi kesalahan memuat sesi autentikasi.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 bg-accent text-accent-foreground font-medium text-sm rounded-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Coba lagi</span>
          </button>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
