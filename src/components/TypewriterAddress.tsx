import { useEffect, useRef, useState } from "react";

const FULL = "Bd. de la Kara, non loin du CEG Tokoin Wuiti, Lomé, Togo";

const TypewriterAddress = () => {
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    if (shown >= FULL.length) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), 25);
    return () => window.clearTimeout(id);
  }, [active, shown]);

  return (
    <p ref={ref} className="font-body text-base text-primary">
      {FULL.slice(0, shown)}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default TypewriterAddress;
