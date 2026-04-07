import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-[72px] text-center">
      <h1 className="font-display text-5xl font-light italic text-foreground md:text-6xl">404</h1>
      <p className="mt-4 text-foreground/80">Cette page n&apos;existe pas.</p>
      <Link to="/" className="cta-text mt-8 border border-primary px-6 py-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
};

export default NotFound;
