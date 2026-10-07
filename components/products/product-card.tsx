"use client";

import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

type ProductCardProps = Readonly<{
  product: Product;
  onAddToCart?: (product: Product) => void;
}>;

function getCardButtonLabel(isOutOfStock: boolean, isAtMaxStock: boolean): string {
  if (isOutOfStock) return "Habis";
  if (isAtMaxStock) return "Stok Maksimal";
  return "Tambah ke keranjang";
}

function renderStockInfo(isOutOfStock: boolean, isLowStock: boolean, stock: number) {
  if (isOutOfStock) {
    return <span className="text-destructive font-semibold">Habis</span>;
  }
  if (isLowStock) {
    return <span className="text-accent-text font-semibold">Sisa {stock}</span>;
  }
  return <span>Stok {stock}</span>;
}

export function ProductCard({ product, onAddToCart }: Readonly<ProductCardProps>) {
  const { getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isAtMaxStock = quantityInCart >= product.stock;
  const buttonLabel = getCardButtonLabel(isOutOfStock, isAtMaxStock);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart?.(product);
  };

  return (
    <div className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col justify-between transition-colors hover:border-accent/50 relative">
      <div className="relative aspect-square w-full bg-muted overflow-hidden border-b border-border/60">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity ${
            isOutOfStock ? "opacity-40 grayscale" : "opacity-90 group-hover:opacity-100"
          }`}
        />

        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider z-10">
            Habis
          </div>
        )}

        {!isOutOfStock && isLowStock && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider z-10">
            Sisa {product.stock}
          </div>
        )}

        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-xs border border-accent/40 text-accent-text text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm z-10 flex items-center gap-1 shadow-xs tabular-nums">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Di keranjang: {quantityInCart}</span>
          </div>
        )}

        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-200 ease-in-out bg-card/90 backdrop-blur-xs border-t border-border">
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="w-full py-2 px-3 bg-accent text-accent-foreground font-medium text-xs rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed font-sans"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              {product.category}
            </span>
            {quantityInCart > 0 && (
              <span className="text-[10px] font-mono text-accent-text font-semibold md:hidden">
                Di keranjang: {quantityInCart}
              </span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-base uppercase text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <div className="font-mono text-base font-semibold text-accent-text tabular-nums">
            {formatRupiah(product.price)}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {renderStockInfo(isOutOfStock, isLowStock, product.stock)}
          </div>
        </div>

        <div className="md:hidden pt-1">
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="w-full py-2 px-3 bg-accent text-accent-foreground font-medium text-xs rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed font-sans"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
