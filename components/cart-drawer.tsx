"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Drawer } from "@/components/ui/drawer";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle } from "lucide-react";

export function CartDrawer() {
  const { items, subtotal, isOpen, close, setQuantity, remove, clear, count } = useCart();

  const [confirmClear, setConfirmClear] = useState(false);
  const confirmTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      const timer = setTimeout(() => {
        setConfirmClear(false);
        if (confirmTimerRef.current) {
          clearTimeout(confirmTimerRef.current);
          confirmTimerRef.current = null;
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, items.length]);

  const handleClearClick = () => {
    if (confirmClear) {
      clear();
      setConfirmClear(false);
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
        confirmTimerRef.current = null;
      }
    } else {
      setConfirmClear(true);
      confirmTimerRef.current = setTimeout(() => {
        setConfirmClear(false);
      }, 3000);
    }
  };

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <ShoppingCart className="h-5 w-5 text-accent" />
      <span>Keranjang</span>
      {count > 0 && (
        <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm border border-border/40 tabular-nums">
          ({count} item)
        </span>
      )}
    </div>
  );

  const drawerFooter = items.length > 0 ? (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="font-heading font-semibold uppercase text-sm text-muted-foreground">
          Subtotal
        </span>
        <span className="font-mono font-bold text-lg text-accent-text tabular-nums">
          {formatRupiah(subtotal)}
        </span>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleClearClick}
          className={`w-full py-2 px-3 rounded-sm text-xs font-medium font-sans border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            confirmClear
              ? "bg-destructive text-white border-destructive hover:opacity-90"
              : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{confirmClear ? "Yakin ingin mengosongkan?" : "Kosongkan keranjang"}</span>
        </button>

        <div className="space-y-1 text-center">
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 bg-muted text-muted-foreground font-semibold text-sm rounded-sm cursor-not-allowed opacity-60 font-sans border border-border/60"
          >
            Lanjut ke Checkout
          </button>
          <p className="text-[11px] text-muted-foreground font-mono flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3 inline" />
            <span>Checkout belum tersedia di versi demo</span>
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={close}
      side="right"
      title={drawerTitle}
      footer={drawerFooter}
      maxWidthClass="w-full sm:max-w-md"
      ariaLabel="Drawer Keranjang Belanja"
    >
      {items.length === 0 ? (
        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40 stroke-1" />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-lg uppercase tracking-wide text-foreground">
              Keranjang Masih Kosong
            </h4>
            <p className="text-xs text-muted-foreground font-sans max-w-[240px]">
              Anda belum menambahkan produk apa pun ke keranjang belanja.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="py-2 px-4 bg-accent text-accent-foreground font-semibold text-xs rounded-sm hover:opacity-90 transition-opacity cursor-pointer font-sans"
          >
            Lihat Produk
          </button>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-border/60">
          {items.map((item) => {
            const isAtMaxStock = item.quantity >= item.stock;

            return (
              <div key={item.productId} className="pt-4 first:pt-0 flex items-start gap-3 group">
                <div className="relative h-14 w-14 bg-muted rounded-sm overflow-hidden flex items-center justify-center border border-border/60 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-heading font-semibold text-sm uppercase text-foreground line-clamp-2 leading-tight">
                      {item.name}
                    </h5>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      className="p-1 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatRupiah(item.price)}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-border rounded-sm bg-background">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer rounded-l-sm"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 text-foreground tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        disabled={isAtMaxStock}
                        aria-label={`Tambah jumlah ${item.name}`}
                        title={isAtMaxStock ? "Batas stok tercapai" : "Tambah jumlah"}
                        className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed rounded-r-sm"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="font-mono text-xs font-bold text-accent-text tabular-nums">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
