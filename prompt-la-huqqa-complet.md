# 🔥 PROMPT COMPLET — SITE LA HUQQA (PHASES 1 + 2)
> À coller intégralement dans **Cursor**, **Antigravity** ou tout autre éditeur IA.
> Tout est inclus : design system, animations, menu, admin, scan QR, écran cuisine temps réel.
> Reproduit à l'identique le site existant — ne rien inventer en plus, ne rien oublier.

---

## 🎯 OBJECTIF

Construire un site vitrine + outil de gestion pour **La HuQQa**, restaurant-café à Tokoin Wuiti, Lomé, Togo.

Trois volets :
1. **Site public** (4 pages) — magazine gastronomique nocturne
2. **Outils internes** (3 routes cachées) — admin · menu scanné en salle · écran cuisine temps réel
3. **Backend Supabase** uniquement pour les commandes en temps réel

---

## 🛠 STACK TECHNIQUE OBLIGATOIRE

- **React 18** + **Vite 5** + **TypeScript 5**
- **Tailwind CSS v3** (avec `tailwindcss-animate`)
- **react-router-dom** v6
- **lucide-react** (toutes les icônes — JAMAIS d'emoji)
- **@tanstack/react-query**
- **shadcn/ui** (composants : button, card, dialog, input, tabs, toast, tooltip, sonner)
- **@supabase/supabase-js** (uniquement pour la table `orders`)
- Polices Google Fonts : **Cormorant Garamond** (titres) + **DM Sans** (corps)

---

## 🎨 DESIGN SYSTEM — `src/index.css`

Remplace tout le contenu par :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 30 38% 5%;        /* #1A1208 — fond nocturne */
    --foreground: 36 38% 87%;       /* #EDE3CC — ivoire */
    --card: 24 40% 8%;
    --card-foreground: 36 38% 87%;
    --popover: 30 38% 5%;
    --popover-foreground: 36 38% 87%;
    --primary: 38 87% 41%;          /* #C8860A — ambre/or */
    --primary-foreground: 30 38% 5%;
    --secondary: 24 50% 24%;
    --secondary-foreground: 36 38% 87%;
    --muted: 24 30% 15%;
    --muted-foreground: 36 20% 60%;
    --accent: 38 87% 41%;
    --accent-foreground: 30 38% 5%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 24 30% 18%;
    --input: 24 30% 18%;
    --ring: 38 87% 41%;
    --radius: 0.25rem;
    --sidebar-background: 30 38% 5%;
    --sidebar-foreground: 36 38% 87%;
    --sidebar-primary: 38 87% 41%;
    --sidebar-primary-foreground: 30 38% 5%;
    --sidebar-accent: 24 50% 24%;
    --sidebar-accent-foreground: 36 38% 87%;
    --sidebar-border: 24 30% 18%;
    --sidebar-ring: 38 87% 41%;
    --ivory: 40 43% 93%;
    --earth: 24 50% 24%;
    --footer-bg: 30 55% 3%;
  }
}

@layer base {
  * { @apply border-border; }
  html { scroll-behavior: smooth; }
  body {
    @apply bg-background text-foreground;
    font-family: 'DM Sans', sans-serif;
  }
  h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant Garamond', serif; }
  img {
    filter: contrast(1.05) brightness(0.97) saturate(1.08);
    transition: filter 400ms ease;
  }
  img:hover { filter: contrast(1.08) brightness(1.05) saturate(1.15); }
}

@layer components {
  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }
  .label-text   { @apply font-body text-xs font-medium uppercase tracking-[0.1em]; }
  .cta-text     { @apply font-body text-sm font-semibold uppercase tracking-[0.08em]; }
  .section-enter { animation: section-fade-in 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .line-stretch  { animation: stretch-line 0.6s cubic-bezier(0.16,1,0.3,1) both; }
}

@keyframes section-fade-in {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes stretch-line { from { width: 0; } to { width: 120px; } }
@keyframes loading-letter {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes stretch-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes whatsapp-pulse {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.08); }
}
@keyframes whatsapp-bounce-in { from { transform: scale(0); } to { transform: scale(1); } }
```

Dans **`index.html`**, ajouter dans `<head>` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>La HuQQa · Restaurant-Café · Lomé</title>
<meta name="description" content="La HuQQa — restaurant-café à Tokoin Wuiti, Lomé. Une expérience au goût unique.">
```

