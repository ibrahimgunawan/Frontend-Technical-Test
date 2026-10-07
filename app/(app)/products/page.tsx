import Link from "next/link";
import { ProductsView } from "@/components/products/products-view";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border p-6 rounded-sm space-y-1">
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <Link href="/products" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <span>&gt;</span>
          <span className="text-accent-text font-semibold">Produk</span>
        </nav>
        <h1 className="font-heading font-bold text-3xl uppercase tracking-wider text-foreground">
          Katalog Produk
        </h1>
      </div>

      <ProductsView />
    </div>
  );
}
