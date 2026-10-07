"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { SITE_NAME } from "@/lib/site";
import { CartButton } from "./cart-button";
import { ThemeToggle } from "./theme-toggle";
import { LogOut, Loader2 } from "lucide-react";

export function AppHeader() {
  const { status, user, logout, isLoggingOut } = useAuth();

  const renderUserSection = () => {
    if (status === "loading") {
      return (
        <div className="h-9 w-16 sm:w-32 bg-chrome-foreground/10 animate-pulse rounded-sm border border-chrome-foreground/10" />
      );
    }

    if (!user) {
      return null;
    }

    const userInitial = user.name.charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="h-5 w-px bg-chrome-foreground/15 mx-0.5 sm:mx-1" aria-hidden="true" />

        <div className="hidden sm:flex items-center h-9 px-2.5 rounded-sm border border-chrome-foreground/15 bg-chrome-foreground/6 gap-2 text-xs text-chrome-foreground select-none">
          <div className="h-5 w-5 rounded-xs bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-xs uppercase leading-none shrink-0">
            {userInitial}
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-heading font-semibold uppercase text-xs truncate max-w-[100px] md:max-w-[130px] text-chrome-foreground">
              {user.name}
            </span>
            <span className="text-[10px] font-mono text-chrome-foreground/60 truncate max-w-[100px] md:max-w-[130px] hidden md:block">
              {user.email}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          title="Keluar dari akun"
          aria-label="Keluar dari akun"
          className="hidden sm:inline-flex h-9 px-2.5 rounded-sm border border-chrome-foreground/15 bg-chrome-foreground/6 hover:bg-destructive hover:border-destructive hover:text-white text-chrome-foreground transition-colors items-center gap-1.5 text-xs font-medium cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          ) : (
            <>
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline text-xs font-sans">Keluar</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          title={`Keluar (${user.name})`}
          aria-label={`Keluar dari akun ${user.name}`}
          className="sm:hidden h-9 px-2 rounded-sm border border-chrome-foreground/15 bg-chrome-foreground/6 hover:bg-destructive hover:border-destructive hover:text-white text-chrome-foreground transition-colors inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <span className="h-5 w-5 rounded-xs bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-[11px] uppercase leading-none shrink-0">
            {userInitial}
          </span>
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
          ) : (
            <LogOut className="h-3.5 w-3.5 shrink-0 opacity-80" />
          )}
        </button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-chrome text-chrome-foreground border-b border-border/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/products"
          aria-label={`${SITE_NAME} Beranda Produk`}
          className="flex items-center gap-2 group focus:outline-none focus:ring-1 focus:ring-accent rounded-sm py-1 shrink-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wider sm:tracking-widest text-chrome-foreground transition-colors group-hover:text-accent">
              {SITE_NAME}
            </span>
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent group-hover:scale-125 transition-transform" />
          </div>
          <span className="hidden md:inline-block text-[10px] font-mono tracking-widest text-chrome-foreground/50 border-l border-chrome-foreground/20 pl-2 uppercase">
            Store
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <CartButton variant="chrome" />
          <ThemeToggle variant="chrome" />
          {renderUserSection()}
        </div>
      </div>
    </header>
  );
}
