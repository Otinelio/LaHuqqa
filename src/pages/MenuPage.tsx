import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import entreeImg from "@/assets/entree.jpg";
import platPrincipal from "@/assets/plat-principal.jpg";
import fruitsDeMer from "@/assets/fruits-de-mer.jpg";
import dessert from "@/assets/dessert.jpg";
import cocktailImg from "@/assets/cocktail.jpg";

const waBase = "https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+commander+%3A+";

const waOrderFooter =
  "https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A";

type Dish = { name: string; description: string; price: string; image: string };

type Category = { id: string; label: string; dishes: Dish[] };

const categories: Category[] = [
  {
    id: "entrees",
    label: "Entrées",
    dishes: [
      {
        name: "Bruschetta Maison",
        description: "Pain grillé, tomates fraîches, basilic, huile d'olive vierge",
        price: "3 500 F",
        image: entreeImg,
      },
      {
        name: "Salade Tropicale",
        description: "Mangue, avocat, crevettes grillées, vinaigrette passion",
        price: "4 500 F",
        image: entreeImg,
      },
      {
        name: "Nems au Poulet",
        description: "Nems croustillants, sauce aigre-douce maison",
        price: "3 000 F",
        image: entreeImg,
      },
    ],
  },
  {
    id: "plats",
    label: "Plats Principaux",
    dishes: [
      {
        name: "Filet de Bœuf Grillé",
        description: "Bœuf premium, légumes de saison, sauce au poivre",
        price: "12 000 F",
        image: platPrincipal,
      },
      {
        name: "Poulet Braisé",
        description: "Poulet fermier mariné, accompagné d'alloco et piment frais",
        price: "6 500 F",
        image: platPrincipal,
      },
      {
        name: "Riz Jollof Royal",
        description: "Riz parfumé aux épices ouest-africaines, poulet grillé",
        price: "5 500 F",
        image: platPrincipal,
      },
      {
        name: "Côtelettes d'Agneau",
        description: "Agneau tendre, purée de patate douce, jus réduit",
        price: "14 000 F",
        image: platPrincipal,
      },
    ],
  },
  {
    id: "fruits-de-mer",
    label: "Fruits de Mer",
    dishes: [
      {
        name: "Pasta Fruits de Mer",
        description: "Linguine, crevettes, moules, sauce crémeuse à l'ail",
        price: "9 500 F",
        image: fruitsDeMer,
      },
      {
        name: "Crevettes Grillées",
        description: "Crevettes géantes au beurre d'ail et citron vert",
        price: "11 000 F",
        image: fruitsDeMer,
      },
      {
        name: "Poisson du Jour",
        description: "Poisson frais grillé, riz basmati, sauce vierge",
        price: "8 500 F",
        image: fruitsDeMer,
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    dishes: [
      {
        name: "Fondant au Chocolat",
        description: "Cœur coulant, glace vanille artisanale",
        price: "4 000 F",
        image: dessert,
      },
      {
        name: "Crème Brûlée",
        description: "Crème vanille caramélisée au chalumeau",
        price: "3 500 F",
        image: dessert,
      },
      {
        name: "Salade de Fruits Exotiques",
        description: "Mangue, ananas, fruit de la passion, menthe fraîche",
        price: "3 000 F",
        image: dessert,
      },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktails & Boissons",
    dishes: [
      {
        name: "Mojito HuQQa",
        description: "Rhum, menthe fraîche, citron vert, soda artisanal",
        price: "5 000 F",
        image: cocktailImg,
      },
      {
        name: "Lomé Sunset",
        description: "Vodka, jus de mangue, grenadine, glaçons pilés",
        price: "5 500 F",
        image: cocktailImg,
      },
      {
        name: "Bissap Tonic",
        description: "Infusion d'hibiscus, tonic water, citron, gingembre",
        price: "3 500 F",
        image: cocktailImg,
      },
      {
        name: "Old Fashioned",
        description: "Bourbon, sucre, Angostura, zeste d'orange",
        price: "6 000 F",
        image: cocktailImg,
      },
    ],
  },
];

const MenuPage = () => {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>(categories[0].id);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="overflow-x-hidden">
      <div className="pt-[72px]">
        <section className="py-24 text-center">
          <h1 className="font-display text-5xl font-light italic text-foreground md:text-[72px]">La carte</h1>
          <p className="label-text mt-4 text-muted-foreground">Plats · Cocktails · Boissons</p>
          <div className="mx-auto mt-6 h-[1px] w-0 bg-primary line-stretch" />
        </section>
      </div>

      <div
        className={`sticky top-[72px] z-40 border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ${stickyVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-3">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveId(c.id);
                scrollToId(c.id);
              }}
              className={`cta-text whitespace-nowrap rounded-full px-4 py-2 text-[12px] transition-all duration-150 ${activeId === c.id ? "bg-primary text-primary-foreground" : "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-12">
        {categories.map((cat) => (
          <section key={cat.id} id={cat.id} className="mb-20 scroll-mt-[140px]">
            <ScrollReveal>
              <p className="label-text mb-2 text-primary">{cat.label}</p>
              <div className="mb-10 h-[1px] bg-border" />
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {cat.dishes.map((dish, di) => (
                  <ScrollReveal key={`${cat.id}-${dish.name}`} delay={di * 80}>
                    <article className="group overflow-hidden rounded bg-card">
                      <div className="overflow-hidden">
                        <img
                          src={dish.image}
                          alt=""
                          loading="lazy"
                          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-2xl text-foreground">{dish.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{dish.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-body text-base font-bold text-primary">{dish.price}</span>
                          <a
                            href={`${waBase}${encodeURIComponent(dish.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-text inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
                          >
                            <MessageCircle size={14} />
                            Commander
                          </a>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display mb-4 text-3xl text-primary-foreground md:text-4xl">Envie de commander ?</h2>
          <a
            href={waOrderFooter}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-text inline-flex items-center gap-2 bg-primary-foreground px-8 py-3 text-primary transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            Commander sur WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
};

export default MenuPage;
