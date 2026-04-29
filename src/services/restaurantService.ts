import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────
export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  whatsapp: string;
  address: string;
  hours: string;
  email: string;
  instagram: string;
  facebook: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  position: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  category_name?: string;
  image_url: string | null;
  available: boolean;
  position: number;
  created_at: string;
}

// ── Settings ───────────────────────────────────────────
export async function getSettings(): Promise<RestaurantSettings | null> {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) throw error;
  return data as RestaurantSettings;
}

export async function updateSettings(
  data: Partial<Omit<RestaurantSettings, "id" | "updated_at">>
): Promise<void> {
  const { error } = await supabase
    .from("restaurant_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // update all rows (there's only one)

  if (error) throw error;
}

// ── Categories ─────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function addCategory(name: string): Promise<Category> {
  // Get max position
  const cats = await getCategories();
  const maxPos = cats.length > 0 ? Math.max(...cats.map((c) => c.position)) + 1 : 0;

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, position: maxPos })
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  id: string,
  data: Partial<Pick<Category, "name" | "position">>
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function reorderCategories(ids: string[]): Promise<void> {
  const updates = ids.map((id, i) =>
    supabase.from("categories").update({ position: i }).eq("id", id)
  );
  await Promise.all(updates);
}

// ── Menu Items ─────────────────────────────────────────
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, categories(name)")
    .order("position", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as Record<string, unknown>[]).map((item) => ({
    ...item,
    category_name: (item.categories as { name: string } | null)?.name ?? null,
  })) as MenuItem[];
}

export async function getAvailableItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, categories(name, position)")
    .eq("available", true)
    .order("position", { ascending: true });

  if (error) throw error;

  // Sort by category position then item position
  const items = ((data ?? []) as Record<string, unknown>[]).map((item) => ({
    ...item,
    category_name: (item.categories as { name: string; position: number } | null)?.name ?? null,
    _cat_pos: (item.categories as { name: string; position: number } | null)?.position ?? 999,
  })) as (MenuItem & { _cat_pos: number })[];

  items.sort((a, b) => a._cat_pos - b._cat_pos || a.position - b.position);

  return items;
}

export async function addMenuItem(
  data: Pick<MenuItem, "name" | "description" | "price" | "category_id" | "image_url">
): Promise<MenuItem> {
  const { data: result, error } = await supabase
    .from("menu_items")
    .insert({ ...data, available: true, position: 0 })
    .select()
    .single();

  if (error) throw error;
  return result as MenuItem;
}

export async function updateMenuItem(
  id: string,
  data: Partial<Pick<MenuItem, "name" | "description" | "price" | "category_id" | "image_url" | "available" | "position">>
): Promise<void> {
  const { error } = await supabase
    .from("menu_items")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleAvailable(id: string, val: boolean): Promise<void> {
  const { error } = await supabase
    .from("menu_items")
    .update({ available: val })
    .eq("id", id);

  if (error) throw error;
}

// ── Storage ────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
