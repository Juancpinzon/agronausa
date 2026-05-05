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
  consentRequired: boolean;
  consentMarketing: boolean;
  policyVersion: string;
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
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: input,
    });

    if (error) throw new Error(error.message);
    if (data && data.error) throw new Error(data.error);

    return data as Order;
  }

  return { createOrder };
}