Dans **`tailwind.config.ts`**, ajouter dans `theme.extend.colors` :
```ts
ivory: 'hsl(var(--ivory))',
earth: 'hsl(var(--earth))',
'footer-bg': 'hsl(var(--footer-bg))',
```

---

## 📁 STRUCTURE DE FICHIERS À CRÉER

```
src/
├── App.tsx                        (modifié — voir routes)
├── index.css                      (voir ci-dessus)
├── assets/
│   ├── hero-home.jpg              (image générée — restaurant nocturne ambre)
│   ├── interieur.jpg              (intérieur tamisé)
│   ├── terrasse.jpg               (terrasse végétale soir)
│   ├── bar-counter.jpg            (bar bouteilles éclairées)
│   ├── amis-diner.jpg             (groupe à table)
│   ├── entree.jpg
│   ├── plat-principal.jpg
│   ├── fruits-de-mer.jpg
│   ├── dessert.jpg
│   └── cocktail.jpg
├── components/
│   ├── LoadingScreen.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   └── ScrollReveal.tsx
├── pages/
│   ├── Index.tsx
│   ├── MenuPage.tsx
│   ├── AmbiancePage.tsx
│   ├── ContactPage.tsx
│   ├── AdminPage.tsx
│   ├── CuisinePage.tsx
│   └── NotFound.tsx
└── services/
    └── ordersService.ts
```

---

## 🧩 COMPOSANTS PARTAGÉS

### `src/components/LoadingScreen.tsx`
Écran de chargement plein écran, fond `#1A1208`, séquence en 3 temps :
1. Apparition lettre par lettre du mot **« HuQQa »** en `Cormorant Garamond` italic 96px ivoire (`#EDE3CC`), animation `loading-letter` avec délai de 80ms par lettre.
2. Une ligne ambre (`#C8860A`) de 1px se dessine sous le mot avec `stretch-underline` (origine left, scaleX 0 → 1, 600ms).
3. Sous-titre **« Une expérience au goût unique »** en `DM Sans` italic 14px opacity 0.7 fade-in.
Après 2400ms total, `onComplete()` est appelé puis l'écran disparaît avec un fade-out 400ms.
Props : `{ onComplete: () => void }`.

### `src/components/Navbar.tsx`
- Fixe top, hauteur 72px, padding `px-6 md:px-12`, z-50
- Background : `rgba(26,18,8,0.92)` + `backdrop-filter: blur(12px)`
- Au scroll > 80px : `box-shadow: 0 2px 24px rgba(0,0,0,0.4)`
- Logo gauche : `<Link to="/">La HuQQa</Link>` en Cormorant Garamond italic 22px
- Liens desktop (`md:flex`) : Accueil · Menu · Ambiance · Contact, classe `cta-text text-[13px] text-foreground/70 hover:text-foreground`. Soulignement ambre qui se déploie de gauche à droite au hover (scale-x).
- Bouton CTA desktop : « Commander » → `https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A`, bordure ambre, fond transparent, hover inversion couleurs.
- Mobile : bouton burger (icône `Menu` lucide) qui ouvre un overlay plein écran (translate-x 100% → 0 en 400ms cubic-bezier(0.16,1,0.3,1)) avec liens en Cormorant 4xl centrés et bouton `X` en haut à droite.
- Ferme l'overlay automatiquement au changement de route (`useLocation`).

### `src/components/Footer.tsx`
Fond `bg-footer-bg`, border-top, `py-16`, grille 3 colonnes :
- Col 1 : « La HuQQa » Cormorant 2xl italic + tagline « Une expérience au goût unique. »
- Col 2 : navigation (Accueil, Menu, Ambiance, Contact)
- Col 3 : Contact — `(+228) 96 94 94 94`, Instagram `@la.huqqa`, Facebook `La.huqqa`
- Bas : « © 2024 La HuQQa · Lomé, Togo » texte 11px opacity 40 centré

### `src/components/WhatsAppButton.tsx`
Bouton flottant fixe `bottom-6 right-6 z-40`, cercle 56px, fond `#25D366` (vert WhatsApp), icône `MessageCircle` blanc 28px.
- Animation à l'apparition : `whatsapp-bounce-in` 400ms.
- Pulse permanent : `whatsapp-pulse` 2.5s infinite.
- Lien : `https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+passer+une+commande+%3A`
- N'apparaît PAS sur les routes `/admin`, `/cuisine`, `/menu/scan`.

