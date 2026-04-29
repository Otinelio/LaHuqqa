import { useState, useEffect, useCallback } from "react";
import {
  LogOut, Pencil, Trash2, Check, X, ChevronUp, ChevronDown,
  Plus, Save, Clock, Hash, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getActiveOrders, getRecentDoneOrders, updateOrderStatus,
  subscribeToOrders, type Order, type OrderStatus,
} from "@/services/ordersService";
import {
  getSettings, updateSettings as saveSettings,
  getCategories, addCategory, updateCategory, deleteCategory, reorderCategories,
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailable, uploadImage,
  type RestaurantSettings, type Category, type MenuItem,
} from "@/services/restaurantService";
import { useSettings } from "@/contexts/SettingsContext";

// ⚠️ À changer avant déploiement
const ADMIN_PASSWORD = "huqqa2025";

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "À l'instant";
  if (diff < 60) return `Il y a ${diff} min`;
  return `Il y a ${Math.floor(diff / 60)}h`;
}

/* ── Login Screen ─────────────────────────────────────── */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const { name } = useSettings();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (pw === ADMIN_PASSWORD) { localStorage.setItem("admin_auth", "true"); onLogin(); }
    else setErr("Mot de passe incorrect");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="w-full max-w-sm px-6 text-center">
        <p className="mb-8 text-xl font-bold text-gray-700">{name} · Admin</p>
        <input type="password" placeholder="Mot de passe" value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="h-12 w-full rounded-lg border border-gray-200 px-4 text-gray-900 bg-white outline-none focus:border-gray-400" />
        {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
        <button type="button" onClick={submit}
          className="mt-4 h-12 w-full rounded-lg bg-[#1A1208] text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90">
          Accéder
        </button>
      </div>
    </div>
  );
};

