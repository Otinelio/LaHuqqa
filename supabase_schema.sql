-- Paramètres du restaurant
CREATE TABLE restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'La HuQQa',
  tagline text DEFAULT 'Une expérience au goût unique.',
  whatsapp text DEFAULT '22896949494',
  address text DEFAULT 'Bd. de la Kara, Tokoin Wuiti, Lomé, Togo',
  hours text DEFAULT 'Lundi–Dimanche · 11h30 – 00h00',
  email text DEFAULT 'lahuqqatogo@gmail.com',
  instagram text DEFAULT 'instagram.com/la.huqqa',
  facebook text DEFAULT 'facebook.com/LahuQQa',
  updated_at timestamptz DEFAULT now()
);
INSERT INTO restaurant_settings (id) VALUES (gen_random_uuid());

-- Catégories du menu
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
INSERT INTO categories (name, position) VALUES
  ('Entrées', 0),
  ('Plats principaux', 1),
  ('Fruits de mer', 2),
  ('Desserts', 3),
  ('Cocktails & Boissons', 4);

-- Plats du menu
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  available boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Commandes temps réel
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number text NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Activer Realtime sur orders
ALTER publication supabase_realtime ADD TABLE orders;

-- Désactiver RLS pour le MVP (à sécuriser avant prod)
ALTER TABLE restaurant_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- STORAGE: Bucket pour les images
-- ----------------------------------------------------
-- Note: Supabase storage buckets generally need to be created via Dashboard
-- or using the storage API. The SQL below is for documentation/setup reference.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Autoriser tout le monde à lire les images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Autoriser l'upload sans RLS pour le MVP (Attention en prod)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');
