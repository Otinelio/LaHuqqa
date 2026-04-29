import { Link } from "react-router-dom";
import logo from "@/assets/LogoLahuQQa.png";
import { useSettings } from "@/contexts/SettingsContext";

const Footer = () => {
  const { tagline, whatsapp, instagram, facebook, name } = useSettings();
  
  return (
    <footer className="border-t border-border bg-footer-bg">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <img src={logo} alt={name} className="h-28 w-auto" />
            <p className="font-display mt-3 text-lg italic text-muted-foreground">{tagline}</p>
          </div>
          <div>
            <p className="label-text mb-2 text-muted-foreground">Navigation</p>
            <nav className="flex flex-col gap-2" aria-label="Pied de page">
              <Link to="/" className="text-sm text-foreground/70 transition-colors hover:text-primary">
                Accueil
              </Link>
              <Link to="/menu" className="text-sm text-foreground/70 transition-colors hover:text-primary">
                Menu
              </Link>
              <Link to="/ambiance" className="text-sm text-foreground/70 transition-colors hover:text-primary">
                Ambiance
              </Link>
              <Link to="/contact" className="text-sm text-foreground/70 transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <p className="label-text mb-2 text-muted-foreground">Contact</p>
            <p>
              <a href={`tel:+${whatsapp}`} className="text-sm text-foreground/70 transition-colors hover:text-primary">
                (+228) {whatsapp.replace("228", "").match(/.{1,2}/g)?.join(" ") || whatsapp}
              </a>
            </p>
            <p className="mt-2">
              <a
                href={`https://${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                @{instagram.split('/').pop()}
              </a>
            </p>
            <p className="mt-2">
              <a
                href={`https://${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                {facebook.split('/').pop()}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-[11px] text-muted-foreground/40">
          © {new Date().getFullYear()} {name} · Lomé, Togo
        </div>
      </div>
    </footer>
  );
};

export default Footer;
