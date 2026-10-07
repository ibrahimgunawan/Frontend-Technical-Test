"use client";

import { AlertTriangle, SearchX, RotateCcw, RefreshCw } from "lucide-react";

type ProductsLoadingSkeletonProps = Readonly<{
  viewMode: "grid" | "list";
  count?: number;
}>;

export function ProductsLoadingSkeleton({ viewMode, count = 9 }: Readonly<ProductsLoadingSkeletonProps>) {
  const items = Array.from({ length: count });

  if (viewMode === "list") {
    return (
      <div className="border border-border bg-card rounded-sm p-4 space-y-3 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-muted/60 rounded-sm w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-sm p-4 space-y-4 animate-pulse">
          <div className="aspect-square bg-muted/60 rounded-sm w-full" />
          <div className="space-y-2">
            <div className="h-3 w-1/3 bg-muted/60 rounded-sm" />
            <div className="h-5 w-3/4 bg-muted/60 rounded-sm" />
          </div>
          <div className="h-4 w-1/2 bg-muted/60 rounded-sm pt-2" />
        </div>
      ))}
    </div>
  );
}

type ProductsErrorStateProps = Readonly<{
  onRetry: () => void;
}>;

export function ProductsErrorState({ onRetry }: Readonly<ProductsErrorStateProps>) {
  return (
    <div className="bg-card border border-border p-8 rounded-sm text-center space-y-4 max-w-md mx-auto my-8">
      <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading font-bold text-xl uppercase tracking-wide">
          Gagal Memuat Produk
        </h3>
        <p className="text-xs text-muted-foreground">
          Terjadi kendala saat menghubungkan ke server produk. Silakan periksa koneksi Anda dan coba lagi.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-accent text-accent-foreground font-medium text-xs rounded-sm hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 cursor-pointer font-sans"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Coba lagi</span>
      </button>
    </div>
  );
}

type ProductsEmptyStateProps = Readonly<{
  onResetFilters: () => void;
}>;

export function ProductsEmptyState({ onResetFilters }: Readonly<ProductsEmptyStateProps>) {
  return (
    <div className="bg-card border border-border p-8 rounded-sm text-center space-y-4 max-w-md mx-auto my-8">
      <div className="inline-flex p-3 rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-8 w-8 text-accent-text" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading font-bold text-xl uppercase tracking-wide">
          Tidak Ada Produk Yang Cocok
        </h3>
        <p className="text-xs text-muted-foreground">
          Tidak ada produk yang memenuhi kriteria pencarian atau filter yang Anda pilih. Coba sesuaikan filter atau kata kunci.
        </p>
      </div>
      <button
        type="button"
        onClick={onResetFilters}
        className="px-4 py-2 border border-border bg-background hover:bg-accent hover:text-accent-foreground font-medium text-xs rounded-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer font-sans"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset filter</span>
      </button>
    </div>
  );
}
