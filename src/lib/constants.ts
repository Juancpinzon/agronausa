export const ROUTES = {
  home: "/",
  catalog: "/catalog",
  product: (slug: string) => `/product/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orderConfirm: "/order-confirm",
  account: "/account",
  login: "/login",
  register: "/register",
  admin: "/admin",
  adminProducts: "/admin/products",
  adminOrders: "/admin/orders",
  adminCustomers: "/admin/customers",
};

export const CATEGORIES = [
  { name: "Lácteos y quesos",         slug: "lacteos-quesos" },
  { name: "Mieles y derivados",        slug: "mieles-derivados" },
  { name: "Frutas y verduras",         slug: "frutas-verduras" },
  { name: "Hongos",                    slug: "hongos" },
  { name: "Huevos y aves",             slug: "huevos-aves" },
  { name: "Panela y derivados",        slug: "panela-derivados" },
  { name: "Café y cacao",              slug: "cafe-cacao" },
  { name: "Otros productos naturales", slug: "otros-naturales" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const ORDER_STATUSES = [
  { value: "pendiente",      label: "Pendiente" },
  { value: "confirmado",     label: "Confirmado" },
  { value: "en_preparacion", label: "En preparación" },
  { value: "despachado",     label: "Despachado" },
  { value: "entregado",      label: "Entregado" },
  { value: "cancelado",      label: "Cancelado" },
] as const;
