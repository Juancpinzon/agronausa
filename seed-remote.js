import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const content = readFileSync(path, "utf-8");
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return [key.trim(), rest.join("=").trim()];
      }),
  );
}

const env = loadEnv("./.env.local");
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from .env.local",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = [
  {
    name: "Insumos agrícolas",
    slug: "insumos-agricolas",
    description: "Herramientas y complementos para cultivos productivos.",
    image_url:
      "https://via.placeholder.com/800x500.png?text=Insumos+Agr%C3%ADcolas",
    sort_order: 1,
    active: true,
  },
  {
    name: "Semillas y material vegetal",
    slug: "semillas-material-vegetal",
    description: "Semillas certificadas y material para siembra.",
    image_url: "https://via.placeholder.com/800x500.png?text=Semillas",
    sort_order: 2,
    active: true,
  },
  {
    name: "Herramientas",
    slug: "herramientas",
    description: "Equipos manuales y herramientas para el campo.",
    image_url: "https://via.placeholder.com/800x500.png?text=Herramientas",
    sort_order: 3,
    active: true,
  },
  {
    name: "Fertilizantes",
    slug: "fertilizantes",
    description:
      "Fertilizantes orgánicos y químicos para todo tipo de cultivos.",
    image_url: "https://via.placeholder.com/800x500.png?text=Fertilizantes",
    sort_order: 4,
    active: true,
  },
  {
    name: "Plaguicidas",
    slug: "plaguicidas",
    description: "Protege tus cultivos frente a plagas y enfermedades.",
    image_url: "https://via.placeholder.com/800x500.png?text=Plaguicidas",
    sort_order: 5,
    active: true,
  },
  {
    name: "Equipos de riego",
    slug: "equipos-riego",
    description: "Sistemas eficientes de riego para tus parcelas.",
    image_url: "https://via.placeholder.com/800x500.png?text=Riego",
    sort_order: 6,
    active: true,
  },
  {
    name: "Alimentos para animales",
    slug: "alimentos-para-animales",
    description: "Forrajes y concentrados para ganado y aves.",
    image_url:
      "https://via.placeholder.com/800x500.png?text=Alimentos+Animales",
    sort_order: 7,
    active: true,
  },
  {
    name: "Otros",
    slug: "otros",
    description: "Productos variados para el agro y la finca.",
    image_url: "https://via.placeholder.com/800x500.png?text=Otros",
    sort_order: 8,
    active: true,
  },
];

