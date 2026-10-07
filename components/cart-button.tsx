"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type CartButtonProps = Readonly<{
  count?: number;
  className?: string;
  variant?: "default" | "chrome";
}>;

export function CartButton({
  count: propCount,
  className = "",
  variant = "default",
}: Readonly<CartButtonProps>) {
  const { count: cartCount, isReady, open } = useCart();
  const count = propCount !== undefined ? propCount : cartCount;

  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current && prevCountRef.current !== undefined) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  const ariaLabel = isReady && count > 0 ? `Buka keranjang, ${count} item` : "Buka keranjang, keranjang kosong";

  const themeClasses =
    variant === "chrome"
      ? "bg-chrome-foreground/6 hover:bg-chrome-foreground/12 border-chrome-foreground/15 text-chrome-foreground hover:text-white"
      : "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground";

  return (
    <button
      type="button"
      onClick={open}
      aria-label={ariaLabel}
      className={`relative h-9 px-2.5 sm:px-3 rounded-sm border ${themeClasses} transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent select-none ${className}`}
    >
      <ShoppingCart className="h-4 w-4 shrink-0 text-accent" />
      <span className="hidden sm:inline font-heading font-semibold uppercase tracking-wider text-xs">
        Keranjang
      </span>
      {isReady && count > 0 && (
        <span
          className={`bg-accent text-accent-foreground font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs tabular-nums leading-none transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none ${
            isBouncing ? "scale-125" : "scale-100"
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
