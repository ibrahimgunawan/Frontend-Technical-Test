"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

type ThemeToggleProps = Readonly<{
  className?: string;
  variant?: "default" | "chrome";
}>;

function subscribe(callback: () => void) {
  window.addEventListener("theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({
  className = "",
  variant = "default",
}: Readonly<ThemeToggleProps>) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const nextDark = !isCurrentlyDark;

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new Event("theme-change"));
  };

  const themeClasses =
    variant === "chrome"
      ? "bg-chrome-foreground/6 hover:bg-chrome-foreground/12 border-chrome-foreground/15 text-chrome-foreground hover:text-white"
      : "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className={`h-9 px-2.5 sm:px-3 rounded-sm border ${themeClasses} transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent select-none ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 shrink-0 text-accent" />
          <span className="hidden md:inline font-sans text-xs">Mode Terang</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 shrink-0 text-accent-text dark:text-accent" />
          <span className="hidden md:inline font-sans text-xs">Mode Gelap</span>
        </>
      )}
    </button>
  );
}
