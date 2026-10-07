"use client";

import Image from "next/image";
import type { Table, HeaderGroup, Header, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ChevronsUpDown, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

type ProductListTableProps = Readonly<{
  table: Table<Product>;
  onAddToCart?: (product: Product) => void;
}>;

function getHeaderAlignment(columnId: string): string {
  if (columnId === "price" || columnId === "stock") return "text-right";
  if (columnId === "action") return "text-center w-28";
  if (columnId === "image") return "text-left w-16";
  return "text-left";
}

function renderSortIcon(isSorted: false | "asc" | "desc") {
  if (isSorted === "asc") return <ArrowUp className="h-3.5 w-3.5 text-accent" />;
  if (isSorted === "desc") return <ArrowDown className="h-3.5 w-3.5 text-accent" />;
  return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />;
}

function renderStockStatus(isOutOfStock: boolean, stock: number) {
  if (isOutOfStock) {
    return <span className="text-destructive font-semibold">Habis</span>;
  }
  if (stock <= 5) {
    return <span className="text-accent-text font-semibold">Sisa {stock}</span>;
  }
  return <span className="text-muted-foreground">Stok {stock}</span>;
}

function getTableActionLabel(isOutOfStock: boolean, isAtMaxStock: boolean): string {
  if (isOutOfStock) return "Habis";
  if (isAtMaxStock) return "Maksimal";
  return "Tambah";
}

function renderHeaderCellContent(header: Header<Product, unknown>) {
  if (header.isPlaceholder) return null;

  const headerContent = flexRender(
    header.column.columnDef.header,
    header.getContext()
  );

  if (!header.column.getCanSort()) {
    return headerContent;
  }

  const isSorted = header.column.getIsSorted();

  return (
    <button
      type="button"
      onClick={header.column.getToggleSortingHandler()}
      aria-label={`Urutkan berdasarkan ${header.column.columnDef.header}`}
      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer select-none"
    >
      {headerContent}
      {renderSortIcon(isSorted)}
    </button>
  );
}

export function ProductListTable({ table, onAddToCart }: Readonly<ProductListTableProps>) {
  const { getItemQuantity } = useCart();

  return (
    <div className="border border-border bg-card rounded-sm overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse min-w-[640px]">
        <thead className="bg-muted/40 border-b border-border font-heading uppercase tracking-wider text-xs text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Product>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: Header<Product, unknown>) => (
                <th
                  key={header.id}
                  className={`p-3 font-semibold ${getHeaderAlignment(
                    header.column.id
                  )}`}
                >
                  {renderHeaderCellContent(header)}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-border/60">
          {table.getRowModel().rows.map((row: Row<Product>) => {
            const product = row.original;
            const isOutOfStock = product.stock === 0;
            const quantityInCart = getItemQuantity(product.id);
            const isAtMaxStock = quantityInCart >= product.stock;

            return (
              <tr
                key={row.id}
                className="hover:bg-muted/40 transition-colors group"
              >
                <td className="p-3 w-16">
                  <div className="relative h-12 w-12 bg-muted rounded-sm overflow-hidden flex items-center justify-center border border-border/60">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className={`object-contain p-1 ${
                        isOutOfStock ? "opacity-40 grayscale" : "opacity-90"
                      }`}
                    />
                  </div>
                </td>

                <td className="p-3 font-heading font-semibold uppercase text-foreground">
                  <div className="flex items-center gap-2">
                    <span>{product.name}</span>
                    {quantityInCart > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-text bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded-sm tabular-nums">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                        Di keranjang: {quantityInCart}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-3 font-mono text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded-sm border border-border/40">
                    {product.category}
                  </span>
                </td>

                <td className="p-3 text-right font-mono text-accent-text font-semibold tabular-nums">
                  {formatRupiah(product.price)}
                </td>

                <td className="p-3 text-right font-mono text-xs tabular-nums">
                  {renderStockStatus(isOutOfStock, product.stock)}
                </td>

                <td className="p-3 text-center w-28">
                  <button
                    type="button"
                    onClick={() => onAddToCart?.(product)}
                    disabled={isOutOfStock}
                    aria-label={`Tambah ${product.name} ke keranjang`}
                    className="py-1.5 px-3 bg-accent text-accent-foreground font-medium text-xs rounded-sm hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed font-sans"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>{getTableActionLabel(isOutOfStock, isAtMaxStock)}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
