import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/LogoLahuQQa.png";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "Menu" },
  { to: "/ambiance", label: "Ambiance" },
  { to: "/contact", label: "Contact" },
];

const waOrder =
  "https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 flex h-[72px] items-center px-6 md:px-12"
        style={{
          backgroundColor: "hsl(var(--background) / 0.92)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.4)" : undefined,
        }}
      >
        <Link to="/" className="flex items-center" aria-label="Retour à l'accueil">
          <img src={logo} alt="La HuQQa" className="h-16 w-auto" />
        </Link>

        <nav className="ml-auto hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="group relative cta-text text-[13px] text-foreground/70 transition-colors hover:text-foreground">
              {label}
              <span className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
          <a
            href={waOrder}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-text border border-primary px-5 py-2 text-[13px] text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            Commander
          </a>
        </nav>

        <button
          type="button"
          className="ml-auto text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <Menu size={28} />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-background transition-transform duration-500 md:hidden ${open ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute right-6 top-5 text-foreground"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
        >
          <X size={28} />
        </button>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} className="font-display text-4xl text-foreground transition-colors hover:text-primary">
            {label}
          </Link>
        ))}
        <a
          href={waOrder}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-text border border-primary px-5 py-2 text-[13px] text-primary"
        >
          Commander
        </a>
      </div>
    </>
  );
};

export default Navbar;
