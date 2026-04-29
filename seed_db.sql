-- ==========================================
-- SCRIPT DE REMPLISSAGE (SEED) POUR LA HUQQA
-- ==========================================
-- Ce script ajoute des catégories de base et des plats avec des images (Unsplash).
-- Vous pouvez l'exécuter directement dans l'éditeur SQL de Supabase.

-- 1. INSÉRER LES CATÉGORIES (Utilisation de UUIDs fixes pour pouvoir lier les plats facilement)
INSERT INTO categories (id, name, position) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Entrées', 1),
  ('22222222-2222-2222-2222-222222222222', 'Plats Principaux', 2),
  ('33333333-3333-3333-3333-333333333333', 'Desserts', 3),
  ('44444444-4444-4444-4444-444444444444', 'Cocktails & Boissons', 4),
  ('55555555-5555-5555-5555-555555555555', 'Chichas (Narguilé)', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. INSÉRER LES PLATS
INSERT INTO menu_items (name, description, price, category_id, image_url, available) VALUES
  -- Entrées (Liées à '11111111-1111-1111-1111-111111111111')
  (
    'Nems au Poulet (x4)', 
    'Nems croustillants faits maison, servis avec une sauce aigre-douce et des feuilles de menthe fraîche.', 
    3500, 
    '11111111-1111-1111-1111-111111111111', 
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Salade César Royal', 
    'Laitue croquante, suprême de volaille rôti, copeaux de parmesan, croûtons dorés et sauce César onctueuse.', 
    5500, 
    '11111111-1111-1111-1111-111111111111', 
    'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Carpaccio de Bœuf', 
    'Fines tranches de bœuf cru, filet d''huile d''olive vierge, roquette et parmesan.', 
    7000, 
    '11111111-1111-1111-1111-111111111111', 
    'https://images.unsplash.com/photo-1534080554528-9366df65e903?auto=format&fit=crop&q=80&w=800', 
    true
  ),

  -- Plats Principaux (Liés à '22222222-2222-2222-2222-222222222222')
  (
    'Entrecôte Grillée (300g)', 
    'Viande tendre et juteuse, cuite selon votre goût, servie avec frites maison et sauce au poivre.', 
    14000, 
    '22222222-2222-2222-2222-222222222222', 
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Filet de Bar Rôti', 
    'Poisson frais du jour, écrasé de pommes de terre à l''huile de truffe et légumes de saison.', 
    12500, 
    '22222222-2222-2222-2222-222222222222', 
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Burger Signature La HuQQa', 
    'Pain brioché, steak haché pur bœuf, cheddar fondu, oignons caramélisés et sauce secrète.', 
    8500, 
    '22222222-2222-2222-2222-222222222222', 
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Pâtes aux Fruits de Mer', 
    'Linguines aux crevettes, calamars et moules fraîches, sauce tomate onctueuse et basilic.', 
    9500, 
    '22222222-2222-2222-2222-222222222222', 
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800', 
    true
  ),

  -- Desserts (Liés à '33333333-3333-3333-3333-333333333333')
  (
    'Mi-Cuit au Chocolat', 
    'Fondant au chocolat noir intense avec son cœur coulant, accompagné d''une boule de glace vanille.', 
    4500, 
    '33333333-3333-3333-3333-333333333333', 
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Cheesecake Coulis Fruits Rouges', 
    'Un cheesecake crémeux style New Yorkais, surmonté d''un coulis de framboises fait maison.', 
    5000, 
    '33333333-3333-3333-3333-333333333333', 
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Assiette de Fruits Frais', 
    'Sélection du jour de fruits frais tropicaux et de saison finement tranchés.', 
    3000, 
    '33333333-3333-3333-3333-333333333333', 
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800', 
    true
  ),

  -- Cocktails & Boissons (Liés à '44444444-4444-4444-4444-444444444444')
  (
    'Mojito Classique', 
    'Rhum blanc, menthe fraîche pilée, citron vert, sucre de canne et eau gazeuse.', 
    4000, 
    '44444444-4444-4444-4444-444444444444', 
    'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Cocktail Signature HuQQa', 
    'Un mélange exotique et secret du barman, à base de vodka, purée de passion et sirop d''hibiscus.', 
    6000, 
    '44444444-4444-4444-4444-444444444444', 
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Virgin Pina Colada', 
    'Le grand classique revisité sans alcool : jus d''ananas frais et crème de coco.', 
    3500, 
    '44444444-4444-4444-4444-444444444444', 
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Coupe de Champagne', 
    'Coupe de notre champagne de la maison, servi frais.', 
    9000, 
    '44444444-4444-4444-4444-444444444444', 
    'https://images.unsplash.com/photo-1599939571322-792a326e9085?auto=format&fit=crop&q=80&w=800', 
    true
  ),

  -- Chichas (Liées à '55555555-5555-5555-5555-555555555555')
  (
    'Chicha Menthe & Raisin', 
    'Un classique rafraîchissant préparé avec du tabac Al Fakher de première qualité.', 
    10000, 
    '55555555-5555-5555-5555-555555555555', 
    'https://images.unsplash.com/photo-1516104882255-b0b30c920199?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Chicha Kaloud Premium (Fruits)', 
    'Tête de chauffe Kaloud sur une base glacée avec mélange exotique (pêche, mangue, maracuja).', 
    15000, 
    '55555555-5555-5555-5555-555555555555', 
    'https://images.unsplash.com/photo-1582260655866-b3376e108d85?auto=format&fit=crop&q=80&w=800', 
    true
  ),
  (
    'Chicha Tête de Pomme Fraîche', 
    'Pour une fumée douce et fruitée, notre foyer est sculpté dans une pomme véritable.', 
    18000, 
    '55555555-5555-5555-5555-555555555555', 
    'https://images.unsplash.com/photo-1618228511776-69dce7b0b6cf?auto=format&fit=crop&q=80&w=800', 
    true
  );
