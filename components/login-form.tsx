"use client";

import { useState, useRef, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validations";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validate = (emailVal: string, passwordVal: string): FieldErrors => {
    const result = loginSchema.safeParse({ email: emailVal, password: passwordVal });
    if (result.success) return {};

    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FieldErrors;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return fieldErrors;
  };

  const handleFieldChange = (field: "email" | "password", val: string) => {
    if (field === "email") setEmail(val);
    else setPassword(val);

    if (hasAttemptedSubmit) {
      const newErrors = validate(
        field === "email" ? val : email,
        field === "password" ? val : password
      );
      setErrors(newErrors);
    }
  };
  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setHasAttemptedSubmit(true);
    const validationErrors = validate(email, password);
    setErrors(validationErrors);

    if (validationErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (validationErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 200) {
        toast.success("Login berhasil");
        router.replace("/products");
        router.refresh();
        return;
      }

      if (res.status === 400 && data?.errors) {
        const serverErrors: FieldErrors = {
          email: data.errors.email?.[0],
          password: data.errors.password?.[0],
        };
        setErrors(serverErrors);
        if (serverErrors.email) emailRef.current?.focus();
        else if (serverErrors.password) passwordRef.current?.focus();
        return;
      }

      if (res.status === 401) {
        toast.error("Email atau password salah");
        setPassword("");
        passwordRef.current?.focus();
        return;
      }

      toast.error(data?.message || "Terjadi kesalahan. Coba lagi.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            disabled={isSubmitting}
            value={email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => {
              if (hasAttemptedSubmit) setErrors(validate(email, password));
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="nama@domain.com"
            className={`w-full px-3 py-2 text-sm rounded-sm bg-card border ${
              errors.email ? "border-destructive" : "border-border"
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-60 transition-colors`}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              onBlur={() => {
                if (hasAttemptedSubmit) setErrors(validate(email, password));
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              placeholder="••••••••"
              className={`w-full pl-3 pr-10 py-2 text-sm rounded-sm bg-card border ${
                errors.password ? "border-destructive" : "border-border"
              } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-60 transition-colors`}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-60"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-accent text-accent-foreground font-medium text-sm rounded-sm hover:opacity-90 active:opacity-100 disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses…</span>
            </>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>
    </div>
  );
}