const products = [
  {
    name: "Fertilizante granular 10-10-10",
    slug: "fertilizante-granular-10-10-10",
    description:
      "Fertilizante equilibrado para suelos agrícolas de rendimiento alto.",
    category_slug: "fertilizantes",
    price_retail: 52000,
    unit: "kg",
    stock: 50,
    images: [
      "https://via.placeholder.com/800x500.png?text=Fertilizante+10-10-10",
    ],
    active: true,
    featured: true,
  },
  {
    name: "Semilla de maíz híbrido",
    slug: "semilla-de-maiz-hibrido",
    description: "Semilla de maíz resistente y de alto rendimiento.",
    category_slug: "semillas-material-vegetal",
    price_retail: 42000,
    unit: "bolsa 25kg",
    stock: 60,
    images: ["https://via.placeholder.com/800x500.png?text=Semilla+Ma%C3%ADz"],
    active: true,
    featured: true,
  },
  {
    name: "Azadón de mango reforzado",
    slug: "azadon-de-mango-reforzado",
    description: "Azadón ergonómico para trabajo pesado en fincas.",
    category_slug: "herramientas",
    price_retail: 68000,
    unit: "unidad",
    stock: 35,
    images: ["https://via.placeholder.com/800x500.png?text=Azad%C3%B3n"],
    active: true,
    featured: false,
  },
  {
    name: "Riego por goteo 50m",
    slug: "riego-por-goteo-50m",
    description: "Kit de riego por goteo completo para hortalizas y huertos.",
    category_slug: "equipos-riego",
    price_retail: 145000,
    unit: "kit",
    stock: 18,
    images: ["https://via.placeholder.com/800x500.png?text=Riego+Goteo"],
    active: true,
    featured: false,
  },
  {
    name: "Herbicida selectivo para pastos",
    slug: "herbicida-selectivo-pastos",
    description: "Herbicida para controlar malezas en cultivos de pasto.",
    category_slug: "plaguicidas",
    price_retail: 72000,
    unit: "litro",
    stock: 40,
    images: ["https://via.placeholder.com/800x500.png?text=Herbicida"],
    active: true,
    featured: false,
  },
  {
    name: "Pienso concentrado para bovinos",
    slug: "pienso-concentrado-bovinos",
    description: "Alimento balanceado para animales de crianza bovina.",
    category_slug: "alimentos-para-animales",
    price_retail: 62000,
    unit: "saco 25kg",
    stock: 42,
    images: ["https://via.placeholder.com/800x500.png?text=Pienso+Bovino"],
    active: true,
    featured: false,
  },
  {
    name: "Insecticida biológico",
    slug: "insecticida-biologico",
    description: "Protección natural contra plagas de hojas y frutos.",
    category_slug: "plaguicidas",
    price_retail: 38000,
    unit: "litro",
    stock: 55,
    images: ["https://via.placeholder.com/800x500.png?text=Insecticida"],
    active: true,
    featured: true,
  },
  {
    name: "Manguera para riego 30m",
    slug: "manguera-para-riego-30m",
    description: "Manguera flexible para riego manual y sistemas temporales.",
    category_slug: "equipos-riego",
    price_retail: 24000,
    unit: "unidad",
    stock: 70,
    images: ["https://via.placeholder.com/800x500.png?text=Manguera+Riego"],
    active: true,
    featured: false,
  },
  {
    name: "Guantes de trabajo reforzados",
    slug: "guantes-de-trabajo-reforzados",
    description: "Guantes para campo con refuerzo en palma y dedos.",
    category_slug: "herramientas",
    price_retail: 12000,
    unit: "par",
    stock: 95,
    images: ["https://via.placeholder.com/800x500.png?text=Guantes"],
    active: true,
    featured: false,
  },
  {
    name: "Semilla de tomate cherry",
    slug: "semilla-de-tomate-cherry",
    description: "Semilla para cultivo de tomate cherry en huertos y terrazas.",
    category_slug: "semillas-material-vegetal",
    price_retail: 22000,
    unit: "paquete",
    stock: 80,
    images: ["https://via.placeholder.com/800x500.png?text=Semilla+Tomate"],
    active: true,
    featured: false,
  },
];

async function seedDatabase() {
  console.log("Seed: insertando categorías...");
  const { error: categoryError } = await supabase
    .from("categories")
    .upsert(categories, {
      onConflict: "slug",
    });

  if (categoryError) {
    throw categoryError;
  }

  const { data: categoryRows, error: categorySelectError } = await supabase
    .from("categories")
    .select("id, slug");

  if (categorySelectError || !categoryRows) {
    throw (
      categorySelectError ||
      new Error("No se pudieron leer las categorías insertadas")
    );
  }

  const categoryMap = Object.fromEntries(
    categoryRows.map((category) => [category.slug, category.id]),
  );

  const productRecords = products.map((product) => ({
    name: product.name,
    slug: product.slug,
    description: product.description,
    category_id: categoryMap[product.category_slug],
    price_retail: product.price_retail,
    unit: product.unit,
    stock: product.stock,
    images: product.images,
    active: product.active,
    featured: product.featured,
    min_wholesale_qty: product.min_wholesale_qty || null,
  }));

  console.log("Seed: insertando productos...");
  const { error: productError } = await supabase
    .from("products")
    .upsert(productRecords, {
      onConflict: "slug",
    });

  if (productError) {
    throw productError;
  }

  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });
  const { count: productsCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  console.log(
    `Seed completado: ${categoriesCount ?? 0} categorías, ${productsCount ?? 0} productos.`,
  );
}

seedDatabase()
  .then(() => {
    console.log("Seed remoto ejecutado con éxito.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed remoto falló:", error.message || error);
    process.exit(1);
  });