### `src/components/ScrollReveal.tsx`
Wrapper utilisant `IntersectionObserver` (threshold 0.15, rootMargin '0px 0px -80px 0px') qui ajoute la classe `section-enter` quand visible. Props : `{ children, delay?: number }` (delay applique `style={{ animationDelay: \`${delay}ms\` }}`).

---

## 🌐 PAGES PUBLIQUES

### `src/pages/Index.tsx` (Accueil)
- **Hero** plein écran (`min-h-screen`) avec `hero-home.jpg` en background, overlay gradient `linear-gradient(to bottom, rgba(26,18,8,0.4), rgba(26,18,8,0.95))`. Centré : titre Cormorant italic 6xl–8xl « La HuQQa », tagline DM Sans uppercase tracking-wide « Une expérience au goût unique », ligne ambre 120px, deux boutons : « Découvrir le menu » (fond ambre) et « Réserver » (lien WhatsApp, bordure ivoire).
- **Section éditoriale 1** : titre + paragraphe long sur l'identité du lieu, image `interieur.jpg` à droite, asymétrie 60/40.
- **Section éditoriale 2** : zigzag inverse, image `terrasse.jpg` à gauche, texte sur la terrasse végétale.
- **Galerie asymétrique** : 5 images (`bar-counter`, `amis-diner`, `cocktail`, `dessert`, `plat-principal`) en grid masonry 3 colonnes desktop / 1 colonne mobile.
- **CTA final** ambre : « Venez vivre l'expérience » + lien Contact.
- Toutes les sections enveloppées dans `<ScrollReveal>`.

### `src/pages/MenuPage.tsx`
Voir section dédiée plus bas (composant partagé scan/public).

### `src/pages/AmbiancePage.tsx`
- Header : titre « L'ambiance » Cormorant 5xl–[72px] italic, sous-titre `Lumières · Sons · Sensations`.
- Grille masonry 6 images (intérieur, terrasse, bar, amis, cocktail, dessert) avec hauteurs variables (aspect-[3/4], 4/5, 1/1).
- Section parallaxe : image bar-counter en background-attachment fixed (desktop), texte éditorial superposé en blanc opacity 0.95.
- Citation centrée Cormorant italic 3xl : « *Quand on pousse la porte de La HuQQa, quelque chose change.* »

### `src/pages/ContactPage.tsx`
- Header « Nous trouver » Cormorant 5xl italic.
- Grille 2 colonnes :
  - Gauche : adresse avec **effet typewriter** (caractère par caractère, 50ms/lettre) sur « Tokoin Wuiti, Lomé, Togo », téléphone, email, horaires « Mar–Dim · 12h00 – 23h00 », réseaux sociaux.
  - Droite : iframe Google Maps avec `filter: invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.85)` pour intégrer le thème sombre.
- CTA WhatsApp en bas.

### `src/pages/NotFound.tsx`
Page 404 Cormorant 7xl « 404 », sous-titre « Cette page n'existe pas », bouton retour accueil.

---

## 🍽 MENU PARTAGÉ — `src/pages/MenuPage.tsx`

**Le même composant sert pour `/menu` (public) ET `/menu/scan` (en salle).** Il accepte une prop `scanMode: boolean`.

