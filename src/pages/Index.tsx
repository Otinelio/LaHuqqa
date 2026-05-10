import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Star, UtensilsCrossed, Wine, Globe } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroHome from "@/assets/hero-home.jpg";
import ambiance1 from "@/assets/img/ambiance1.jpg";
import ambiance2 from "@/assets/img/ambiance2.jpg";
import interieur from "@/assets/interieur.jpg";
import Carousel from "@/components/Carousel";
import { useSettings } from "@/contexts/SettingsContext";

const CONTENT = {
  fr: {
    history: {
      title: "Notre Histoire",
      paragraphs: [
        "LA HUQQA est née d’une idée partagée par deux frères. Leur vision était simple mais ambitieuse : créer un restaurant unique où les clients se sentent chez eux, entourés de confort et de convivialité, tout en se régalant des meilleurs délices culinaires.",
        "Nous croyons que les saveurs variées du monde méritent de se retrouver sous un même toit. Notre restaurant est né d’une passion pour la cuisine mondiale et d’un dévouement à vous offrir les meilleures expériences culinaires de chaque coin du monde. Avec une attention méticuleuse aux détails et un engagement envers l’authenticité, nous vous invitons à savourer l’essence de chaque culture à travers l’art du goût.",
        "Chaque plat chez LA HUQQA est un témoignage de cette mission. Nos portions sont généreuses, garantissant que chaque client reparte satisfait. Nous utilisons uniquement des ingrédients de la plus haute qualité pour garantir que chaque plat est aussi délicieux et frais que possible."
      ]
    },
    team: {
      title: "L'Équipe & Le Chef",
      paragraphs: [
        "Notre succès est également dû à notre équipe adorable, qui apporte chaleur et dévouement dans tout ce qu’elle fait. Des visages amicaux qui vous accueillent à la porte aux mains expertes qui préparent vos repas, chaque membre de notre équipe est engagé à vous offrir une expérience culinaire exceptionnelle.",
        "Un merci spécial à notre chef talentueux, fort de nombreuses années d’expérience et d’un œil pour les détails, qui apporte sa touche unique à chaque assiette. Sa créativité et son dévouement se traduisent par de magnifiques présentations qui ravissent autant les yeux que le palais.",
        "Bienvenue à LA HUQQA, où chaque repas est un voyage de goût et de tradition, et chaque visite ressemble à un retour à la maison."
      ]
    }
  },
  en: {
    history: {
      title: "Our Story",
      paragraphs: [
        "LA HUQQA was born from a shared idea of two brothers. Their vision was simple yet ambitious: to create a unique restaurant where guests feel at home, surrounded by comfort and coziness, while indulging in the finest culinary delights.",
        "We believe that the world’s diverse flavors deserve to come together under one roof. Our restaurant was born from a passion for global cuisine and a dedication to bringing you the finest culinary experiences from every corner of the world. With meticulous attention to detail and a commitment to authenticity, we invite you to savor the essence of every culture through the art of taste.",
        "Every dish at LA HUQQA is a testament to this mission. Our portions are generous, ensuring that every guest leaves satisfied. We use only the finest quality ingredients to ensure that each dish is as delicious and fresh as possible."
      ]
    },
    team: {
      title: "The Team & The Chef",
      paragraphs: [
        "Our success is also thanks to our lovely team, who bring warmth and dedication to everything they do. From the friendly faces that greet you at the door to the skilled hands preparing your meal, each member of our team is committed to providing you with an exceptional dining experience.",
        "Special thanks to Our talented chef, with years of experience and an eye for detail, adds his unique touch to every plate. His creativity and dedication result in beautiful, mouthwatering presentations that delight both the eyes and the palate.",
        "Welcome to LA HUQQA, where every meal is a journey of taste and tradition, and every visit feels like coming home."
      ]
    }
  }
};

const Index = () => {
  const { whatsapp, address, name } = useSettings();
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const waEvent = `https://wa.me/${whatsapp}?text=Bonjour%2C+je+souhaite+organiser+un+%C3%A9v%C3%A9nement+%3A`;

  const t = CONTENT[lang];

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

      {/* Language Switcher Anchor */}
      <div className="flex justify-center pt-16">
        <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setLang("fr")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              lang === "fr" ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            FRANÇAIS
          </button>
          <button
            onClick={() => setLang("en")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              lang === "en" ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            ENGLISH
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          <ScrollReveal>
            <p className="label-text mb-6 flex items-center gap-2 text-primary">
              <Globe size={14} /> {t.history.title}
            </p>
            <div className="space-y-6">
              {t.history.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-[1.8] text-foreground/85 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="relative w-full">
            <div className="absolute -inset-4 rounded bg-primary/5 blur-3xl" />
            <img src={interieur} alt="" loading="lazy" className="relative aspect-[4/5] w-full rounded object-cover shadow-2xl shadow-primary/10" />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3 md:px-12">
          {[
            { Icon: UtensilsCrossed, label: lang === "fr" ? "Cuisine mondiale & authentique" : "Global & Authentic Cuisine" },
            { Icon: Wine, label: lang === "fr" ? "Portions généreuses & ingrédients frais" : "Generous Portions & Fresh Ingredients" },
            { Icon: Star, label: lang === "fr" ? "Expérience culinaire exceptionnelle" : "Exceptional Dining Experience" },
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
            <div className="grid grid-cols-2 gap-4">
              <img src={ambiance2} alt="L'équipe" loading="lazy" className="aspect-[3/4] w-full rounded object-cover shadow-xl" />
              <img src={ambiance1} alt="Le Chef" loading="lazy" className="mt-8 aspect-[3/4] w-full rounded object-cover shadow-xl" />
            </div>
          </ScrollReveal>
          <ScrollReveal order={2} className="order-1 md:order-2">
            <p className="label-text mb-6 text-primary">{t.team.title}</p>
            <h2 className="font-display mb-8 text-4xl font-light text-foreground md:text-5xl">
              {lang === "fr" ? "Une passion partagée" : "A Shared Passion"}
            </h2>
            <div className="space-y-6">
              {t.team.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-[1.8] text-foreground/85 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl py-24 md:py-32">
        <h2 className="font-display mb-12 text-center text-4xl font-light text-foreground md:text-[56px]">
          {lang === "fr" ? "L'ambiance" : "The Atmosphere"}
        </h2>
        <Carousel />
      </section>

      <section className="bg-primary py-20">
        <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display mb-4 text-3xl font-light text-primary-foreground md:text-5xl">
            {lang === "fr" ? "Organisez votre événement chez nous" : "Host Your Event With Us"}
          </h2>
          <p className="mb-8 max-w-lg mx-auto text-primary-foreground/80">
            {lang === "fr" 
              ? "Anniversaires, réceptions, soirées privées — notre équipe vous accompagne pour créer un moment inoubliable."
              : "Birthdays, receptions, private parties — our team supports you in creating an unforgettable moment."}
          </p>
          <a
            href={waEvent}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-text inline-flex items-center gap-2 bg-primary-foreground px-8 py-3 text-primary transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            {lang === "fr" ? "Nous contacter sur WhatsApp" : "Contact us on WhatsApp"}
          </a>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default Index;
