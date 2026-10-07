"use client";

import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";
import type { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";

type FiltersSidebarProps = Readonly<{
  table: Table<Product>;
  allProducts: Product[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeFilterCount: number;
  onResetFilters: () => void;
}>;

export function FiltersSidebar({
  table,
  allProducts,
  isOpenMobile = false,
  onCloseMobile = () => {},
  activeFilterCount,
  onResetFilters,
}: Readonly<FiltersSidebarProps>) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [allProducts]);

  const categories = useMemo(() => Object.keys(categoryCounts).sort(), [categoryCounts]);

  const categoryColumn = table.getColumn("category");
  const selectedCategories = (categoryColumn?.getFilterValue() as string[]) || [];

  const handleCategoryToggle = (cat: string) => {
    const current = [...selectedCategories];
    const index = current.indexOf(cat);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(cat);
    }
    categoryColumn?.setFilterValue(current.length > 0 ? current : undefined);
  };

  const { absoluteMinPrice, absoluteMaxPrice } = useMemo(() => {
    if (allProducts.length === 0) return { absoluteMinPrice: 0, absoluteMaxPrice: 2000000 };
    const prices = allProducts.map((p) => p.price);
    return {
      absoluteMinPrice: Math.min(...prices),
      absoluteMaxPrice: Math.max(...prices),
    };
  }, [allProducts]);

  const priceColumn = table.getColumn("price");
  const priceFilterValue = (priceColumn?.getFilterValue() as [number, number]) || [
    absoluteMinPrice,
    absoluteMaxPrice,
  ];

  const currentMinPrice = priceFilterValue[0] ?? absoluteMinPrice;
  const currentMaxPrice = priceFilterValue[1] ?? absoluteMaxPrice;

  const priceRangeSpan = absoluteMaxPrice - absoluteMinPrice;
  const minPercent =
    priceRangeSpan > 0
      ? Math.round(((currentMinPrice - absoluteMinPrice) / priceRangeSpan) * 100)
      : 0;
  const maxPercent =
    priceRangeSpan > 0
      ? Math.round(((currentMaxPrice - absoluteMinPrice) / priceRangeSpan) * 100)
      : 100;

  const handleMinPriceChange = (val: number) => {
    const newMin = Math.min(val, currentMaxPrice);
    priceColumn?.setFilterValue([newMin, currentMaxPrice]);
  };

  const handleMaxPriceChange = (val: number) => {
    const newMax = Math.max(val, currentMinPrice);
    priceColumn?.setFilterValue([currentMinPrice, newMax]);
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-heading font-bold text-lg uppercase tracking-wide">
          Filter Produk
        </h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Kategori
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            const count = categoryCounts[cat] || 0;

            return (
              <label
                key={cat}
                className="flex items-center justify-between text-sm cursor-pointer group hover:text-accent-text transition-colors select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat)}
                    className="h-4 w-4 rounded-sm border-border text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer accent-accent"
                  />
                  <span className={isChecked ? "font-semibold text-foreground" : "text-foreground/80"}>
                    {cat}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm border border-border/40 tabular-nums">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Rentang Harga
        </h4>
        <div className="space-y-3">
          <div className="font-mono text-xs font-semibold text-accent-text bg-muted p-2 rounded-sm border border-border/40 text-center tabular-nums">
            {formatRupiah(currentMinPrice)} – {formatRupiah(currentMaxPrice)}
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-mono block">Harga Min</label>
              <input
                type="range"
                min={absoluteMinPrice}
                max={absoluteMaxPrice}
                step={5000}
                value={currentMinPrice}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--accent) ${minPercent}%, transparent ${minPercent}%)`,
                }}
                className="w-full h-2 bg-accent/25 rounded-sm appearance-none cursor-pointer accent-accent border border-accent/30 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-mono block">Harga Maks</label>
              <input
                type="range"
                min={absoluteMinPrice}
                max={absoluteMaxPrice}
                step={5000}
                value={currentMaxPrice}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--accent) ${maxPercent}%, transparent ${maxPercent}%)`,
                }}
                className="w-full h-2 bg-accent/25 rounded-sm appearance-none cursor-pointer accent-accent border border-accent/30 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-muted-foreground font-mono block mb-1">Min (Rp)</span>
              <input
                type="number"
                min={absoluteMinPrice}
                max={currentMaxPrice}
                value={currentMinPrice}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs font-mono rounded-sm bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-accent tabular-nums"
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-mono block mb-1">Maks (Rp)</span>
              <input
                type="number"
                min={currentMinPrice}
                max={absoluteMaxPrice}
                value={currentMaxPrice}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs font-mono rounded-sm bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-accent tabular-nums"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-card border border-border p-5 rounded-sm sticky top-20">
          {sidebarContent}
        </div>
      </aside>

      <Drawer
        isOpen={isOpenMobile}
        onClose={onCloseMobile}
        side="left"
        title="Filter Produk"
        maxWidthClass="w-80 max-w-[85vw]"
        footer={
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-accent text-accent-foreground font-medium text-sm rounded-sm hover:opacity-90 transition-opacity cursor-pointer font-sans"
          >
            Terapkan Filter
          </button>
        }
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
