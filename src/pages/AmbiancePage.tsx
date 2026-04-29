import ScrollReveal from "@/components/ScrollReveal";
import interieur from "@/assets/interieur.jpg";
import terrasse from "@/assets/terrasse.jpg";
import cocktail from "@/assets/cocktail.jpg";
import amisDiner from "@/assets/amis-diner.jpg";
import barCounter from "@/assets/bar-counter.jpg";
import heroHome from "@/assets/hero-home.jpg";
import { useSettings } from "@/contexts/SettingsContext";

const photos = [interieur, terrasse, cocktail, amisDiner, barCounter, interieur];

const AmbiancePage = () => {
  const { name } = useSettings();
  return (
    <main>
      <div className="pt-[72px]">
        <section className="py-24 text-center">
          <h1 className="font-display text-5xl font-light italic text-foreground md:text-[88px]">L&apos;endroit</h1>
        </section>
      </div>

      <div className="mx-auto max-w-6xl columns-2 gap-4 space-y-4 px-6 pb-24 md:columns-3 md:px-12">
        {photos.map((src, i) => (
          <ScrollReveal key={i} delay={i * 80} className="break-inside-avoid">
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full rounded transition-transform duration-500 hover:scale-[1.02]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </ScrollReveal>
        ))}
      </div>

      <section className="bg-secondary py-20">
        <ScrollReveal className="mx-auto max-w-[720px] px-6">
          <p className="font-display text-xl font-light italic leading-[1.7] text-foreground md:text-[22px]">
            Pousser la porte de {name}, c&apos;est entrer dans un monde à part. Un lieu où le temps ralentit, où la lumière dorée des bougies dessine des ombres douces sur les tables en bois, où chaque détail — du verre posé devant vous au murmure de la musique — a été pensé pour créer un instant de grâce.
          </p>
          <p className="font-display mt-8 text-xl font-light italic leading-[1.7] text-foreground md:text-[22px]">
            Dehors, la terrasse respire sous les étoiles de Lomé. Les plantes tropicales entourent l&apos;espace comme un jardin secret, et les guirlandes lumineuses transforment chaque soirée en fête. Ici, on vient seul·e, entre amis ou en famille — et on repart toujours avec le sourire.
          </p>
        </ScrollReveal>
      </section>

      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden md:h-[70vh]">
        <img
          src={heroHome}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.1)" }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <ScrollReveal className="relative z-10 max-w-3xl px-6 text-center">
          <p className="font-display text-3xl font-light italic text-foreground md:text-5xl">
            Que vous soyez seul·e, entre amis ou en famille.
          </p>
        </ScrollReveal>
      </section>
    </main>
  );
};

export default AmbiancePage;