### Données (hardcodées, 5 catégories)
```ts
const categories = [
  { id: "entrees", label: "Entrées", items: [
    { name: "Bruschetta Maison", description: "Pain grillé, tomates fraîches, basilic, huile d'olive vierge", price: "3 500 F", image: entreeImg },
    { name: "Salade Tropicale", description: "Mangue, avocat, crevettes grillées, vinaigrette passion", price: "4 500 F", image: entreeImg },
    { name: "Nems au Poulet", description: "Nems croustillants, sauce aigre-douce maison", price: "3 000 F", image: entreeImg },
  ]},
  { id: "plats", label: "Plats Principaux", items: [
    { name: "Filet de Bœuf Grillé", description: "Bœuf premium, légumes de saison, sauce au poivre", price: "12 000 F", image: platImg },
    { name: "Poulet Braisé", description: "Poulet fermier mariné, accompagné d'alloco et piment frais", price: "6 500 F", image: platImg },
    { name: "Riz Jollof Royal", description: "Riz parfumé aux épices ouest-africaines, poulet grillé", price: "5 500 F", image: platImg },
    { name: "Côtelettes d'Agneau", description: "Agneau tendre, purée de patate douce, jus réduit", price: "14 000 F", image: platImg },
  ]},
  { id: "fruits-de-mer", label: "Fruits de Mer", items: [
    { name: "Pasta Fruits de Mer", description: "Linguine, crevettes, moules, sauce crémeuse à l'ail", price: "9 500 F", image: fruitsImg },
    { name: "Crevettes Grillées", description: "Crevettes géantes au beurre d'ail et citron vert", price: "11 000 F", image: fruitsImg },
    { name: "Poisson du Jour", description: "Poisson frais grillé, riz basmati, sauce vierge", price: "8 500 F", image: fruitsImg },
  ]},
  { id: "desserts", label: "Desserts", items: [
    { name: "Fondant au Chocolat", description: "Cœur coulant, glace vanille artisanale", price: "4 000 F", image: dessertImg },
    { name: "Crème Brûlée", description: "Crème vanille caramélisée au chalumeau", price: "3 500 F", image: dessertImg },
    { name: "Salade de Fruits Exotiques", description: "Mangue, ananas, fruit de la passion, menthe fraîche", price: "3 000 F", image: dessertImg },
  ]},
  { id: "cocktails", label: "Cocktails & Boissons", items: [
    { name: "Mojito HuQQa", description: "Rhum, menthe fraîche, citron vert, soda artisanal", price: "5 000 F", image: cocktailImg },
    { name: "Lomé Sunset", description: "Vodka, jus de mangue, grenadine, glaçons pilés", price: "5 500 F", image: cocktailImg },
    { name: "Bissap Tonic", description: "Infusion d'hibiscus, tonic water, citron, gingembre", price: "3 500 F", image: cocktailImg },
    { name: "Old Fashioned", description: "Bourbon, sucre, Angostura, zeste d'orange", price: "6 000 F", image: cocktailImg },
  ]},
];
```

### Structure de la page
1. **Header** : `pt-[72px]`, section `py-24 text-center`, titre « La carte » Cormorant 5xl–[72px] italic, sous-titre `Plats · Cocktails · Boissons`, ligne ambre 120px (line-stretch).
2. **Pills sticky** : barre `sticky top-[72px]`, apparaît au scroll > 200px (opacity + translateY transition 300ms). Pour chaque catégorie, bouton pilule arrondie : actif = fond ambre + texte sombre ; inactif = bordure border + texte foreground/70 hover ambre. Au clic : scroll smooth vers la section.
3. **Sections catégories** : pour chaque catégorie, label uppercase ambre + ligne fine + grille `grid-cols-1 md:grid-cols-2 gap-6` de cartes plats. Chaque carte = image (aspect-video, hover scale 1.03 en 400ms) + `p-5` avec nom Cormorant 2xl, description 2 lignes max, prix ambre, bouton « Commander » (mode public) OU « Ajouter » (mode scan).
4. **CTA final** (mode public uniquement) : section fond ambre, titre « Envie de commander ? », gros bouton WhatsApp.

### Mode public (`scanMode = false`)
Bouton « Commander » par plat = lien direct WhatsApp pré-rempli avec le nom du plat :
```
https://wa.me/22896949494?text=Bonjour%2C+je+souhaite+commander+%3A+{NOM_PLAT_ENCODED}
```

### Mode scan (`scanMode = true`)
Trois différences uniquement :

**A) Modal numéro de table BLOQUANT au chargement**
- Apparaît si `localStorage["tableNumber"]` est vide.
- Fond plein écran `#1A1208`, z-100, NON-CLIQUABLE en dehors, pas de croix.
- Centré : icône `Hash` lucide 40px ambre, titre Cormorant italic 32px ivoire « Votre numéro de table », sous-titre DM Sans 14px opacity 0.7 « Entrez le numéro inscrit sur votre table ».
- Input : 52px height, fond `#2A1E0F`, bordure 1px ambre, text-align center, DM Sans 24px bold ivoire, `inputMode="numeric"`, placeholder « ex : 5 », filtre uniquement les chiffres.
- Bouton « Confirmer » : fond ambre, texte sombre, 52px height, width 100%.
- Validation : refuse vide ou non numérique → message rouge sous l'input.
- Au succès : `localStorage["tableNumber"] = valeur`, modal disparaît en fade-out 300ms.

