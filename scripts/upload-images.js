/**
 * upload-images.js
 * ────────────────────────────────────────────────────────────────────────────
 * 1. Crea (si no existe) el bucket "product-images" en Supabase Storage
 *    con acceso público.
 * 2. Sube todas las imágenes de /scripts/productos-imagenes/.
 * 3. Actualiza el campo `images[]` de cada producto según la categoría
 *    a la que pertenece, usando el mapeo declarado en CATEGORY_IMAGE_MAP.
 *    También aplica sobreescrituras a nivel de producto (PRODUCT_OVERRIDE_MAP).
 *
 * Requiere en .env.local:
 *   VITE_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *
 * Uso:
 *   node scripts/upload-images.js
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// ─── Configuración de rutas ───────────────────────────────────────────────────
const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = join(__dirname, "..");
const IMAGES_DIR  = join(__dirname, "productos-imagenes");
const BUCKET      = "product-images";

// ─── Mapeo categoría → imágenes (en orden de posición) ───────────────────────
// La primera imagen será images[0], la segunda images[1], etc.
// Los nombres de archivo incluyen extensión tal como están en la carpeta.
const CATEGORY_IMAGE_MAP = {
  "mieles-derivados":  ["miel.jpeg", "mieles.jpeg"],
  "cafe-cacao":        ["cafe-cacao.jpeg"],
  "frutas-verduras":   ["frutas.jpeg"],
  "hongos":            ["hongos.jpeg"],
  "huevos-aves":       ["huevos.jpeg"],
  "lacteos-quesos":    ["yogures.jpeg"],
  "panela-derivados":  ["panela.jpeg"],
  "otros-naturales":   ["mermeladas-ghee.jpeg"],
};

// ─── Sobreescrituras por slug de producto ─────────────────────────────────────
// Estos productos reciben imágenes específicas en lugar de las de su categoría.
// Clave: slug exacto del producto en la DB.
const PRODUCT_OVERRIDE_MAP = {
  "propoleo-liquido":  ["miel.jpeg", "mieles.jpeg"],  // también mieles-derivados
  "huevos-de-campo-aa": ["huevos.jpeg"],
  "pollo-entero-criollo": ["proteinas.jpeg"],
  // Agrega más sobreescrituras aquí si necesitas asignar cafe.jpeg
  // a un producto específico de café, por ejemplo:
  // "cafe-tostado-molido": ["cafe.jpeg", "cafe-cacao.jpeg"],
};

// ─── Cargar variables de entorno ─────────────────────────────────────────────
function loadEnv(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }
  const content = readFileSync(filePath, "utf-8");
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return [key.trim(), rest.join("=").trim()];
      })
  );
}

const env             = loadEnv(join(ROOT, ".env.local"));
const SUPABASE_URL    = env.VITE_SUPABASE_URL;
const SERVICE_KEY     = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "\n❌  Variables faltantes en .env.local:\n" +
    "    VITE_SUPABASE_URL\n" +
    "    SUPABASE_SERVICE_ROLE_KEY\n"
  );
  process.exit(1);
}

// ─── Cliente Supabase con service role ───────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mimeType(ext) {
  const map = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
  };
  return map[ext.toLowerCase()] ?? "image/jpeg";
}

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Error listando buckets: ${error.message}`);

  if (buckets.some((b) => b.name === BUCKET)) {
    console.log(`✅  Bucket "${BUCKET}" ya existe.\n`);
    return;
  }

  console.log(`🪣  Creando bucket público "${BUCKET}"...`);
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });
  if (createErr) throw new Error(`Error creando bucket: ${createErr.message}`);
  console.log(`✅  Bucket "${BUCKET}" creado con acceso público.\n`);
}

/** Sube un archivo local y devuelve su URL pública permanente */
async function uploadFile(localPath, storagePath) {
  const buffer = readFileSync(localPath);
  const ext    = extname(localPath).toLowerCase();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: mimeType(ext), upsert: true });

  if (error) throw new Error(`Error subiendo ${storagePath}: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // ── 1. Verificar carpeta ─────────────────────────────────────────────────
  if (!existsSync(IMAGES_DIR)) {
    console.error(
      `\n❌  No se encontró la carpeta: ${IMAGES_DIR}\n` +
      "    Asegúrate de que las imágenes estén en scripts/productos-imagenes/\n"
    );
    process.exit(1);
  }

  const SUPPORTED = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  const allFiles  = readdirSync(IMAGES_DIR).filter((f) =>
    SUPPORTED.includes(extname(f).toLowerCase())
  );

  if (allFiles.length === 0) {
    console.warn("⚠️   No hay imágenes en scripts/productos-imagenes/");
    process.exit(0);
  }

  console.log(`\n📂  ${allFiles.length} imagen(es) encontrada(s) en scripts/productos-imagenes/\n`);

  // ── 2. Crear bucket si no existe ─────────────────────────────────────────
  await ensureBucket();

  // ── 3. Subir todas las imágenes y guardar sus URLs ───────────────────────
  console.log("📤  Subiendo imágenes a Storage...\n");
  /** @type {Record<string, string>} filename → publicUrl */
  const urlCache = {};

  for (const file of allFiles) {
    const localPath   = join(IMAGES_DIR, file);
    const storagePath = file; // se guarda con el mismo nombre en la raíz del bucket
    process.stdout.write(`   ↑ ${file} ... `);
    try {
      urlCache[file] = await uploadFile(localPath, storagePath);
      console.log("✅");
    } catch (err) {
      console.log("❌");
      console.error(`     ${err.message}`);
    }
  }

  // ── 4. Leer productos de la DB junto con sus categorías ──────────────────
  console.log("\n🔍  Leyendo productos de la base de datos...");
  const { data: products, error: fetchErr } = await supabase
    .from("products")
    .select("id, slug, category_id, images");

  if (fetchErr) throw new Error(`Error leyendo productos: ${fetchErr.message}`);

  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug");

  if (catErr) throw new Error(`Error leyendo categorías: ${catErr.message}`);

  /** @type {Record<string, string>} categoryId → categorySlug */
  const catSlugById = Object.fromEntries(categories.map((c) => [c.id, c.slug]));

  console.log(`   ${products.length} producto(s) encontrado(s).\n`);

  // ── 5. Actualizar images[] de cada producto ───────────────────────────────
  console.log("💾  Actualizando imágenes en la DB...\n");
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const catSlug    = catSlugById[product.category_id];
    const isOverride = product.slug in PRODUCT_OVERRIDE_MAP;

    // Determinar qué archivos de imagen asignar
    const imageFiles = isOverride
      ? PRODUCT_OVERRIDE_MAP[product.slug]
      : CATEGORY_IMAGE_MAP[catSlug];

    if (!imageFiles || imageFiles.length === 0) {
      console.log(`   ⚠️  Sin mapeo para "${product.slug}" (cat: ${catSlug ?? "??"}) — omitido.`);
      skipped++;
      continue;
    }

    // Resolver URLs (solo las que se subieron con éxito)
    const resolvedUrls = imageFiles
      .map((f) => urlCache[f])
      .filter(Boolean);

    if (resolvedUrls.length === 0) {
      console.log(`   ⚠️  Imágenes no subidas para "${product.slug}" — omitido.`);
      skipped++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from("products")
      .update({ images: resolvedUrls, updated_at: new Date().toISOString() })
      .eq("id", product.id);

    if (updateErr) {
      console.error(`   ❌  Error actualizando "${product.slug}": ${updateErr.message}`);
      skipped++;
    } else {
      const tag = isOverride ? " [override]" : "";
      console.log(
        `   ✅  ${product.slug}${tag}\n` +
        `       cat: ${catSlug ?? "??"} → ${resolvedUrls.length} imagen(es)`
      );
      updated++;
    }
  }

  // ── 6. Resumen ────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(55));
  console.log(
    `Completado: ${updated} producto(s) actualizados, ${skipped} omitido(s).`
  );
  console.log(
    `Bucket público: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`
  );
}

main().catch((err) => {
  console.error("\n❌ Error fatal:", err.message ?? err);
  process.exit(1);
});
