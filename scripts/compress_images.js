import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching menu items...");
  const { data: items, error } = await supabase.from('menu_items').select('*');
  if (error) {
    console.error("Error fetching items:", error);
    return;
  }

  const itemsWithImages = items.filter(i => i.image_url);
  console.log(`Found ${itemsWithImages.length} items with images.`);

  for (const item of itemsWithImages) {
    const isWebp = item.image_url.toLowerCase().endsWith('.webp');
    if (isWebp) {
      console.log(`Skipping ${item.name} - already webp.`);
      continue;
    }

    console.log(`\nProcessing ${item.name}...`);
    try {
      // 1. Download image
      const res = await fetch(item.image_url);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Compress using sharp
      console.log(`  Original size: ${(buffer.length / 1024).toFixed(2)} KB`);
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      
      console.log(`  Compressed size: ${(compressedBuffer.length / 1024).toFixed(2)} KB`);

      // 3. Upload to Supabase
      const fileName = `opt_${item.id}_${Date.now()}.webp`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
      const newUrl = publicUrlData.publicUrl;

      // 4. Update menu item
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: newUrl })
        .eq('id', item.id);
      
      if (updateError) throw updateError;
      console.log(`  Updated ${item.name} successfully!`);

    } catch (e) {
      console.error(`  Error processing ${item.name}:`, e);
    }
  }

  console.log("\nDone!");
}

run();