**B) Badge Table fixe**
Coin supérieur droit (`top-4 right-4 z-40`), pilule fond ambre opacity 0.9, texte sombre, « Table {N} ».

**C) Panier + envoi Supabase**
- Bouton « Ajouter » remplace « Commander » sur chaque carte (icône `Plus` lucide).
- Bouton flottant panier en bas à droite (visible si cart.length > 0) : ambre, icône `ShoppingBag`, « Panier · {count} » + total FCFA.
- Drawer panier : overlay noir 60%, panneau `bg-card`, max-h 85vh, scroll interne. Pour chaque ligne : nom + prix unitaire + boutons `-` `+` `X`. En bas : textarea note (« allergies, cuisson… »), total ambre, bouton « Commander · Table {N} » fond ambre.
- Au clic Commander :
  1. Construire `items = [{ name, qty, price }]` et `total`.
  2. Appeler `submitOrder(tableNumber, items, total, note)` (Supabase INSERT).
  3. Ouvrir WhatsApp en plus avec le récap.
  4. Toast vert `#22C55E` 3s : « Commande envoyée en cuisine · Table {N} ».
  5. Vider panier + fermer drawer.
  6. Si erreur Supabase : ouvrir WhatsApp quand même + toast destructive « Commande envoyée via WhatsApp uniquement ».

---

## 🗄 BACKEND SUPABASE — UNIQUEMENT POUR `orders`

### Table à créer
```sql
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'preparing' | 'done'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders"   ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

-- Activer Realtime
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
```

### `src/services/ordersService.ts`
Exporter :
- `OrderStatus = "pending" | "preparing" | "done"`
- `OrderItem = { name, qty, price }`
- `Order = { id, table_number, items, total, note, status, created_at }`
- `submitOrder(tableNumber, items, total, note?)` → INSERT, retourne `{ id }`
- `updateOrderStatus(id, status)` → UPDATE
- `getActiveOrders()` → SELECT WHERE status != 'done' ORDER BY created_at ASC
- `getRecentDoneOrders(limit=10)` → SELECT WHERE status='done' DESC LIMIT 10
- `subscribeToOrders({ onInsert, onUpdate })` → channel `orders-realtime`, retourne fonction de cleanup

---

## 🔐 ROUTE 1 — `/admin` (DASHBOARD RESTAURATEUR)

### Accès
- Constante hardcodée : `const ADMIN_PASSWORD = "huqqa2025";` (à changer avant prod)
- Si `localStorage["admin_auth"] !== "true"` → afficher LoginScreen
- Au succès : `localStorage["admin_auth"] = "true"`
- Bouton Déconnexion (icône `LogOut`) → clear + redirect `/`

### LoginScreen
- Fond `#F8F9FA` (clair, distinct du site sombre)
- Centré : « La HuQQa · Admin » DM Sans 20px bold gris
- Input password 48px, bordure gris clair, radius 8px
- Bouton « Accéder » : fond `#1A1208`, texte blanc, 48px
- Erreur : texte rouge sous l'input (pas d'alert)

### Dashboard (4 onglets sticky)
Layout : header blanc 56px (titre + bouton déconnexion), tabs en dessous, fond global `#F8F9FA`, max-width `5xl`, DM Sans partout, icônes lucide strokeWidth 1.5.

**Onglet 1 — MENU** (par défaut)
- Plats groupés par catégorie
- Chaque ligne : nom + prix + toggle Disponible (switch vert/gris) + bouton modifier (`Pencil`) + bouton supprimer (`Trash2` avec confirmation inline `Check`/`X`)
- Bouton « Ajouter un plat » → formulaire slide-in (drawer bas mobile / modal centre desktop) :
  - Nom (required), Description (textarea 2 lignes), Prix FCFA (number required), Catégorie (select), URL image (preview 60×60)
- Sauvegarde dans `localStorage["restaurantData"]`

**Onglet 2 — CATÉGORIES**
- Liste avec compteur de plats associés
- Boutons flèches haut/bas (`ChevronUp`/`ChevronDown`) pour réordonner
- Renommer : clic sur nom → input inline
- Supprimer (`Trash2`) avec confirmation si plats associés
- Input + bouton « Ajouter » en bas

