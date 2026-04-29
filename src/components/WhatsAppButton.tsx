import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const WhatsAppButton = () => {
  const { whatsapp } = useSettings();
  const waOrder = `https://wa.me/${whatsapp}?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A`;

  const [entered, setEntered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const show = window.setTimeout(() => setEntered(true), 1500);
    const pulseOn = window.setTimeout(() => setPulse(true), 1900);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(pulseOn);
    };
  }, []);

  return (
    <a
      href={waOrder}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-5 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_4px_24px_hsl(var(--primary)/0.5)] md:hidden ${entered ? "scale-100" : "scale-0"} ${pulse ? "whatsapp-pulse-loop" : ""}`}
      style={{
        transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      aria-label="Commander sur WhatsApp"
    >
      <MessageCircle size={28} className="text-primary-foreground" />
    </a>
  );
};

export default WhatsAppButton;