/* ── Tab: Menu ────────────────────────────────────────── */
const MenuTab = ({ cats, items, reload }: {
  cats: Category[]; items: MenuItem[]; reload: () => void;
}) => {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category_id: cats[0]?.id || "", image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.name || !form.price) return;
    setBusy(true);
    try {
      let finalImageUrl = form.image_url;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      if (editId) {
        await updateMenuItem(editId, { name: form.name, description: form.description, price: parseFloat(form.price.replace(/[^\d.]/g, "")), category_id: form.category_id, image_url: finalImageUrl || null });
        toast.success("Plat modifié");
      } else {
        await addMenuItem({ name: form.name, description: form.description, price: parseFloat(form.price.replace(/[^\d.]/g, "")), category_id: form.category_id, image_url: finalImageUrl || null });
        toast.success("Plat ajouté");
      }
      reload();
      setAdding(false); setEditId(null);
      setForm({ name: "", description: "", price: "", category_id: cats[0]?.id || "", image_url: "" });
      setImageFile(null);
    } catch { toast.error("Erreur de sauvegarde"); }
    setBusy(false);
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await toggleAvailable(item.id, !item.available);
      reload();
    } catch { toast.error("Erreur"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteMenuItem(id); reload(); setDelConfirm(null); toast.success("Plat supprimé"); }
    catch { toast.error("Erreur de suppression"); }
  };

  return (
    <div>
      {cats.map((cat) => {
        const catItems = items.filter((i) => i.category_id === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{cat.name}</p>
            {catItems.map((d) => (
              <div key={d.id} className="mb-2 flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                {d.image_url && (
                  <img src={d.image_url} alt="" className="h-10 w-10 rounded object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.price.toLocaleString("fr-FR")} F</p>
                </div>
                <button type="button" onClick={() => handleToggle(d)}
                  className={`h-6 w-10 rounded-full transition-colors ${d.available ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${d.available ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <button type="button" onClick={() => {
                  setEditId(d.id);
                  setForm({ name: d.name, description: d.description || "", price: String(d.price), category_id: d.category_id || "", image_url: d.image_url || "" });
                  setImageFile(null);
                  setAdding(true);
                }} className="text-gray-400 hover:text-gray-700"><Pencil size={16} strokeWidth={1.5} /></button>
                {delConfirm === d.id ? (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => handleDelete(d.id)} className="text-red-500"><Check size={16} /></button>
                    <button type="button" onClick={() => setDelConfirm(null)} className="text-gray-400"><X size={16} /></button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setDelConfirm(d.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} strokeWidth={1.5} /></button>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {adding ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <input placeholder="Nom *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mb-2 h-10 w-full rounded border border-gray-200 px-3 text-sm text-gray-900 bg-white outline-none focus:border-gray-400" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mb-2 w-full resize-none rounded border border-gray-200 p-3 text-sm text-gray-900 bg-white outline-none focus:border-gray-400" rows={2} />
          <input placeholder="Prix FCFA *" type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mb-2 h-10 w-full rounded border border-gray-200 px-3 text-sm text-gray-900 bg-white outline-none focus:border-gray-400" />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="mb-2 h-10 w-full rounded border border-gray-200 px-3 text-sm text-gray-900 bg-white outline-none">
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Image du plat (Optionnel)</label>
            {(imageFile || form.image_url) && (
              <img 
                src={imageFile ? URL.createObjectURL(imageFile) : form.image_url} 
                alt="Aperçu" 
                className="mb-2 h-20 w-32 rounded object-cover border border-gray-200" 
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => {
              if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
            }} className="w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} disabled={busy}
              className="h-10 rounded-lg bg-[#1A1208] px-6 text-xs font-semibold uppercase text-white disabled:opacity-50">
              {busy ? <Loader2 size={14} className="animate-spin" /> : editId ? "Modifier" : "Ajouter"}
            </button>
            <button type="button" onClick={() => { setAdding(false); setEditId(null); setImageFile(null); }}
              className="h-10 rounded-lg border border-gray-200 px-6 text-xs font-semibold uppercase text-gray-600">Annuler</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => { setForm({ name: "", description: "", price: "", category_id: cats[0]?.id || "", image_url: "" }); setImageFile(null); setAdding(true); }}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800">
          <Plus size={16} /> Ajouter un plat
        </button>
      )}
    </div>
  );
};

/* ── Tab: Catégories ──────────────────────────────────── */
const CategoriesTab = ({ cats, items, reload }: {
  cats: Category[]; items: MenuItem[]; reload: () => void;
}) => {
  const [newCat, setNewCat] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const handleAdd = async () => {
    const name = newCat.trim();
    if (!name) return;
    try { await addCategory(name); reload(); setNewCat(""); toast.success("Catégorie ajoutée"); }
    catch { toast.error("Erreur"); }
  };

  const handleRename = async (id: string) => {
    try { await updateCategory(id, { name: editLabel }); reload(); setEditId(null); }
    catch { toast.error("Erreur"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteCategory(id); reload(); setDelConfirm(null); toast.success("Catégorie supprimée"); }
    catch { toast.error("Erreur de suppression"); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...cats];
    const t = next[idx]; next[idx] = next[idx + dir]; next[idx + dir] = t;
    try { await reorderCategories(next.map((c) => c.id)); reload(); }
    catch { toast.error("Erreur"); }
  };

  return (
    <div>
      {cats.map((c, i) => {
        const count = items.filter((d) => d.category_id === c.id).length;
        return (
          <div key={c.id} className="mb-2 flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
            {editId === c.id ? (
              <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} autoFocus
                onBlur={() => handleRename(c.id)}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm text-gray-900 bg-white outline-none" />
            ) : (
              <p className="flex-1 cursor-pointer text-sm font-medium text-gray-800"
                onClick={() => { setEditId(c.id); setEditLabel(c.name); }}>
                {c.name} <span className="text-xs text-gray-400">({count})</span>
              </p>
            )}
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp size={16} /></button>
            <button type="button" disabled={i === cats.length - 1} onClick={() => move(i, 1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown size={16} /></button>
            {delConfirm === c.id ? (
              <span className="flex gap-1">
                <button type="button" onClick={() => handleDelete(c.id)} className="text-red-500"><Check size={16} /></button>
                <button type="button" onClick={() => setDelConfirm(null)} className="text-gray-400"><X size={16} /></button>
              </span>
            ) : (
              <button type="button" onClick={() => setDelConfirm(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} strokeWidth={1.5} /></button>
            )}
          </div>
        );
      })}
      <div className="mt-4 flex gap-2">
        <input placeholder="Nouvelle catégorie" value={newCat} onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-10 flex-1 rounded border border-gray-200 px-3 text-sm text-gray-900 bg-white outline-none focus:border-gray-400" />
        <button type="button" onClick={handleAdd} className="h-10 rounded-lg bg-[#1A1208] px-4 text-xs font-semibold uppercase text-white">Ajouter</button>
      </div>
    </div>
  );
};

/* ── Tab: Commandes ───────────────────────────────────── */
const OrdersTab = () => {
  const [pending, setPending] = useState<Order[]>([]);
  const [preparing, setPreparing] = useState<Order[]>([]);
  const [done, setDone] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const load = async () => {
      try {
        const active = await getActiveOrders();
        setPending(active.filter((o) => o.status === "pending"));
        setPreparing(active.filter((o) => o.status === "preparing"));
        const recent = await getRecentDoneOrders(10);
        setDone(recent);
      } catch { /* Supabase error */ }
    };
    load();
    try {
      cleanup = subscribeToOrders({
        onInsert: (o) => { 
          if (o.status === "pending") setPending((p) => {
            if (p.some(x => x.id === o.id)) return p;
            return [...p, o];
          }); 
        },
        onUpdate: (o) => {
          setPending((p) => {
            const filtered = p.filter((x) => x.id !== o.id);
            if (o.status === "pending" && !filtered.some(x => x.id === o.id)) return [...filtered, o];
            return filtered;
          });
          setPreparing((p) => {
            const filtered = p.filter((x) => x.id !== o.id);
            if (o.status === "preparing" && !filtered.some(x => x.id === o.id)) return [...filtered, o];
            return filtered;
          });
          setDone((p) => {
            const filtered = p.filter((x) => x.id !== o.id);
            if (o.status === "done" && !filtered.some(x => x.id === o.id)) return [o, ...filtered].slice(0, 10);
            return filtered;
          });
        },
      });
    } catch { /* ignore */ }
    return () => cleanup?.();
  }, []);

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      if (status === "preparing") {
        const order = pending.find((o) => o.id === id);
        setPending((p) => p.filter((o) => o.id !== id));
        if (order) {
          setPreparing((p) => {
            if (p.some(x => x.id === id)) return p;
            return [...p, { ...order, status: "preparing" }];
          });
        }
      }
      if (status === "done") {
        const order = preparing.find((o) => o.id === id);
        setPreparing((p) => p.filter((o) => o.id !== id));
        if (order) {
          setDone((p) => {
            if (p.some(x => x.id === id)) return p;
            return [{ ...order, status: "done" }, ...p].slice(0, 10);
          });
        }
      }
    } catch { toast.error("Erreur de mise à jour"); }
  };

  const OrderCard = ({ order, zone }: { order: Order; zone: "pending" | "preparing" | "done" }) => {
    const elapsed = Math.floor((now - new Date(order.created_at).getTime()) / 60000);
    const urgent = zone === "pending" && elapsed >= 5;
    return (
      <div className={`mb-3 rounded-lg border p-4 ${zone === "pending" ? "border-red-200 bg-red-50" : zone === "preparing" ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"}`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-bold text-gray-800"><Hash size={14} />Table {order.table_number}</span>
          <span className={`flex items-center gap-1 text-xs ${urgent ? "font-bold text-[#F97316]" : "text-gray-500"}`}>
            <Clock size={12} />{timeAgo(order.created_at)}
          </span>
        </div>
        <div className="mb-2">
          {order.items.map((it, i) => <p key={i} className="text-sm text-gray-700">{it.qty}x {it.name}</p>)}
        </div>
        {order.note && <p className="mb-2 text-xs italic text-gray-500">{order.note}</p>}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800">{order.total.toLocaleString("fr-FR")} F</span>
          {zone === "pending" && (
            <button type="button" onClick={() => changeStatus(order.id, "preparing")}
              className="rounded border border-amber-500 px-3 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-500 hover:text-white">
              Prendre en charge
            </button>
          )}
          {zone === "preparing" && (
            <button type="button" onClick={() => changeStatus(order.id, "done")}
              className="rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600">
              Commande prête
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-500">En attente ({pending.length})</h3>
        {pending.length === 0 && <p className="text-xs text-gray-400">Aucune commande</p>}
        {pending.map((o) => <OrderCard key={o.id} order={o} zone="pending" />)}
      </div>
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500">En préparation ({preparing.length})</h3>
        {preparing.length === 0 && <p className="text-xs text-gray-400">Aucune commande</p>}
        {preparing.map((o) => <OrderCard key={o.id} order={o} zone="preparing" />)}
      </div>
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Terminées ({done.length})</h3>
        {done.length === 0 && <p className="text-xs text-gray-400">Aucune commande</p>}
        {done.map((o) => <OrderCard key={o.id} order={o} zone="done" />)}
      </div>
    </div>
  );
};

/* ── Tab: Paramètres ──────────────────────────────────── */
const SettingsTab = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((s) => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fields: { key: keyof Pick<RestaurantSettings, "name" | "tagline" | "whatsapp" | "address" | "hours" | "email" | "instagram" | "facebook">; label: string }[] = [
    { key: "name", label: "Nom du restaurant" }, { key: "tagline", label: "Tagline" },
    { key: "whatsapp", label: "WhatsApp" }, { key: "address", label: "Adresse" },
    { key: "hours", label: "Horaires" }, { key: "email", label: "Email" },
    { key: "instagram", label: "Instagram" }, { key: "facebook", label: "Facebook" },
  ];

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { id, updated_at, ...data } = settings;
      void id; void updated_at;
      await saveSettings(data);
      toast.success("Paramètres sauvegardés");
    } catch { toast.error("Erreur de sauvegarde"); }
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-gray-400">Chargement…</p>;
  if (!settings) return <p className="text-sm text-gray-400">Impossible de charger les paramètres</p>;

  return (
    <div className="max-w-lg">
      {fields.map(({ key, label }) => (
        <div key={key} className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
          <input value={settings[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            className="h-10 w-full rounded border border-gray-200 px-3 text-sm text-gray-900 bg-white outline-none focus:border-gray-400" />
        </div>
      ))}
      <button type="button" onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-[#1A1208] px-5 py-2.5 text-xs font-semibold uppercase text-white disabled:opacity-50">
        <Save size={14} />{saving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    </div>
  );
};

/* ── Main Admin Page ──────────────────────────────────── */
const AdminPage = () => {
  const { name } = useSettings();
  const [authed, setAuthed] = useState(() => localStorage.getItem("admin_auth") === "true");
  const [tab, setTab] = useState<"menu" | "categories" | "orders" | "settings">("menu");
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [c, m] = await Promise.all([getCategories(), getMenuItems()]);
      setCats(c); setItems(m);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed, loadData]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_auth");
    setAuthed(false);
    window.location.href = "/";
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "menu", label: "Menu" }, { id: "categories", label: "Catégories" },
    { id: "orders", label: "Commandes" }, { id: "settings", label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
        <h1 className="text-base font-bold text-gray-800">{name} · Admin</h1>
        <button type="button" onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <LogOut size={16} strokeWidth={1.5} />Déconnexion
        </button>
      </header>
      <div className="sticky top-14 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl gap-1 px-4 md:px-8">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${tab === t.id ? "border-b-2 border-gray-800 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        {loading ? (
          <p className="text-sm text-gray-400">Chargement…</p>
        ) : (
          <>
            {tab === "menu" && <MenuTab cats={cats} items={items} reload={loadData} />}
            {tab === "categories" && <CategoriesTab cats={cats} items={items} reload={loadData} />}
            {tab === "orders" && <OrdersTab />}
            {tab === "settings" && <SettingsTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
