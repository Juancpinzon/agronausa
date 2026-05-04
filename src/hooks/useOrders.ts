import { supabase } from "../lib/supabase";
import type {
  CartItem,
  Order,
  OrderItem,
  CustomerSnapshot,
  Address,
  StockConflict,
} from "../types";

interface CreateOrderInput {
  cartItems: CartItem[];
  customer: CustomerSnapshot;
  shippingAddress: Address;
  notes?: string;
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AGN-${year}-`;

  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .like("order_number", `${prefix}%`);

  const next = (count ?? 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

export async function validateStock(
  cartItems: CartItem[]
): Promise<StockConflict[]> {
  const ids = cartItems.map((i) => i.product_id);

  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock")
    .in("id", ids);

  if (error) throw new Error(error.message);

  const conflicts: StockConflict[] = [];
  for (const item of cartItems) {
    const row = (data ?? []).find((p) => p.id === item.product_id);
    const available = row?.stock ?? 0;
    if (available < item.quantity) {
      conflicts.push({
        product_id: item.product_id,
        product_name: item.product_name,
        requested: item.quantity,
        available,
      });
    }
  }
  return conflicts;
}

export function useOrders() {
  async function createOrder(input: CreateOrderInput): Promise<Order> {
    const { cartItems, customer, shippingAddress, notes } = input;

    const orderNumber = await generateOrderNumber();

    const items: OrderItem[] = cartItems.map((i) => ({
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      unit: i.unit,
      price_applied: i.price_applied,
      subtotal: i.price_applied * i.quantity,
    }));

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const total = subtotal; // no discounts or shipping fee in phase 1

    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      order_number: orderNumber,
      customer_id: user?.id ?? null,
      customer_snapshot: customer,
      items,
      subtotal,
      total,
      status: "pendiente",
      shipping_address: shippingAddress,
      notes: notes ?? null,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Order;
  }

  return { createOrder };
}
