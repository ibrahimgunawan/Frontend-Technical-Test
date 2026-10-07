"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types";

async function fetchProductsApi(onUnauthorized: () => void): Promise<Product[] | null> {
  const res = await fetch("/api/products", { cache: "no-store" });

  if (res.status === 401) {
    onUnauthorized();
    return null;
  }

  if (!res.ok) {
    throw new Error("Gagal mengambil data produk");
  }

  const json = await res.json();
  if (!Array.isArray(json?.data)) {
    throw new Error("Format data produk tidak valid");
  }

  return json.data;
}

export function useProducts() {
  const { handleUnauthorized } = useAuth();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchProductsApi(handleUnauthorized)
      .then((products) => {
        if (!isMounted || !products) return;
        setData(products);
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [handleUnauthorized]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(false);

    fetchProductsApi(handleUnauthorized)
      .then((products) => {
        if (products) setData(products);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [handleUnauthorized]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
