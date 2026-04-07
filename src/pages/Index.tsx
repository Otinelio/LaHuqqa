import { Link } from "react-router-dom";
import { MessageCircle, Star, UtensilsCrossed, Wine } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroHome from "@/assets/hero-home.jpg";
import interieur from "@/assets/interieur.jpg";
import terrasse from "@/assets/terrasse.jpg";
import cocktail from "@/assets/cocktail.jpg";
import amisDiner from "@/assets/amis-diner.jpg";

const waEvent =
  "https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+organiser+un+%C3%A9v%C3%A9nement+%3A";

const Index = () => {
  return (
    <main>
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <img
          src={heroHome}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/85" />
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="font-display text-5xl font-light italic leading-[1.05] text-foreground md:text-[88px]">
            Une expérience au goût unique.
          </h1>
          <p className="font-body mt-6 text-base text-foreground/80">Tokoin Wuiti · Lomé, Togo</p>
          <Link
            to="/menu"
            className="cta-text mt-10 inline-block border border-foreground/40 px-8 py-3 text-foreground transition-all duration-200 hover:border-primary hover:text-primary active:scale-[0.97]"
          >
            Découvrir le menu
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          <ScrollReveal>
            <p className="label-text mb-6 text-primary">L&apos;esprit du lieu</p>
            <p className="mb-5 text-base leading-[1.7] text-foreground/80">
              La HuQQa est née d&apos;une envie simple : créer un espace où l&apos;on se sent bien. Un lieu où la cuisine locale togolaise rencontre les saveurs internationales, où chaque plat est une invitation au voyage, et où le cadre transforme un repas en un moment précieux.
            </p>
            <p className="mb-5 text-base leading-[1.7] text-foreground/80">
              Des cocktails construits avec soin, une terrasse baignée de lumières dorées, un intérieur feutré qui invite à la conversation — ici, tout est pensé pour que l&apos;instant dure. Que vous soyez en tête-à-tête ou entre amis, La HuQQa s&apos;adapte.
            </p>
            <p className="text-base leading-[1.7] text-foreground/80">
              C&apos;est aussi le lieu de vos événements : anniversaires, réceptions privées, soirées d&apos;entreprise. Chaque occasion trouve son écrin au cœur de Tokoin Wuiti.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100} className="w-full">
            <img src={interieur} alt="" loading="lazy" className="aspect-[4/5] w-full rounded object-cover" />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3 md:px-12">
          {[
            { Icon: UtensilsCrossed, label: "Cuisine locale & internationale" },
            { Icon: Wine, label: "Cocktails & boissons artisanaux" },
            { Icon: Star, label: "Cadre chic & convivial" },
          ].map(({ Icon, label }, i) => (
            <ScrollReveal key={label} delay={i * 80} className="py-8 text-center">
              <Icon className="mx-auto mb-4 size-8 text-primary" strokeWidth={1.5} />
              <p className="font-display text-xl text-foreground">{label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <h2 className="font-display mb-16 text-center text-4xl font-light text-foreground md:text-[56px]">L&apos;ambiance</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <ScrollReveal className="col-span-2 row-span-2 h-full min-h-[200px] md:min-h-[320px]">
            <img
              src={terrasse}
              alt=""
              loading="lazy"
              className="h-full w-full rounded object-cover transition-transform duration-500 hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <img
              src={cocktail}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded object-cover transition-transform duration-500 hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <img
              src={amisDiner}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded object-cover transition-transform duration-500 hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-primary py-20">
        <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display mb-4 text-3xl font-light text-primary-foreground md:text-5xl">Organisez votre événement chez nous</h2>
          <p className="mb-8 max-w-lg text-primary-foreground/80">
            Anniversaires, réceptions, soirées privées — notre équipe vous accompagne pour créer un moment inoubliable.
          </p>
          <a
            href={waEvent}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-text inline-flex items-center gap-2 bg-primary-foreground px-8 py-3 text-primary transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            Nous contacter sur WhatsApp
          </a>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default Index;
