import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────
export type OrderStatus = "pending" | "preparing" | "done";

export interface OrderItem {
  name: string;
  qty: number;
  price: string;
}

export interface Order {
  id: string;
  table_number: string;
  items: OrderItem[];
  total: number;
  note: string | null;
  status: OrderStatus;
  created_at: string;
}

// ── Mutations ──────────────────────────────────────────
export async function submitOrder(
  tableNumber: string,
  items: OrderItem[],
  total: number,
  note?: string
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      table_number: tableNumber,
      items: items as unknown as Record<string, unknown>[],
      total,
      note: note || null,
      status: "pending" as OrderStatus,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

// ── Queries ────────────────────────────────────────────
export async function getActiveOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .neq("status", "done")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getRecentDoneOrders(
  limit = 10
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Order[];
}

// ── Realtime ───────────────────────────────────────────
export function subscribeToOrders({
  onInsert,
  onUpdate,
}: {
  onInsert?: (order: Order) => void;
  onUpdate?: (order: Order) => void;
}): () => void {
  const channel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      (payload) => {
        onInsert?.(payload.new as Order);
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "orders" },
      (payload) => {
        onUpdate?.(payload.new as Order);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
