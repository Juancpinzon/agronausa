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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const { count: categoryCount, error: categoryError } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });
  const { count: productCount, error: productError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (categoryError) {
    console.error("Error categories:", categoryError.message);
  } else {
    console.log("categories count:", categoryCount);
  }

  if (productError) {
    console.error("Error products:", productError.message);
  } else {
    console.log("products count:", productCount);
  }
})();
