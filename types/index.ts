export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
};

export type LoginInput = {
  email: string;
  password: string;
};
