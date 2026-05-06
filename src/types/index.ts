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

// Módulo Inventario
export interface InventoryMovement {
  id: string;
  product_id: string;
  type: 'entrada' | 'salida' | 'ajuste' | 'pedido';
  quantity: number;
  stock_before: number;
  stock_after: number;
  reason?: string;
  order_id?: string;
  created_by?: string;
  created_at: string;
}

// Módulo Proveedores
export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  category_ids: string[];
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Módulo Configuración
export type AppSettingKey =
  | 'site_name'
  | 'whatsapp_number'
  | 'low_stock_threshold'
  | 'alert_pending_hours'
  | 'admin_email'
  | 'store_department'
  | 'store_city'
  | 'store_address'
  | 'terms_version';

export type AppSettings = Record<AppSettingKey, string>;

// Módulo Alertas
export interface Alert {
  id: string;
  type: 'stock_bajo' | 'pedido_sin_atender' | 'sin_imagen';
  severity: 'critica' | 'advertencia';
  title: string;
  description: string;
  action_url: string;
  created_at: string;
  product_id?: string;
  order_id?: string;
}

// Módulo Analytics
export interface FinancialSummary {
  revenue_total: number;
  orders_count: number;
  avg_ticket: number;
  orders_by_status: Record<OrderStatus, number>;
  top_products: Array<{
    product_name: string;
    units_sold: number;
    revenue: number;
  }>;
  revenue_by_day: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  new_customers: number;
}
