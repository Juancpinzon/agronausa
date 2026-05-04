import { supabase } from "./supabase";
import { CATEGORIES } from "./constants";

const descriptions: Record<string, string> = {
  "lacteos-quesos":     "Quesos frescos, maduros, leche y derivados lácteos artesanales.",
  "mieles-derivados":   "Miel pura de abejas, propóleo, jalea real y cera.",
  "frutas-verduras":    "Frutas y verduras frescas de temporada, directas del campo.",
  "hongos":             "Hongos comestibles frescos y secos: shiitake, ostra, portobello.",
  "huevos-aves":        "Huevos de campo, gallinas ponedoras y aves de corral.",
  "panela-derivados":   "Panela en bloque, pulverizada, miel de caña y guarapo.",
  "cafe-cacao":         "Café tostado artesanal, cacao en pasta, nibs y chocolate.",
  "otros-naturales":    "Productos naturales complementarios: granos, harinas, conservas.",
};

const categorySeeds = CATEGORIES.map((cat, i) => ({
  name: cat.name,
  slug: cat.slug,
  description: descriptions[cat.slug],
  image_url: `https://via.placeholder.com/800x500.png?text=${encodeURIComponent(cat.name)}`,
  sort_order: i + 1,
  active: true,
}));

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  category_slug: string;
  price_retail: number;
  price_wholesale?: number;
  unit: string;
  min_wholesale_qty?: number;
  stock: number;
  images: string[];
  active: boolean;
  featured: boolean;
};