**Onglet 3 — COMMANDES** (temps réel)
- Au montage : `getActiveOrders()` + `getRecentDoneOrders(10)`
- Souscrit à `subscribeToOrders` pour les INSERT et UPDATE
- 3 zones :
  - **EN ATTENTE** (fond rouge pâle `bg-red-50`) → carte avec « Prendre en charge » (bordure ambre, texte ambre, fond blanc) → `updateOrderStatus(id, 'preparing')`
  - **EN PRÉPARATION** (fond ambre pâle `bg-amber-50`) → bouton « Commande prête » fond `#22C55E` texte blanc → `updateOrderStatus(id, 'done')`
  - **TERMINÉES** (fond gris pâle `bg-gray-100`) → 10 dernières, read-only
- Carte commande : « Table {X} » bold + chrono « Il y a 3 min » + liste articles « 2x Poulet » + note italique + total bold
- Bouton « Tout archiver » en bas

**Onglet 4 — PARAMÈTRES**
- Formulaire : nom restaurant, tagline, WhatsApp, adresse, horaires, Instagram, Facebook
- Bouton « Sauvegarder » (icône `Save`) fond `#1A1208`
- Bouton « Exporter JSON » (icône `Copy`) → presse-papier + feedback « Copié ! »
- Bouton « Réinitialiser » (icône `RotateCcw`) bordure rouge avec confirmation

---

## 📱 ROUTE 2 — `/menu/scan` (MENU SUR PLACE)
Voir section MenuPage ci-dessus avec `scanMode={true}`.
Aucune Navbar, aucun Footer, aucun bouton WhatsApp flottant sur cette route.

---

## 👨‍🍳 ROUTE 3 — `/cuisine` (KITCHEN DISPLAY SYSTEM)

Pas de mot de passe. Pas de Navbar. Pas de Footer. Pas de WhatsApp flottant.

### Palette dédiée
- Fond : `#0D1117` (très sombre, repos visuel)
- Cartes : `#1C2333` (active), `#161B27` (terminées, opacity 0.7)
- Texte : `#E5E7EB` ; texte muted : `#9CA3AF` ; séparateur : `#374151`
- Vert (préparation/prêt) : `#22C55E`
- Orange (urgence) : `#F97316`
- Police : **DM Sans uniquement**
- Icônes lucide strokeWidth 2

### Header sticky 56px (`#161B27`)
- Gauche : « La HuQQa · Cuisine » 16px bold
- Centre (md+) : date + heure live `HH:MM:SS` (mise à jour 1s)
- Droite : badge `● CONNECTÉ` vert (ou `● HORS LIGNE` rouge si erreur Supabase)

Sous-titre discret centré : « Écran réservé à l'équipe cuisine ».

### Layout 3 colonnes (1 sur mobile)
- **Colonne 1 — Nouvelles commandes** (badge orange) : status `pending`, bordure gauche 4px orange, ordre d'arrivée
- **Colonne 2 — En préparation** (badge vert) : status `preparing`, bordure gauche 4px vert
- **Colonne 3 — Terminées** (badge gris) : 10 dernières `done`, bordure gauche 4px `#374151`, opacity 0.7

### Carte commande
- Header : icône `Hash` 16px + « Table {X} » 20px bold à gauche ; à droite heure `HH:MM` + chrono « · 4 min »
- Si en attente > 5 min → chrono passe en orange bold + animation pulse douce (`@keyframes kds-pulse` 1.2s)
- Liste articles : quantité bold colorée (vert/orange selon colonne) + nom 16px
- Note italique 14px gris si présente
- Séparateur 1px `#374151`
- Total right-aligned 16px bold
- Bouton action :
  - Pending → « Prendre en charge » bordure verte transparente, hover fond vert
  - Preparing → « Commande prête » fond vert + icône `CheckCircle`
  - Done → aucun bouton

### Temps réel
- `getActiveOrders()` au montage
- `subscribeToOrders` :
  - `onInsert` → ajoute à pending + **bip sonore** Web Audio (oscillator 880Hz, 200ms) + toast orange 5s « Nouvelle commande · Table {X} »
  - `onUpdate` → si `done` → bouge vers colonne 3 ; sinon met à jour
- Si fetch échoue → badge passe `HORS LIGNE` rouge

### État vide
Centré : icône `ChefHat` 64px gris foncé, texte 18px « Aucune commande en cours », sous-texte « Les nouvelles commandes apparaîtront ici automatiquement ».

---

## 🔀 ROUTING — `src/App.tsx`

