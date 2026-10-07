"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import type { Product, CartItem } from "@/types";
import {
  CART_STORAGE_KEY,
  loadCartFromStorage,
  saveCartToStorage,
  addItem,
  setQuantity as setCartItemQuantity,
  removeItem as removeCartItem,
  clearCart as clearCartItems,
  cartCount,
  cartSubtotal,
  getItemQuantity as getCartItemQuantity,
} from "@/lib/cart";

export type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isReady: boolean;
  isOpen: boolean;
  addToCart: (product: Product) => void;
  setQuantity: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  getItemQuantity: (productId: number) => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const loaded = loadCartFromStorage();
      setItems(loaded);
      setIsReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      saveCartToStorage(items);
    }
  }, [items, isReady]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        setItems(loadCartFromStorage());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(
    (product: Product) => {
      const res = addItem(items, product, 1);
      if (res.success) {
        setItems(res.items);
        toast.success("Produk berhasil ditambahkan ke keranjang", {
          description: product.name,
        });
      } else {
        if (res.reason === "max_stock") {
          toast.error("Stok tidak mencukupi", {
            description: "Jumlah di keranjang sudah mencapai stok tersedia",
          });
        } else if (res.reason === "out_of_stock") {
          toast.error("Stok habis", {
            description: "Produk ini sedang tidak tersedia",
          });
        }
      }
    },
    [items]
  );

  const setQuantity = useCallback((productId: number, qty: number) => {
    setItems((prevItems) => setCartItemQuantity(prevItems, productId, qty));
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prevItems) => removeCartItem(prevItems, productId));
    toast("Item dihapus dari keranjang");
  }, []);

  const clear = useCallback(() => {
    setItems(clearCartItems());
    toast("Keranjang dikosongkan");
  }, []);

  const getItemQuantityCallback = useCallback(
    (productId: number) => getCartItemQuantity(items, productId),
    [items]
  );

  const count = useMemo(() => cartCount(items), [items]);
  const subtotal = useMemo(() => cartSubtotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isReady,
      isOpen,
      addToCart,
      setQuantity,
      remove,
      clear,
      open,
      close,
      getItemQuantity: getItemQuantityCallback,
    }),
    [
      items,
      count,
      subtotal,
      isReady,
      isOpen,
      addToCart,
      setQuantity,
      remove,
      clear,
      open,
      close,
      getItemQuantityCallback,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}