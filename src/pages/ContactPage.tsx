import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import TypewriterAddress from "@/components/TypewriterAddress";

const waReserve =
  "https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+faire+une+r%C3%A9servation+%3A";

const ContactPage = () => {
  return (
    <main>
      <div className="pt-[72px]">
        <section className="py-24 text-center">
          <h1 className="font-display text-5xl font-light italic text-foreground md:text-[72px]">Nous rejoindre</h1>
        </section>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-2 md:px-12">
        <ScrollReveal>
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="label-text mb-1 text-muted-foreground">Adresse</p>
                <TypewriterAddress />
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="label-text mb-1 text-muted-foreground">Téléphone</p>
                <a href="tel:+22896949494" className="text-foreground transition-colors hover:text-primary">
                  (+228) 96 94 94 94
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="label-text mb-1 text-muted-foreground">Email</p>
                <a
                  href="mailto:lahuqqatogo@gmail.com"
                  className="text-foreground transition-colors hover:text-primary"
                >
                  lahuqqatogo@gmail.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="label-text mb-1 text-muted-foreground">Horaires</p>
                <p className="text-foreground/80">Lundi – Dimanche · 11h30 – 00h00</p>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.instagram.com/la.huqqa/"
                target="_blank"
                rel="noopener noreferrer"
                className="label-text text-foreground/60 transition-colors hover:text-primary"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/LahuQQa"
                target="_blank"
                rel="noopener noreferrer"
                className="label-text text-foreground/60 transition-colors hover:text-primary"
              >
                Facebook
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex h-full flex-col items-start justify-center rounded bg-primary p-8 md:p-12">
            <h2 className="font-display mb-3 text-3xl text-primary-foreground md:text-4xl">
              Réservez ou commandez via WhatsApp
            </h2>
            <p className="mb-8 text-primary-foreground/80">Réponse rapide · Événements · Commandes</p>
            <a
              href={waReserve}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-text inline-flex items-center gap-2 bg-primary-foreground px-8 py-3 text-primary transition-opacity hover:opacity-90 active:scale-[0.97]"
            >
              <MessageCircle size={18} aria-hidden />
              Ouvrir WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>

      <section className="h-[400px] w-full">
        <iframe
          title="Carte — Lomé"
          src="https://maps.google.com/maps?q=6.17%2C1.22&z=13&hl=fr&output=embed"
          className="h-full w-full border-0"
          style={{ filter: "grayscale(0.6) sepia(0.3)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
};

export default ContactPage;
