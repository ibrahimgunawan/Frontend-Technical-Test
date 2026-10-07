"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export type DrawerProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidthClass?: string;
  ariaLabel?: string;
}>;

export function Drawer({
  isOpen,
  onClose,
  side = "right",
  title,
  children,
  footer,
  className = "",
  maxWidthClass = "w-full sm:max-w-md",
  ariaLabel,
}: Readonly<DrawerProps>) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector<HTMLElement>("button, [tabindex]");
      closeBtn?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);

      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClass = side === "left" ? "left-0" : "right-0";

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || (typeof title === "string" ? title : "Drawer")}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`relative ${positionClass} ${maxWidthClass} bg-card text-foreground h-full border-${
          side === "left" ? "r" : "l"
        } border-border shadow-xl flex flex-col justify-between z-10 ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border p-4 shrink-0">
            <div className="font-heading font-bold text-lg uppercase tracking-wider text-foreground">
              {title}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="p-1.5 rounded-sm border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && (
          <div className="border-t border-border p-4 bg-card shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
