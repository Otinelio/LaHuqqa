import { useEffect, useState, useCallback } from "react";
import { MessageCircle, Plus, Minus, X, ShoppingBag, Hash, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { submitOrder, type OrderItem } from "@/services/ordersService";
import { getAvailableItems, getCategories, type MenuItem, type Category } from "@/services/restaurantService";
import entreeImg from "@/assets/entree.jpg";
import platPrincipal from "@/assets/plat-principal.jpg";
import fruitsDeMer from "@/assets/fruits-de-mer.jpg";
import dessertImg from "@/assets/dessert.jpg";
import cocktailImg from "@/assets/cocktail.jpg";
import { useSettings } from "@/contexts/SettingsContext";

// Fallback images by category name keyword
function getFallbackImage(catName: string | null | undefined): string {
  if (!catName) return entreeImg;
  const lower = catName.toLowerCase();
  if (lower.includes("entrée") || lower.includes("entree")) return entreeImg;
  if (lower.includes("plat")) return platPrincipal;
  if (lower.includes("fruit") || lower.includes("mer")) return fruitsDeMer;
  if (lower.includes("dessert")) return dessertImg;
  if (lower.includes("cocktail") || lower.includes("boisson")) return cocktailImg;
  return entreeImg;
}

type Dish = { id: string; name: string; description: string; price: string; image: string; priceNum: number };
type MenuCategory = { id: string; label: string; dishes: Dish[] };

interface CartItem extends Dish {
  qty: number;
}

function formatPrice(val: number): string {
  return val.toLocaleString("fr-FR") + " F";
}

/* ── Skeleton Card ────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="overflow-hidden rounded bg-card">
    <div className="aspect-video w-full animate-pulse bg-[#2A1E0F]" />
    <div className="p-5 space-y-3">
      <div className="h-6 w-3/4 animate-pulse rounded bg-[#2A1E0F]" />
      <div className="h-4 w-full animate-pulse rounded bg-[#2A1E0F]" />
      <div className="flex justify-between">
        <div className="h-5 w-20 animate-pulse rounded bg-[#2A1E0F]" />
        <div className="h-5 w-24 animate-pulse rounded bg-[#2A1E0F]" />
      </div>
    </div>
  </div>
);

/* ── Table Modal ──────────────────────────────────────── */
const TableModal = ({ onConfirm }: { onConfirm: (n: string) => void }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const confirm = () => {
    const v = value.trim();
    if (!v || !/^\d+$/.test(v)) {
      setError("Veuillez entrer un numéro valide");
      return;
    }
    onConfirm(v);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1208]">
      <div className="w-full max-w-sm px-6 text-center">
        <Hash className="mx-auto mb-4 text-primary" size={40} strokeWidth={1.5} />
        <h2 className="font-display text-[32px] italic text-foreground">
          Votre numéro de table
        </h2>
        <p className="mt-2 font-body text-sm text-foreground/70">
          Entrez le numéro inscrit sur votre table
        </p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="ex : 5"
          value={value}
          onChange={(e) => {
            const filtered = e.target.value.replace(/\D/g, "");
            setValue(filtered);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          className="mt-6 h-[52px] w-full rounded bg-[#2A1E0F] border border-primary text-center font-body text-2xl font-bold text-foreground outline-none placeholder:text-foreground/30 focus:ring-2 focus:ring-primary"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          type="button"
          onClick={confirm}
          className="mt-4 h-[52px] w-full rounded bg-primary font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.97]"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};

/* ── Cart Drawer ──────────────────────────────────────── */
const CartDrawer = ({
  cart,
  tableNumber,
  onClose,
  onUpdateQty,
  onRemove,
  onSubmit,
  submitting,
}: {
  cart: CartItem[];
  tableNumber: string;
  onClose: () => void;
  onUpdateQty: (name: string, delta: number) => void;
  onRemove: (name: string) => void;
  onSubmit: (note: string) => void;
  submitting: boolean;
}) => {
  const [note, setNote] = useState("");
  const total = cart.reduce((s, i) => s + i.priceNum * i.qty, 0);

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[81] flex max-h-[85vh] flex-col rounded-t-2xl bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-display text-2xl text-foreground">Votre commande</h3>
          <button type="button" onClick={onClose} className="text-foreground/60 hover:text-foreground">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.map((item) => (
            <div key={item.name} className="mb-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-foreground">{item.name}</p>
                <p className="font-body text-xs text-primary">{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onUpdateQty(item.name, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-foreground/70 hover:border-primary hover:text-primary">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-body text-sm font-bold text-foreground">{item.qty}</span>
                <button type="button" onClick={() => onUpdateQty(item.name, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-foreground/70 hover:border-primary hover:text-primary">
                  <Plus size={14} />
                </button>
                <button type="button" onClick={() => onRemove(item.name)}
                  className="ml-1 text-foreground/40 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4">
          <textarea
            placeholder="Notes (allergies, cuisson…)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 w-full resize-none rounded bg-muted p-3 font-body text-sm text-foreground outline-none placeholder:text-muted-foreground"
            rows={2}
          />
          <div className="mb-4 flex items-center justify-between">
            <span className="font-body text-sm text-foreground/70">Total</span>
            <span className="font-body text-lg font-bold text-primary">{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            onClick={() => onSubmit(note)}
            disabled={submitting}
            className="h-[52px] w-full rounded bg-primary font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 size={20} className="mx-auto animate-spin" />
            ) : (
              `Commander · Table ${tableNumber}`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── MenuPage ─────────────────────────────────────────── */
interface MenuPageProps {
  scanMode?: boolean;
}

const MenuPage = ({ scanMode = false }: MenuPageProps) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const { whatsapp } = useSettings();

  const waBase = `https://wa.me/${whatsapp}?text=Bonjour%2C+je+souhaite+commander+%3A+`;
  const waOrderFooter = `https://wa.me/${whatsapp}?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A`;

  // Scan mode state
  const [tableNumber, setTableNumber] = useState<string>(() =>
    scanMode ? localStorage.getItem("tableNumber") || "" : ""
  );
  const [showTableModal, setShowTableModal] = useState(() => scanMode && !localStorage.getItem("tableNumber"));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, items] = await Promise.all([getCategories(), getAvailableItems()]);
        const grouped: MenuCategory[] = cats.map((cat: Category) => ({
          id: cat.id,
          label: cat.name,
          dishes: items
            .filter((item: MenuItem) => item.category_id === cat.id)
            .map((item: MenuItem) => ({
              id: item.id,
              name: item.name,
              description: item.description || "",
              price: formatPrice(item.price),
              priceNum: item.price,
              image: item.image_url || getFallbackImage(cat.name),
            })),
        })).filter((cat: MenuCategory) => cat.dishes.length > 0);

        setMenuCategories(grouped);
        if (grouped.length > 0) setActiveId(grouped[0].id);
      } catch {
        // Supabase error — empty menu
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId = "";
      const offset = scanMode ? 180 : 240; // Adjust offset based on sticky header heights

      for (const cat of menuCategories) {
        const el = document.getElementById(cat.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            currentActiveId = cat.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (menuCategories.length > 0) {
        setActiveId(menuCategories[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuCategories, scanMode]);

  // Scroll active pill into view
  useEffect(() => {
    if (activeId) {
      const btn = document.getElementById(`pill-${activeId}`);
      const container = document.getElementById("category-pills-container");
      if (btn && container) {
        const scrollLeft = btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeId]);

  const scrollToId = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTableConfirm = (n: string) => {
    localStorage.setItem("tableNumber", n);
    setTableNumber(n);
    setShowTableModal(false);
  };

  const addToCart = useCallback((dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === dish.name);
      if (existing) {
        return prev.map((i) => (i.name === dish.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...dish, qty: 1 }];
    });
    toast.success(`${dish.name} ajouté au panier`);
  }, []);

  const updateQty = useCallback((name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const handleSubmitOrder = async (note: string) => {
    setSubmitting(true);
    const items: OrderItem[] = cart.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    }));
    const total = cart.reduce((s, i) => s + i.priceNum * i.qty, 0);

    const msg = `Commande — Table ${tableNumber} :\n` +
      cart.map((i) => `${i.qty}x ${i.name}`).join("\n") +
      `\n\nTotal : ${formatPrice(total)} FCFA` +
      (note ? `\nNote : ${note}` : "");
    const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

    try {
      await submitOrder(tableNumber, items, total, note || undefined);
      toast.success(`Commande envoyée en cuisine · Table ${tableNumber}`, {
        duration: 3000,
        style: { background: "#22C55E", color: "#fff", border: "none" },
      });
    } catch {
      window.open(waUrl, "_blank");
      toast.error("Erreur, redirection vers WhatsApp", { duration: 3000 });
    }

    setCart([]);
    setDrawerOpen(false);
    setSubmitting(false);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.priceNum * i.qty, 0);

  return (
    <main className="overflow-x-hidden">
      {scanMode && showTableModal && <TableModal onConfirm={handleTableConfirm} />}
      {scanMode && tableNumber && (
        <div className="fixed right-4 top-4 z-40 rounded-full bg-primary/90 px-4 py-1.5 font-body text-sm font-semibold text-primary-foreground">
          Table {tableNumber}
        </div>
      )}

      <div className={scanMode ? "pt-4" : "pt-[72px]"}>
        <section className="py-24 text-center">
          <h1 className="font-display text-5xl font-light italic text-foreground md:text-[72px]">La carte</h1>
          <p className="label-text mt-4 text-muted-foreground">Plats · Cocktails · Boissons</p>
          <div className="mx-auto mt-6 h-[1px] w-0 bg-primary line-stretch" />
        </section>
      </div>

      {/* Fixed category pills */}
      {!loading && menuCategories.length > 0 && (
        <div
          className={`fixed left-0 right-0 ${scanMode ? "top-0" : "top-[72px]"} z-40 border-b border-border bg-background/95 backdrop-blur-sm`}
        >
          <div id="category-pills-container" className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-3">
            {menuCategories.map((c) => (
              <button
                key={c.id}
                id={`pill-${c.id}`}
                type="button"
                onClick={() => scrollToId(c.id)}
                className={`cta-text whitespace-nowrap rounded-full px-4 py-2 text-[12px] transition-all duration-150 ${
                  activeId === c.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`mx-auto max-w-6xl px-6 pb-16 md:px-12 ${scanMode ? "pt-[60px]" : "pt-[108px]"}`}>
        {/* Skeleton loading */}
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <section key={i} className="mb-20">
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-[#2A1E0F]" />
                <div className="mb-10 h-[1px] bg-border" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[0, 1, 2, 3].map((j) => <SkeletonCard key={j} />)}
                </div>
              </section>
            ))}
          </>
        )}

        {/* Real content */}
        {!loading && menuCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="mb-20 scroll-mt-[140px]">
            <ScrollReveal>
              <p className="label-text mb-2 text-primary">{cat.label}</p>
              <div className="mb-10 h-[1px] bg-border" />
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {cat.dishes.map((dish, di) => (
                <ScrollReveal key={`${cat.id}-${dish.name}`} delay={di * 80}>
                  <article className="group flex h-full flex-col overflow-hidden rounded bg-card shadow-sm">
                    <div className="overflow-hidden">
                      <img
                        src={dish.image}
                        alt=""
                        loading="lazy"
                        className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3 md:p-5">
                      <h3 className="font-display text-[15px] leading-tight text-foreground md:text-xl lg:text-2xl">{dish.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-foreground/60 md:text-sm">{dish.description}</p>
                      
                      <div className="mt-auto pt-4 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                        <span className="font-body text-sm font-bold text-primary md:text-base">{dish.price}</span>
                        {scanMode ? (
                          <button
                            type="button"
                            onClick={() => addToCart(dish)}
                            className="cta-text flex w-full items-center justify-center gap-1 rounded-full border border-primary px-3 py-1.5 text-[11px] text-primary transition-colors hover:bg-primary hover:text-primary-foreground xl:w-auto md:text-[12px]"
                          >
                            <Plus size={14} />
                            Ajouter
                          </button>
                        ) : (
                          <a
                            href={`${waBase}${encodeURIComponent(dish.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-text flex w-full items-center justify-center gap-1 rounded-full border border-primary px-3 py-1.5 text-[11px] text-primary transition-colors hover:bg-primary hover:text-primary-foreground xl:w-auto md:text-[12px]"
                          >
                            <MessageCircle size={14} />
                            Commander
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>
        ))}

        {/* Empty state */}
        {!loading && menuCategories.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-foreground/60">Le menu est en cours de préparation.</p>
          </div>
        )}
      </div>

      {!scanMode && (
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display mb-4 text-3xl text-primary-foreground md:text-4xl">Envie de commander ?</h2>
            <a href={waOrderFooter} target="_blank" rel="noopener noreferrer"
              className="cta-text inline-flex items-center gap-2 bg-primary-foreground px-8 py-3 text-primary transition-opacity hover:opacity-90 active:scale-[0.97]">
              <MessageCircle size={18} />
              Commander sur WhatsApp
            </a>
          </div>
        </section>
      )}

      {scanMode && cartCount > 0 && (
        <button type="button" onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.97]">
          <ShoppingBag size={20} />
          Panier · {cartCount}
          <span className="ml-1 text-xs opacity-80">{formatPrice(cartTotal)}</span>
        </button>
      )}

      {scanMode && drawerOpen && (
        <CartDrawer
          cart={cart}
          tableNumber={tableNumber}
          onClose={() => setDrawerOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onSubmit={handleSubmitOrder}
          submitting={submitting}
        />
      )}
    </main>
  );
};

export default MenuPage;