const products: SeedProduct[] = [
  // Lácteos y quesos
  {
    name: "Queso campesino fresco",
    slug: "queso-campesino-fresco",
    description: "Queso blanco fresco elaborado artesanalmente con leche entera.",
    category_slug: "lacteos-quesos",
    price_retail: 18000,
    price_wholesale: 15000,
    unit: "500g",
    min_wholesale_qty: 10,
    stock: 40,
    images: ["https://via.placeholder.com/800x500.png?text=Queso+Campesino"],
    active: true,
    featured: true,
  },
  {
    name: "Leche entera fresca",
    slug: "leche-entera-fresca",
    description: "Leche de vaca pasteurizada, sin aditivos.",
    category_slug: "lacteos-quesos",
    price_retail: 3200,
    unit: "litro",
    stock: 60,
    images: ["https://via.placeholder.com/800x500.png?text=Leche+Fresca"],
    active: true,
    featured: false,
  },
  // Mieles y derivados
  {
    name: "Miel pura de abejas",
    slug: "miel-pura-de-abejas",
    description: "Miel 100% natural, sin pasteurizar, recolectada en colmenas propias.",
    category_slug: "mieles-derivados",
    price_retail: 32000,
    price_wholesale: 27000,
    unit: "500ml",
    min_wholesale_qty: 6,
    stock: 50,
    images: ["https://via.placeholder.com/800x500.png?text=Miel+Pura"],
    active: true,
    featured: true,
  },
  {
    name: "Propóleo líquido",
    slug: "propoleo-liquido",
    description: "Propóleo en extracto alcohólico al 30%, propiedades antibacterianas.",
    category_slug: "mieles-derivados",
    price_retail: 28000,
    unit: "30ml",
    stock: 25,
    images: ["https://via.placeholder.com/800x500.png?text=Prop%C3%B3leo"],
    active: true,
    featured: false,
  },
  // Frutas y verduras
  {
    name: "Aguacate Hass",
    slug: "aguacate-hass",
    description: "Aguacate Hass maduro, recolectado en finca propia.",
    category_slug: "frutas-verduras",
    price_retail: 4500,
    price_wholesale: 3800,
    unit: "unidad",
    min_wholesale_qty: 20,
    stock: 80,
    images: ["https://via.placeholder.com/800x500.png?text=Aguacate+Hass"],
    active: true,
    featured: true,
  },
  {
    name: "Tomate chonto",
    slug: "tomate-chonto",
    description: "Tomate chonto fresco de invernadero, primera calidad.",
    category_slug: "frutas-verduras",
    price_retail: 5800,
    unit: "kg",
    stock: 70,
    images: ["https://via.placeholder.com/800x500.png?text=Tomate+Chonto"],
    active: true,
    featured: false,
  },
  // Hongos
  {
    name: "Hongos ostra frescos",
    slug: "hongos-ostra-frescos",
    description: "Hongos ostra (Pleurotus ostreatus) cultivados localmente.",
    category_slug: "hongos",
    price_retail: 15000,
    unit: "250g",
    stock: 30,
    images: ["https://via.placeholder.com/800x500.png?text=Hongos+Ostra"],
    active: true,
    featured: true,
  },
  {
    name: "Shiitake seco",
    slug: "shiitake-seco",
    description: "Shiitake deshidratado, ideal para sopas y salsas.",
    category_slug: "hongos",
    price_retail: 22000,
    unit: "100g",
    stock: 20,
    images: ["https://via.placeholder.com/800x500.png?text=Shiitake+Seco"],
    active: true,
    featured: false,
  },
  // Huevos y aves
  {
    name: "Huevos de campo AA",
    slug: "huevos-de-campo-aa",
    description: "Huevos de gallinas criadas en campo libre, tamaño AA.",
    category_slug: "huevos-aves",
    price_retail: 16000,
    price_wholesale: 13500,
    unit: "cubeta 30 und",
    min_wholesale_qty: 5,
    stock: 55,
    images: ["https://via.placeholder.com/800x500.png?text=Huevos+Campo"],
    active: true,
    featured: true,
  },
  {
    name: "Pollo entero criollo",
    slug: "pollo-entero-criollo",
    description: "Pollo criollo criado en pastoreo, sin hormonas.",
    category_slug: "huevos-aves",
    price_retail: 42000,
    unit: "unidad ~2kg",
    stock: 15,
    images: ["https://via.placeholder.com/800x500.png?text=Pollo+Criollo"],
    active: true,
    featured: false,
  },
  // Panela y derivados
  {
    name: "Panela redonda",
    slug: "panela-redonda",
    description: "Panela tradicional en bloque, elaborada en trapiche artesanal.",
    category_slug: "panela-derivados",
    price_retail: 5500,
    price_wholesale: 4500,
    unit: "500g",
    min_wholesale_qty: 24,
    stock: 90,
    images: ["https://via.placeholder.com/800x500.png?text=Panela+Redonda"],
    active: true,
    featured: true,
  },
  {
    name: "Panela pulverizada",
    slug: "panela-pulverizada",
    description: "Azúcar de panela en polvo, sin refinado ni blanqueo.",
    category_slug: "panela-derivados",
    price_retail: 8500,
    unit: "500g",
    stock: 45,
    images: ["https://via.placeholder.com/800x500.png?text=Panela+Pulverizada"],
    active: true,
    featured: false,
  },
  // Café y cacao
  {
    name: "Café tostado molido",
    slug: "cafe-tostado-molido",
    description: "Café de origen colombiano, tostión media, molido al momento.",
    category_slug: "cafe-cacao",
    price_retail: 26000,
    price_wholesale: 22000,
    unit: "250g",
    min_wholesale_qty: 12,
    stock: 35,
    images: ["https://via.placeholder.com/800x500.png?text=Caf%C3%A9+Molido"],
    active: true,
    featured: true,
  },
  {
    name: "Cacao en polvo natural",
    slug: "cacao-en-polvo-natural",
    description: "Cacao 100% puro sin azúcar, procesado artesanalmente.",
    category_slug: "cafe-cacao",
    price_retail: 18000,
    unit: "200g",
    stock: 40,
    images: ["https://via.placeholder.com/800x500.png?text=Cacao+Polvo"],
    active: true,
    featured: false,
  },
  // Otros productos naturales
  {
    name: "Harina de maíz amarillo",
    slug: "harina-de-maiz-amarillo",
    description: "Harina de maíz amarillo sin mezcla, ideal para arepas y tamales.",
    category_slug: "otros-naturales",
    price_retail: 9500,
    unit: "kg",
    stock: 60,
    images: ["https://via.placeholder.com/800x500.png?text=Harina+Ma%C3%ADz"],
    active: true,
    featured: false,
  },
  {
    name: "Fríjol cargamanto rojo",
    slug: "frijol-cargamanto-rojo",
    description: "Fríjol cargamanto rojo seco, de cosecha reciente.",
    category_slug: "otros-naturales",
    price_retail: 12000,
    unit: "kg",
    stock: 50,
    images: ["https://via.placeholder.com/800x500.png?text=Fr%C3%ADjol+Cargamanto"],
    active: true,
    featured: false,
  },
];

export async function runSeedIfEmpty() {
  const { count, error: countError } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error(
      "Seed: no se pudo verificar el conteo de categorías",
      countError.message,
    );
    return;
  }

  if (count === 0) {
    await seedDatabase();
  }
}

async function seedDatabase() {
  const { error: categoryError } = await supabase
    .from("categories")
    .insert(categorySeeds);
  if (categoryError) {
    console.error("Seed: error creando categorías", categoryError.message);
    return;
  }

  const { data: categoryRows, error: categorySelectError } = await supabase
    .from("categories")
    .select("id, slug")
    .in(
      "slug",
      categorySeeds.map((c) => c.slug),
    );

  if (categorySelectError || !categoryRows) {
    console.error(
      "Seed: no se pudo obtener las categorías creadas",
      categorySelectError?.message,
    );
    return;
  }

  const categoryMap = Object.fromEntries(
    categoryRows.map((c) => [c.slug, c.id]),
  );

  const productRecords = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    category_id: categoryMap[p.category_slug],
    price_retail: p.price_retail,
    price_wholesale: p.price_wholesale ?? null,
    unit: p.unit,
    min_wholesale_qty: p.min_wholesale_qty ?? null,
    stock: p.stock,
    images: p.images,
    active: p.active,
    featured: p.featured,
  }));

  const { error: productError } = await supabase
    .from("products")
    .insert(productRecords);
  if (productError) {
    console.error("Seed: error creando productos", productError.message);
  }
}
