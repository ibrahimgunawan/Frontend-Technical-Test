"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  ColumnDef,
  FilterFn,
  SortingState,
  ColumnFiltersState,
  Row,
} from "@tanstack/react-table";
import type { Product } from "@/types";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { ProductCard } from "./product-card";
import { ProductListTable } from "./product-list-table";
import { FiltersSidebar } from "./filters-sidebar";
import { ProductsToolbar } from "./products-toolbar";
import { ProductsPagination } from "./products-pagination";
import {
  ProductsLoadingSkeleton,
  ProductsErrorState,
  ProductsEmptyState,
} from "./products-states";

const categoryFilterFn: FilterFn<Product> = (row: Row<Product>, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true;
  const rowValue = row.getValue<string>(columnId);
  return filterValue.includes(rowValue);
};

const priceRangeFilterFn: FilterFn<Product> = (row: Row<Product>, columnId: string, filterValue: [number, number]) => {
  if (!filterValue) return true;
  const rowValue = row.getValue<number>(columnId);
  const [min, max] = filterValue;
  if (min !== undefined && rowValue < min) return false;
  if (max !== undefined && rowValue > max) return false;
  return true;
};

const globalSearchFn: FilterFn<Product> = (row: Row<Product>, _columnId: string, filterValue: string) => {
  if (!filterValue) return true;
  const term = filterValue.toLowerCase().trim();
  const name = row.original.name.toLowerCase();
  const category = row.original.category.toLowerCase();
  return name.includes(term) || category.includes(term);
};

export function ProductsView() {
  const { data: products, loading, error, refetch } = useProducts();
  const { addToCart } = useCart();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });

  const handleColumnFiltersChange = useCallback((updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => {
    setColumnFilters(updater);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleGlobalFilterChange = useCallback((updater: string | ((prev: string) => string)) => {
    setGlobalFilter(updater);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Gambar",
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Nama",
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Kategori",
        enableSorting: true,
        filterFn: categoryFilterFn,
      },
      {
        accessorKey: "price",
        header: "Harga",
        enableSorting: true,
        filterFn: priceRangeFilterFn,
      },
      {
        accessorKey: "stock",
        header: "Stok",
        enableSorting: true,
      },
      {
        id: "action",
        header: "Aksi",
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: setPagination,
    globalFilterFn: globalSearchFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (globalFilter?.trim()) count++;
    const catFilter = columnFilters.find((f) => f.id === "category");
    if (catFilter && Array.isArray(catFilter.value) && catFilter.value.length > 0) {
      count++;
    }
    const priceFilter = columnFilters.find((f) => f.id === "price");
    if (priceFilter && Array.isArray(priceFilter.value)) {
      count++;
    }
    return count;
  }, [globalFilter, columnFilters]);

  const handleResetFilters = useCallback(() => {
    setGlobalFilter("");
    setColumnFilters([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileDrawerOpen]);

  const filteredRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getRowModel().rows;

  const getAriaStatusAnnouncement = () => {
    if (loading) return "Memuat katalog produk";
    if (error) return "Gagal memuat produk";
    return `${filteredRows.length} produk ditemukan.`;
  };

  const renderProductsContent = () => {
    if (loading) {
      return <ProductsLoadingSkeleton viewMode={viewMode} count={pagination.pageSize} />;
    }
    if (error) {
      return <ProductsErrorState onRetry={refetch} />;
    }
    if (filteredRows.length === 0) {
      return <ProductsEmptyState onResetFilters={handleResetFilters} />;
    }
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedRows.map((row) => (
            <ProductCard
              key={row.original.id}
              product={row.original}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      );
    }
    return <ProductListTable table={table} onAddToCart={addToCart} />;
  };

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-live="polite">
        {getAriaStatusAnnouncement()}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <FiltersSidebar
          table={table}
          allProducts={products}
          isOpenMobile={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        <div className="flex-1 space-y-4">
          <ProductsToolbar
            table={table}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {renderProductsContent()}

          {!loading && !error && filteredRows.length > 0 && (
            <ProductsPagination table={table} />
          )}
        </div>
      </div>
    </div>
  );
}
