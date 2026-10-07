"use client";

import type { Table } from "@tanstack/react-table";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductsPaginationProps = Readonly<{
  table: Table<Product>;
}>;

export function ProductsPagination({ table }: Readonly<ProductsPaginationProps>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  if (totalRows === 0) return null;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      pages.push(0);
      if (pageIndex > 2) pages.push("...");
      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(pageCount - 2, pageIndex + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (pageIndex < pageCount - 3) pages.push("...");
      pages.push(pageCount - 1);
    }
    return pages;
  };

  return (
    <div className="bg-card border border-border p-3 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div className="text-muted-foreground font-mono tabular-nums">
        Menampilkan <span className="font-semibold text-foreground">{startRow}</span>–
        <span className="font-semibold text-foreground">{endRow}</span> dari{" "}
        <span className="font-semibold text-accent-text">{totalRows}</span> produk
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!canPrevious}
          aria-label="Halaman sebelumnya"
          className="px-2.5 py-1.5 border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1 font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={p}
                type="button"
                onClick={() => table.setPageIndex(p)}
                aria-label={`Ke halaman ${p + 1}`}
                className={`min-w-[32px] h-8 px-2 rounded-sm border text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                  pageIndex === p
                    ? "bg-accent text-accent-foreground font-bold border-accent"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                {p + 1}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground font-mono">
                …
              </span>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!canNext}
          aria-label="Halaman berikutnya"
          className="px-2.5 py-1.5 border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1 font-medium"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
