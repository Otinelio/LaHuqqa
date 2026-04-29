import { useEffect, useState, useRef, useCallback } from "react";
import { ChefHat, Hash, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  getActiveOrders, getRecentDoneOrders, updateOrderStatus,
  subscribeToOrders, type Order, type OrderStatus,
} from "@/services/ordersService";
import { useSettings } from "@/contexts/SettingsContext";

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "< 1 min";
  return `${diff} min`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* audio not available */ }
}

/* ── Order Card ───────────────────────────────────────── */
const OrderCard = ({
  order,
  zone,
  onAction,
}: {
  order: Order;
  zone: "pending" | "preparing" | "done";
  onAction?: (id: string, status: OrderStatus) => void;
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calc = () => Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
    setElapsed(calc());
    const iv = setInterval(() => setElapsed(calc()), 15000);
    return () => clearInterval(iv);
  }, [order.created_at]);

  const urgent = zone === "pending" && elapsed >= 5;
  const borderColor = zone === "pending" ? "#F97316" : zone === "preparing" ? "#22C55E" : "#374151";

  return (
    <div
      className="mb-3 rounded-lg p-4"
      style={{
        backgroundColor: zone === "done" ? "#161B27" : "#1C2333",
        borderLeft: `4px solid ${borderColor}`,
        opacity: zone === "done" ? 0.7 : 1,
        animation: urgent ? "kds-pulse 1.2s ease-in-out infinite" : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xl font-bold text-[#E5E7EB]">
          <Hash size={16} className="text-[#9CA3AF]" />
          Table {order.table_number}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
          {formatTime(order.created_at)}
          <span className={`font-bold ${urgent ? "text-[#F97316]" : ""}`}>
            · {timeAgo(order.created_at)}
          </span>
        </span>
      </div>

      {/* Items */}
      <div className="mb-3 space-y-1">
        {order.items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-base text-[#E5E7EB]">
            <span className="font-bold" style={{ color: zone === "pending" ? "#F97316" : "#22C55E" }}>
              {it.qty}x
            </span>
            {it.name}
          </div>
        ))}
      </div>

      {/* Note */}
      {order.note && (
        <p className="mb-3 text-sm italic text-[#9CA3AF]">{order.note}</p>
      )}

      {/* Separator + Total */}
      <div className="mb-3 h-px bg-[#374151]" />
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-[#E5E7EB]">
          {order.total.toLocaleString("fr-FR")} F
        </span>
        {zone === "pending" && onAction && (
          <button
            type="button"
            onClick={() => onAction(order.id, "preparing")}
            className="rounded border border-[#22C55E] bg-transparent px-4 py-2 text-sm font-medium text-[#22C55E] transition-colors hover:bg-[#22C55E] hover:text-white"
          >
            Prendre en charge
          </button>
        )}
        {zone === "preparing" && onAction && (
          <button
            type="button"
            onClick={() => onAction(order.id, "done")}
            className="flex items-center gap-1.5 rounded bg-[#22C55E] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <CheckCircle size={16} />
            Commande prête
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Cuisine Page ─────────────────────────────────────── */
const CuisinePage = () => {
  const { name } = useSettings();
  const [pending, setPending] = useState<Order[]>([]);
  const [preparing, setPreparing] = useState<Order[]>([]);
  const [done, setDone] = useState<Order[]>([]);
  const [connected, setConnected] = useState(true);
  const [clock, setClock] = useState(new Date());
  const initRef = useRef(false);

  // Live clock
  useEffect(() => {
    const iv = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Load data + subscribe
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const load = async () => {
      try {
        const active = await getActiveOrders();
        setPending(active.filter((o) => o.status === "pending"));
        setPreparing(active.filter((o) => o.status === "preparing"));
        const recent = await getRecentDoneOrders(10);
        setDone(recent);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };
    load();

    try {
      subscribeToOrders({
        onInsert: (o) => {
          if (o.status === "pending") {
            setPending((p) => [...p, o]);
            playBeep();
            toast(`Nouvelle commande · Table ${o.table_number}`, {
              duration: 5000,
              style: { background: "#F97316", color: "#fff", border: "none" },
            });
          }
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
    } catch {
      setConnected(false);
    }
  }, []);

  const handleAction = useCallback(async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      if (status === "preparing") {
        setPending((p) => {
          const order = p.find((o) => o.id === id);
          if (order) {
            setPreparing((pr) => {
              if (pr.some(x => x.id === id)) return pr;
              return [...pr, { ...order, status: "preparing" }];
            });
          }
          return p.filter((o) => o.id !== id);
        });
      }
      if (status === "done") {
        setPreparing((p) => {
          const order = p.find((o) => o.id === id);
          if (order) {
            setDone((d) => {
              if (d.some(x => x.id === id)) return d;
              return [{ ...order, status: "done" }, ...d].slice(0, 10);
            });
          }
          return p.filter((o) => o.id !== id);
        });
      }
    } catch {
      toast.error("Erreur de mise à jour");
    }
  }, []);

  const isEmpty = pending.length === 0 && preparing.length === 0;
  const clockStr = clock.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = clock.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D1117", fontFamily: "DM Sans, sans-serif", color: "#E5E7EB" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:px-8" style={{ backgroundColor: "#161B27", borderColor: "#374151" }}>
        <span className="text-base font-bold">{name} · Cuisine</span>
        <span className="hidden text-sm text-[#9CA3AF] md:block">
          {dateStr} — <span className="font-mono font-bold text-[#E5E7EB]">{clockStr}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-[#22C55E]" : "bg-red-500"}`} />
          {connected ? "CONNECTÉ" : "HORS LIGNE"}
        </span>
      </header>

      <p className="py-2 text-center text-xs text-[#9CA3AF]">
        <Clock size={12} className="mr-1 inline" />
        Écran réservé à l'équipe cuisine
      </p>

      {/* Empty state */}
      {isEmpty && done.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-32 text-center">
          <ChefHat size={64} className="mb-4 text-[#374151]" strokeWidth={1.5} />
          <p className="text-lg text-[#9CA3AF]">Aucune commande en cours</p>
          <p className="mt-1 text-sm text-[#6B7280]">Les nouvelles commandes apparaîtront ici automatiquement</p>
        </div>
      )}

      {/* 3-column Kanban */}
      {(!isEmpty || done.length > 0) && (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:p-6">
          {/* Pending */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#F97316", color: "#fff" }}>
                {pending.length}
              </span>
              <span className="text-sm font-semibold text-[#F97316]">Nouvelles commandes</span>
            </div>
            {pending.map((o) => <OrderCard key={o.id} order={o} zone="pending" onAction={handleAction} />)}
            {pending.length === 0 && <p className="text-xs text-[#6B7280]">Aucune nouvelle commande</p>}
          </div>

          {/* Preparing */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#22C55E", color: "#fff" }}>
                {preparing.length}
              </span>
              <span className="text-sm font-semibold text-[#22C55E]">En préparation</span>
            </div>
            {preparing.map((o) => <OrderCard key={o.id} order={o} zone="preparing" onAction={handleAction} />)}
            {preparing.length === 0 && <p className="text-xs text-[#6B7280]">Aucune commande en préparation</p>}
          </div>

          {/* Done */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#374151", color: "#9CA3AF" }}>
                {done.length}
              </span>
              <span className="text-sm font-semibold text-[#9CA3AF]">Terminées</span>
            </div>
            {done.map((o) => <OrderCard key={o.id} order={o} zone="done" />)}
            {done.length === 0 && <p className="text-xs text-[#6B7280]">Aucune commande terminée</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisinePage;
