export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  price_retail: number;
  price_wholesale?: number;
  unit: string;
  min_wholesale_qty?: number;
  stock: number;
  images: string[];
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// Snapshot of product data captured at add-to-cart time
export interface CartItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  unit: string;
  quantity: number;
  price_applied: number;
  stock: number;
}

export interface CustomerSnapshot {
  full_name: string;
  email: string;
  phone: string;
  business_name?: string;
}

export interface Address {
  department: string;
  city: string;
  address_line: string;
  reference?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  price_applied: number;
  subtotal: number;
}

export type OrderStatus =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "despachado"
  | "entregado"
  | "cancelado";

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_snapshot: CustomerSnapshot;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  shipping_address: Address;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StockConflict {
  product_id: string;
  product_name: string;
  requested: number;
  available: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  customer_type: "persona" | "negocio";
  business_name?: string | null;
  nit?: string | null;
  has_special_pricing: boolean;
  created_at: string;
}

export interface SpecialPricing {
  id: string;
  customer_id: string;
  product_id: string;
  price: number;
  created_at: string;
}
