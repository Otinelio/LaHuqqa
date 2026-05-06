import { Link } from "react-router-dom";
import { MessageCircle, Star, UtensilsCrossed, Wine } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroHome from "@/assets/hero-home.jpg";
import ambiance1 from "@/assets/img/ambiance1.jpg";
import Carousel from "@/components/Carousel";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const { whatsapp, tagline, address, name } = useSettings();
  const waEvent = `https://wa.me/${whatsapp}?text=Bonjour%2C+je+souhaite+organiser+un+%C3%A9v%C3%A9nement+%3A`;

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
            Un voyage de goût et de tradition
          </h1>
          <p className="font-body mt-6 text-base text-foreground/80">{address}</p>
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
            <p className="label-text mb-6 text-primary">Notre Histoire</p>
            <p className="mb-5 text-base leading-[1.7] text-foreground/80">
              {name} est née d&apos;une idée partagée par deux frères. Leur vision était simple mais ambitieuse : créer un restaurant unique où les clients se sentent chez eux, entourés de confort et de convivialité, tout en se régalant des meilleurs délices culinaires.
            </p>
            <p className="mb-5 text-base leading-[1.7] text-foreground/80">
              Nous croyons que les saveurs variées du monde méritent de se retrouver sous un même toit. Notre restaurant est né d&apos;une passion pour la cuisine mondiale et d&apos;un dévouement à vous offrir les meilleures expériences culinaires de chaque coin du monde.
            </p>
            <p className="text-base leading-[1.7] text-foreground/80">
              Avec une attention méticuleuse aux détails et un engagement envers l&apos;authenticité, nous vous invitons à savourer l&apos;essence de chaque culture à travers l&apos;art du goût. Chaque plat est un témoignage de cette mission.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100} className="w-full">
            <img src={ambiance1} alt="" loading="lazy" className="aspect-[4/5] w-full rounded object-cover" />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3 md:px-12">
          {[
            { Icon: UtensilsCrossed, label: "Cuisine mondiale & authentique" },
            { Icon: Wine, label: "Portions généreuses & ingrédients frais" },
            { Icon: Star, label: "Expérience culinaire exceptionnelle" },
          ].map(({ Icon, label }, i) => (
            <ScrollReveal key={label} delay={i * 80} className="py-8 text-center">
              <Icon className="mx-auto mb-4 size-8 text-primary" strokeWidth={1.5} />
              <p className="font-display text-xl text-foreground">{label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          <ScrollReveal order={1} className="order-2 md:order-1">
            <img src={ambiance1} alt="L'équipe" loading="lazy" className="aspect-[4/3] w-full rounded object-cover shadow-2xl" />
          </ScrollReveal>
          <ScrollReveal order={2} className="order-1 md:order-2">
            <p className="label-text mb-6 text-primary">L&apos;Équipe & Le Chef</p>
            <h2 className="font-display mb-6 text-4xl font-light text-foreground">Une passion partagée</h2>
            <p className="mb-5 text-base leading-[1.7] text-foreground/80">
              Notre succès est dû à notre équipe adorable, qui apporte chaleur et dévouement dans tout ce qu&apos;elle fait. Des visages amicaux qui vous accueillent à la porte aux mains expertes qui préparent vos repas, chaque membre est engagé à votre satisfaction.
            </p>
            <p className="text-base leading-[1.7] text-foreground/80">
              Un merci spécial à notre chef talentueux, fort de nombreuses années d&apos;expérience. Sa créativité et son dévouement se traduisent par de magnifiques présentations qui ravissent autant les yeux que le palais.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl py-24 md:py-32">
        <h2 className="font-display mb-12 text-center text-4xl font-light text-foreground md:text-[56px]">L&apos;ambiance</h2>
        <Carousel />
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
