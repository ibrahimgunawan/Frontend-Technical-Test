import { z } from "zod";
import type { Product, CartItem } from "@/types";

export type { CartItem };

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string(),
  stock: z.number().int().nonnegative(),
});

export const cartSchema = z.array(cartItemSchema);

export const CART_STORAGE_KEY = "cart";

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = cartSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors 
  }
}

export type AddItemResult = {
  items: CartItem[];
  success: boolean;
  reason?: "out_of_stock" | "max_stock";
};

export function addItem(items: CartItem[], product: Product, qty: number = 1): AddItemResult {
  if (product.stock <= 0) {
    return { items, success: false, reason: "out_of_stock" };
  }

  const existingIndex = items.findIndex((i) => i.productId === product.id);

  if (existingIndex > -1) {
    const existing = items[existingIndex];
    if (existing.quantity >= product.stock) {
      return { items, success: false, reason: "max_stock" };
    }
    const newQty = Math.min(existing.quantity + qty, product.stock);
    const updated = [...items];
    updated[existingIndex] = {
      ...existing,
      quantity: newQty,
      stock: product.stock,
      price: product.price,
    };
    return { items: updated, success: true };
  } else {
    const newQty = Math.min(qty, product.stock);
    const newItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: newQty,
      image: product.image,
      stock: product.stock,
    };
    return { items: [...items, newItem], success: true };
  }
}

export function setQuantity(items: CartItem[], productId: number, qty: number): CartItem[] {
  if (qty <= 0) {
    return removeItem(items, productId);
  }
  return items.map((item) => {
    if (item.productId === productId) {
      const clampedQty = Math.min(qty, item.stock);
      return { ...item, quantity: clampedQty };
    }
    return item;
  });
}

export function removeItem(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function clearCart(): CartItem[] {
  return [];
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function getItemQuantity(items: CartItem[], productId: number): number {
  const found = items.find((i) => i.productId === productId);
  return found ? found.quantity : 0;
}
