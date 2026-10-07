"use client";

import { useEffect, useState } from "react";
import type { Table, SortingState } from "@tanstack/react-table";
import type { Product } from "@/types";
import {
  LayoutGrid,
  List,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

type ProductsToolbarProps = Readonly<{
  table: Table<Product>;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}>;

const SORT_OPTIONS: Record<string, SortingState> = {
  "name-asc": [{ id: "name", desc: false }],
  "name-desc": [{ id: "name", desc: true }],
  "price-asc": [{ id: "price", desc: false }],
  "price-desc": [{ id: "price", desc: true }],
  "stock-desc": [{ id: "stock", desc: true }],
};

export function ProductsToolbar({
  table,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount,
}: Readonly<ProductsToolbarProps>) {
  const globalFilter = (table.getState().globalFilter as string) || "";
  const [searchValue, setSearchValue] = useState(globalFilter);
  const [prevGlobalFilter, setPrevGlobalFilter] = useState(globalFilter);

  if (globalFilter !== prevGlobalFilter) {
    setPrevGlobalFilter(globalFilter);
    setSearchValue(globalFilter);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(searchValue || undefined);
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchValue, table]);

  const currentSort = table.getState().sorting[0];
  const currentSortKey = currentSort
    ? `${currentSort.id}-${currentSort.desc ? "desc" : "asc"}`
    : "name-asc";

  const handleSortChange = (key: string) => {
    const target = SORT_OPTIONS[key];
    if (target) table.setSorting(target);
  };

  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="bg-card border border-border p-3 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden px-3 py-2 border border-border bg-background hover:bg-muted text-foreground rounded-sm transition-colors inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 text-accent" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="bg-accent text-accent-foreground font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-sm tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setPrevGlobalFilter("");
                table.setGlobalFilter(undefined);
              }}
              aria-label="Hapus pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-1.5">
          <label htmlFor="sort-select" className="text-xs text-muted-foreground font-mono hidden md:inline">
            Urutkan:
          </label>
          <select
            id="sort-select"
            value={currentSortKey}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Urutkan produk"
            className="px-2.5 py-1.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
          >
            <option value="name-asc">Nama A–Z</option>
            <option value="name-desc">Nama Z–A</option>
            <option value="price-asc">Harga Termurah</option>
            <option value="price-desc">Harga Termahal</option>
            <option value="stock-desc">Stok Terbanyak</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size-select" className="text-xs text-muted-foreground font-mono hidden md:inline">
            Tampilkan:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            aria-label="Jumlah produk per halaman"
            className="px-2.5 py-1.5 text-xs font-mono bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer tabular-nums"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        <div className="inline-flex border border-border rounded-sm bg-background p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Tampilan grid"
            className={`p-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="Tampilan daftar tabel"
            className={`p-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
