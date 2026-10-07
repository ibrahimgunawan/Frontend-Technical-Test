"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/providers/cart-provider";
import { useAuth } from "@/hooks/use-auth";
import { CartDrawer } from "@/components/cart-drawer";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

function AppShellContent({ children }: Readonly<{ children: ReactNode }>) {
  const { status } = useAuth();

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="space-y-4 py-8 animate-pulse">
          <div className="h-8 w-48 bg-card rounded-sm border border-border" />
          <div className="h-4 w-96 bg-card/60 rounded-sm border border-border" />
          <div className="h-40 w-full bg-card/40 rounded-sm border border-border" />
        </div>
      );
    }
    if (status === "authenticated") {
      return children;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
      <AppFooter />
      <CartDrawer />
    </div>
  );
}

export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShellContent>{children}</AppShellContent>
      </CartProvider>
    </AuthProvider>
  );
}
