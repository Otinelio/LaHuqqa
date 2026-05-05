import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'src/assets');
const files = fs.readdirSync(assetsDir);

async function run() {
  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    
    // Skip small files (under 300KB)
    if (stats.size < 300 * 1024) continue;

    console.log(`Compressing ${file} (${(stats.size / 1024).toFixed(0)} KB)...`);
    
    const buffer = fs.readFileSync(filePath);
    
    try {
      if (file.toLowerCase().endsWith('.png')) {
        const compressed = await sharp(buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
        fs.writeFileSync(filePath, compressed);
      } else {
        const compressed = await sharp(buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
        fs.writeFileSync(filePath, compressed);
      }
      const newStats = fs.statSync(filePath);
      console.log(`  Done: ${(newStats.size / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.error(`  Error:`, e);
    }
  }
}

run();