```tsx
import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import AmbiancePage from "./pages/AmbiancePage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import CuisinePage from "./pages/CuisinePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const HIDE_CHROME = ["/admin", "/cuisine", "/menu/scan"];

const PublicChrome = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hide = HIDE_CHROME.some((p) => location.pathname.startsWith(p));
  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
      {!hide && <WhatsAppButton />}
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const handle = useCallback(() => setLoading(false), []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {loading && <LoadingScreen onComplete={handle} />}
        <BrowserRouter>
          <PublicChrome>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage scanMode={false} />} />
              <Route path="/menu/scan" element={<MenuPage scanMode={true} />} />
              <Route path="/ambiance" element={<AmbiancePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/cuisine" element={<CuisinePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PublicChrome>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
```

---

## 🖼 IMAGES À GÉNÉRER (10 fichiers `.jpg` dans `src/assets/`)

Style commun : photographie restaurant nocturne, lumière chaude ambrée, ambiance cinématique sombre, grain léger, contraste élevé.

| Fichier | Prompt suggéré |
|---|---|
| `hero-home.jpg` | Intérieur de restaurant nocturne, lumières ambrées tamisées, table dressée premier plan, bokeh chaud, atmosphère intime cinématique |
| `interieur.jpg` | Salle de restaurant cosy, banquettes velours sombre, suspensions cuivrées, ambiance feutrée |
| `terrasse.jpg` | Terrasse végétale en soirée, guirlandes lumineuses or, plantes tropicales, ambiance lounge africain chic |
| `bar-counter.jpg` | Bar de restaurant avec bouteilles éclairées par derrière, comptoir bois sombre, verres cristal |
| `amis-diner.jpg` | Groupe d'amis riant à table, vue épaule, lumière chaude, plats partagés au centre |
| `entree.jpg` | Bruschetta gastronomique servie sur ardoise, lumière rasante chaude |
| `plat-principal.jpg` | Filet de bœuf grillé avec légumes, plating fine dining, sauce nappée |
| `fruits-de-mer.jpg` | Pasta aux fruits de mer, crevettes et moules, top-down chaud |
| `dessert.jpg` | Fondant au chocolat coulant avec glace vanille, lumière douce |
| `cocktail.jpg` | Cocktail ambré dans verre vintage, glaçon sphérique, fond sombre, lumière dramatique |

---

## ⚙ INSTRUCTIONS D'EXÉCUTION POUR L'ÉDITEUR IA

1. Initialiser un projet Vite React TS avec Tailwind v3 + tailwindcss-animate.
2. Installer shadcn/ui avec les composants : `button card dialog input tabs toast tooltip sonner`.
3. Installer : `react-router-dom @tanstack/react-query lucide-react @supabase/supabase-js`.
4. Configurer Tailwind avec les tokens HSL ci-dessus.
5. Importer les polices Google dans `index.html`.
6. Créer tous les composants et pages décrits ci-dessus.
7. Connecter Supabase (créer un projet, récupérer URL + anon key, créer client dans `src/integrations/supabase/client.ts`).
8. Exécuter le SQL de création de la table `orders` + activer Realtime.
9. Générer les 10 images via Midjourney/DALL-E avec les prompts ci-dessus.
10. Vérifier que :
   - Le site public (`/`, `/menu`, `/ambiance`, `/contact`) affiche bien Navbar, Footer, bouton WhatsApp flottant.
   - `/admin`, `/menu/scan`, `/cuisine` n'affichent **AUCUN** de ces éléments.
   - Une commande passée depuis `/menu/scan` apparaît instantanément sur `/cuisine` (test deux onglets).
   - Le mot de passe admin `huqqa2025` fonctionne et est rappelé en commentaire à changer.

---

## ✅ RÈGLES DE NON-RÉGRESSION

- **Aucun emoji** dans l'interface — uniquement icônes lucide.
- Toutes les couleurs en HSL via tokens Tailwind (jamais de couleur en dur dans les composants publics).
- `/admin` et `/cuisine` ont leur propre design (sobre/technique) — ils n'importent PAS les styles éditoriaux du site.
- Le numéro WhatsApp `wa.me/22896949494` doit être identique partout.
- Toutes les nouvelles routes s'ajoutent au router sans supprimer les routes existantes.
- Le LoadingScreen ne s'affiche qu'au tout premier chargement.

---

**FIN DU PROMPT — Coller intégralement dans Cursor / Antigravity et laisser l'IA générer.**
