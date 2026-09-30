# CLAUDE.md — Agronausa
## Plataforma e-commerce para productos agropecuarios con clientes B2C y B2B

> Lee este archivo completo antes de escribir una sola línea de código. Cada decisión de arquitectura tiene una razón de negocio. No la ignores.

---

## 🧠 Contexto del Negocio

**Cliente:** David Nausa — Agronausa, negocio agropecuario colombiano.

**Problema actual:** El catálogo vive únicamente en WhatsApp Business. Los clientes no pueden explorar productos sin escribirle, los pedidos se gestionan manualmente por chat, no hay historial de compras ni control de inventario.

**Solución:** Tienda web completa con catálogo público, carrito, pedidos y panel admin. Basada en la arquitectura de BSM, adaptada al contexto agropecuario y a la dualidad B2C (personas naturales) / B2B (negocios y distribuidores).

**Usuario final:** Dos perfiles distintos que conviven en la misma plataforma:
- **Persona natural**: compra por unidad o pequeñas cantidades, navega sin cuenta, paga al momento.
- **Negocio / distribuidor**: requiere precios especiales, compra por volumen, puede tener crédito o condiciones pactadas.

---

## 🎯 Principios de Diseño Irrompibles

1. **El catálogo es siempre visible sin registro.** Cualquier visitante puede ver productos y precios base. El registro solo se exige al hacer el pedido. Razón: reemplaza el catálogo de WhatsApp — si hay fricción al entrar, el cliente vuelve al chat.

2. **El precio mostrado es el precio cobrado.** No hay precios que cambien en checkout sin aviso explícito. Si un producto B2B tiene precio diferente, se muestra al usuario B2B autenticado, nunca se cambia silenciosamente. Razón: confianza del cliente.

3. **Un cliente B2B nunca ve precios de otro cliente B2B.** Las condiciones especiales son por cuenta, nunca globales. Razón: evitar conflictos entre distribuidores con márgenes distintos.

4. **El stock nunca queda en negativo.** Si un producto se agota durante el proceso de pedido, se notifica antes del checkout, no después. Razón: en productos agropecuarios el desabasto es frecuente y genera fricción si no se maneja a tiempo.

5. **El admin puede operar desde celular.** David gestiona su negocio en campo. Toda pantalla de admin debe ser usable en móvil con una mano. Razón: el usuario admin no está frente a un computador la mayor parte del día.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | React 18 + TypeScript (Vite) | Base del proyecto BSM, tipado evita errores en lógica de precios |
| Routing | React Router v6 | Rutas públicas + rutas anidadas de admin |
| Estilos | Tailwind CSS v3 | Consistencia visual con BSM, velocidad de desarrollo |
| Backend / DB | Supabase (PostgreSQL) | Auth, RLS, storage para imágenes de productos |
| Auth | Supabase Auth | Registro por email; rol admin en `app_metadata` (solo lo escribe el servidor) |
| Imágenes | Supabase Storage | Fotos de productos subidas por David desde el admin |
| Deploy | Vercel | Dominio propio de Agronausa, preview por branch |
| Lógica sensible | Supabase Edge Functions (Deno) | Crear pedidos y asignar roles con service role, fuera del cliente |
| Gráficas | recharts | Ingresos y series de tiempo en `/admin/analytics` |
| Iconos | lucide-react | Iconografía del admin |
| Pagos | Wompi (fase 2) | Pasarela colombiana, integración sencilla — aún no integrada |

---

## 📁 Estructura del Proyecto

```
agronausa/
├── src/
│   ├── components/
│   │   ├── ui/               # Button, Input, Badge, SkeletonLoader, WhatsAppButton
│   │   ├── catalog/          # ProductCard, ProductGrid
│   │   ├── cart/             # CartDrawer
│   │   ├── checkout/         # ConsentCheckboxes (Ley 1581)
│   │   ├── admin/            # AdminGuard, AdminSidebar, AdminUserRow, AlertBadge,
│   │   │                     # AlertCard, CategoryForm, FinancialKPI, InventoryRow,
│   │   │                     # MovementHistory, RevenueChart, SettingsForm,
│   │   │                     # StockAdjustModal, SupplierForm, TopProductsTable
│   │   └── layout/           # Header, Footer, MobileNav
│   ├── hooks/
│   │   ├── useProducts.ts    # Fetch + filtros de catálogo
│   │   ├── useCategories.ts  # CRUD de categorías (admin)
│   │   ├── useCart.tsx       # Estado del carrito (localStorage) — Context provider
│   │   ├── useOrders.ts      # validateStock + createOrder (vía Edge Function)
│   │   ├── useAuth.tsx       # Login, registro, perfil, tipo de cliente — Context provider
│   │   ├── useAdmin.ts       # CRUD de productos, gestión de pedidos
│   │   ├── useAdminUsers.ts  # Listado de usuarios y asignación de rol admin
│   │   ├── useInventory.ts   # Ajuste de stock + historial de movimientos
│   │   ├── useSuppliers.ts   # CRUD de proveedores
│   │   ├── useSettings.ts    # Lectura/escritura de app_settings
│   │   ├── useAlerts.ts      # Alertas derivadas (stock bajo, pedidos sin atender)
│   │   ├── useAnalytics.ts   # Métricas financieras y de ventas
│   │   └── usePageMeta.ts    # Título y meta tags por página
│   ├── pages/
│   │   ├── Home.tsx          # Hero + categorías + productos destacados
│   │   ├── Catalog.tsx       # Catálogo completo con filtros
│   │   ├── Product.tsx       # Detalle de producto
│   │   ├── Cart.tsx          # Carrito y resumen
│   │   ├── Checkout.tsx      # Datos de envío + consentimiento + confirmación
│   │   ├── OrderConfirm.tsx  # Pantalla de pedido recibido
│   │   ├── Account.tsx       # Historial de pedidos del cliente
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── PoliticaPrivacidad.tsx
│   │   ├── TerminosYCondiciones.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── Orders.tsx
│   │       ├── Customers.tsx
│   │       ├── Categories.tsx
│   │       ├── Inventory.tsx
│   │       ├── Suppliers.tsx
│   │       ├── Alerts.tsx
│   │       ├── Analytics.tsx
│   │       ├── Settings.tsx
│   │       └── AdminUsers.tsx
│   ├── lib/
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── formatters.ts     # formatCOP, formatDate
│   │   ├── constants.ts      # ROUTES, CATEGORIES, ORDER_STATUSES
│   │   └── seed.ts           # runSeedIfEmpty
│   ├── types/
│   │   └── index.ts          # Todos los tipos del dominio
│   └── App.tsx               # Rutas públicas + rutas /admin bajo AdminGuard
│   ├── main.tsx
│   ├── index.css             # Variables CSS globales + utilidades
│   └── vite-env.d.ts
├── supabase/
│   ├── config.toml
│   ├── migrations/           # SQL migrations versionadas (+ seed.sql paralelo)
│   └── functions/
│       ├── create-order/     # Crea pedido + consent_record con service role
│       └── set-admin-role/   # Lista usuarios y asigna/quita rol admin
├── scripts/                  # upload-images.js + productos-imagenes/ (fotos reales)
├── scratch/                  # Scripts sueltos de mantenimiento — no es código de la app
├── public/
├── index.html · vercel.json
├── FASE7.md                  # Especificación de los módulos de Fase 7
└── CLAUDE.md
```

---

## 💾 Schema de Base de Datos

> Este bloque describe la **forma** de las tablas. En `src/types/index.ts` todos
> los `created_at` / `updated_at` son `string` (ISO), no `Date`. Existen además
> `CustomerSnapshot`, `StockConflict`, `Category.created_at` y
> `Product.category?: Category` (el join que usa el catálogo) que no se repiten
> aquí.

```typescript
// Tabla profiles, 1:1 con auth.users (el rol admin NO va aquí: vive en app_metadata)
interface UserProfile {
  id: string                    // uuid — mismo que auth.users.id
  email?: string                // Sincronizado desde auth.users por handle_new_user()
  full_name: string
  phone: string
  customer_type: 'persona' | 'negocio'
  business_name?: string        // Solo si customer_type === 'negocio'
  nit?: string                  // Solo si customer_type === 'negocio'
  has_special_pricing: boolean  // true si David le asignó precios especiales
  created_at: Date
}

interface Category {
  id: string
  name: string                  // 'Lácteos y quesos', 'Mieles y derivados', etc.
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  active: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  category_id: string           // FK → categories
  price_retail: number          // Precio detal (COP)
  price_wholesale?: number      // Precio mayoreo — almacenado, aún NO aplicado (ver Flujo 2)
  unit: string                  // 'kg', 'bulto', 'litro', 'unidad', 'caja'
  min_wholesale_qty?: number    // Cantidad mínima para precio mayoreo
  stock: number
  images: string[]              // URLs en Supabase Storage
  active: boolean
  featured: boolean
  created_at: Date
  updated_at: Date
}

// Snapshot del producto al momento de agregarlo al carrito
interface CartItem {
  product_id: string
  product_name: string
  product_slug: string
  image_url: string
  unit: string
  quantity: number
  price_applied: number         // Precio en el momento de agregar al carrito
  stock: number                 // Stock visto al agregar — se revalida en checkout
}
// El carrito vive en localStorage, no en DB

interface Order {
  id: string
  order_number: string          // Ej: AGN-2026-0042 (legible para David)
  customer_id?: string          // null si compra como invitado
  customer_snapshot: {          // Datos al momento del pedido (inmutables)
    full_name: string
    email: string
    phone: string
    business_name?: string
    // create-order además guarda aquí consent_marketing y policy_version,
    // que el tipo CustomerSnapshot no declara
  }
  items: OrderItem[]
  subtotal: number              // // calculado
  total: number                 // // calculado
  status: OrderStatus
  shipping_address: Address
  notes?: string                // Nota del cliente al pedir
  admin_notes?: string          // Nota interna de David
  created_at: Date
  updated_at: Date
}

type OrderStatus =
  | 'pendiente'      // Recién creado
  | 'confirmado'     // David lo revisó
  | 'en_preparacion' // En alistamiento
  | 'despachado'     // Enviado / en camino
  | 'entregado'      // Completado
  | 'cancelado'

interface OrderItem {
  product_id: string
  product_name: string          // Snapshot — no FK viva
  quantity: number
  unit: string
  price_applied: number
  subtotal: number              // // calculado
}

interface Address {
  department: string
  city: string
  address_line: string
  reference?: string
}

// Tabla para precios especiales B2B
interface SpecialPricing {
  id: string
  customer_id: string           // FK → profiles
  product_id: string            // FK → products
  price: number                 // Precio pactado con ese cliente
  created_at: Date
}

// Tabla para cumplimiento de Ley 1581 (Protección de Datos)
// La escribe la Edge Function create-order, nunca el cliente.
// No existe como tipo en src/types/index.ts: solo como objeto literal en la función.
interface ConsentRecord {
  id: string
  order_id: string              // FK → orders
  customer_email: string
  consent_required: boolean     // Obligatorio — sin esto la orden se rechaza (400)
  consent_marketing: boolean    // Opcional
  policy_version: string        // ⚠️ Hardcodeado como "v1.0-2026" en ConsentCheckboxes.tsx,
                                //    NO se lee de app_settings.terms_version
  created_at: Date
}
// ⚠️ consent_records no tiene migration en supabase/migrations/ — vive solo
//    en la DB remota. Crear la migration antes de reconstruir el proyecto.

// ─── Fase 7: módulos de operación ───

// Historial de movimientos de inventario (solo admin, RLS con public.is_admin())
interface InventoryMovement {
  id: string
  product_id: string            // FK → products
  type: 'entrada' | 'salida' | 'ajuste' | 'pedido'
  quantity: number
  stock_before: number
  stock_after: number
  reason?: string
  order_id?: string             // FK → orders, si el movimiento vino de un pedido
  created_by?: string           // FK → auth.users
  created_at: Date
}

// ⚠️ En la migration category_ids y active son nullables; el tipo TS los
//    declara requeridos y useSuppliers castea con `as Supplier[]` sin validar.
interface Supplier {
  id: string
  name: string
  contact_name?: string
  phone?: string
  email?: string
  category_ids: string[]        // uuid[] → categories
  notes?: string
  active: boolean
  created_at: Date
  updated_at: Date
}

// Configuración maestra clave-valor. Lectura pública excepto admin_email
// y service_notes; escritura solo admin.
type AppSettingKey =
  | 'site_name'
  | 'whatsapp_number'
  | 'low_stock_threshold'       // Umbral de alerta de stock bajo
  | 'alert_pending_hours'       // Horas antes de alertar un pedido sin atender
  | 'admin_email'
  | 'store_department'
  | 'store_city'
  | 'store_address'
  | 'terms_version'
type AppSettings = Record<AppSettingKey, string>

// Las alertas NO son una tabla: useAlerts las deriva en runtime de
// products, orders y app_settings
interface Alert {
  id: string
  type: 'stock_bajo' | 'pedido_sin_atender' | 'sin_imagen'
  severity: 'critica' | 'advertencia'
  title: string
  description: string
  action_url: string
  created_at: Date
  product_id?: string
  order_id?: string
}

// Analytics tampoco es tabla: useAnalytics la calcula desde orders/profiles
interface FinancialSummary {
  revenue_total: number
  orders_count: number
  avg_ticket: number
  orders_by_status: Record<OrderStatus, number>
  top_products: Array<{ product_name: string; units_sold: number; revenue: number }>
  revenue_by_day: Array<{ date: string; revenue: number; orders: number }>
  new_customers: number
}
```

---

## 🔄 Flujos de Negocio Críticos

### Flujo 1: Cliente explora y hace un pedido (sin cuenta)
1. Entra a agronausa.vercel.app — ve catálogo sin login
2. Filtra por categoría o busca producto
3. Agrega al carrito (persiste en localStorage con snapshot de nombre, precio, unidad e imagen)
4. Va a checkout → ingresa nombre, email, teléfono, dirección
5. Marca el consentimiento de tratamiento de datos (obligatorio) y el de marketing (opcional)
6. Confirma pedido → el frontend invoca la Edge Function `create-order`, que con service role:
   - rechaza la orden si `consentRequired` es falso (400)
   - genera el `order_number` (`AGN-<año>-NNNN`) con un `count(*)` de las órdenes
     del año — ⚠️ dos pedidos simultáneos generan el mismo número y el segundo
     falla por el `unique` de `orders.order_number`
   - inserta la orden con `customer_id: null` si es invitado
   - inserta el `consent_record` asociado
7. Recibe pantalla de confirmación con número de pedido
8. David recibe notificación (email o WhatsApp — fase 2, aún no implementado)

> El frontend nunca inserta órdenes directo en la tabla: todo pasa por `create-order`.
>
> ⚠️ `create-order` **confía en el cliente**: inserta `price_applied` tal como
> llega en el body, sin recalcularlo contra `products` ni `special_pricing`, y
> sin revalidar stock. Recalcular precio y stock dentro de la función es lo que
> falta para que los principios 2 y 4 se cumplan de verdad.

### Flujo 2: Cliente B2B ve sus precios especiales
1. Entra y hace login con su cuenta
2. `useAuth` carga el perfil y, si `has_special_pricing === true`, baja el mapa
   `special_pricing` de ese cliente (`product_id → price`)
3. `getEffectivePrice(product)` — expuesto por `useAuth`, única fuente de verdad
   del precio — devuelve el precio pactado solo si `customer_type === 'negocio'`,
   `has_special_pricing` y existe fila para ese producto; si no, `price_retail`
4. `ProductCard` y `Product` muestran ese precio; el carrito guarda el mismo
   valor en `price_applied`
5. El pedido registra el precio real cobrado (snapshot inmutable)

> `price_wholesale` y `min_wholesale_qty` existen en la tabla y se editan desde
> el admin, pero **ninguna pantalla los aplica todavía**: hoy el precio B2B sale
> solo de `special_pricing`. Cualquier cambio de precios debe pasar por
> `getEffectivePrice`, nunca calcularse dentro de un componente.

### Flujo 3: David gestiona un pedido (admin móvil)
1. Entra al panel admin → ve listado de pedidos ordenados por fecha
2. Toca un pedido → ve detalle completo
3. Cambia el estado (pendiente → confirmado → despachado → entregado)
4. Puede agregar nota interna (`admin_notes`)
5. El historial del cliente refleja el nuevo estado al recargar — no hay
   suscripciones realtime en el proyecto, todo es refetch

### Flujo 4: David actualiza stock / agrega producto
1. Admin → Productos → "Nuevo producto" o toca un producto existente
2. Sube fotos desde el celular (Supabase Storage)
3. Ingresa precio detal, y opcionalmente precio mayoreo + cantidad mínima
4. Guarda → visible inmediatamente en el catálogo público

### Flujo 5: Producto sin stock en checkout
1. Cliente tiene producto en carrito
2. `validateStock()` consulta el stock real de cada producto **al enviar el
   formulario** (`handleSubmit`), no al entrar a la pantalla: el cliente llena
   todos los datos antes de enterarse del conflicto
3. Si stock < cantidad solicitada → muestra los `StockConflict` antes de confirmar
4. Cliente puede ajustar cantidad o eliminar el ítem
5. Nunca se genera un pedido con stock negativo

> ⚠️ Estado actual: `create-order` **no descuenta stock**. El control depende de
> la validación previa y del ajuste manual en Inventario. Descontar stock dentro
> de la Edge Function (transaccional, con movimiento tipo `pedido`) es el
> siguiente paso para cerrar el principio "el stock nunca queda en negativo".

### Flujo 6: David ajusta inventario (Fase 7)
1. Admin → Inventario → ve productos con su stock y umbral de alerta
2. Toca "Ajustar" → `StockAdjustModal` pide la nueva cantidad y un motivo
3. `useInventory.adjustStock()` valida que el nuevo stock no sea negativo,
   actualiza `products.stock` e inserta un `inventory_movement` con
   `stock_before`, `stock_after` y `created_by`
   - ⚠️ El modal ya tiene un `<select>` de tipo, pero lo concatena al texto libre
     (`"<tipo> - <nota>"`) y el hook lo vuelve a inferir con `includes('entrada')`
     sobre el string completo: una nota como "devolución de entrada" con tipo
     "ajuste" se guarda como `entrada`. El tipo elegido debe viajar como dato,
     no dentro del motivo.
4. `MovementHistory` muestra la trazabilidad completa por producto

### Flujo 7: Alertas operativas (Fase 7)
1. `useAlerts` lee los umbrales desde `app_settings`
   (`low_stock_threshold`, `alert_pending_hours`)
2. Deriva alertas en runtime:
   - stock bajo (`advertencia`) o agotado (`critica` si stock = 0)
   - pedidos en `pendiente` más viejos que el umbral de horas — siempre `critica`
   - productos sin imagen — siempre `advertencia`
3. `AlertBadge` muestra **solo el conteo de críticas**; `/admin/alerts` el detalle
4. Cada alerta enlaza a la pantalla donde se resuelve (`action_url`)

### Flujo 8: Configuración de la tienda (Fase 7)
1. Admin → Configuración → `SettingsForm` edita las claves de `app_settings`
2. Los valores no sensibles son de lectura pública (RLS), así el sitio los usa
   sin exponer `admin_email` ni `service_notes`
3. Cambiar `low_stock_threshold` o `alert_pending_hours` recalibra las alertas
   sin tocar código

### Flujo 9: Gestión de usuarios admin (Fase 7)
1. Admin → Usuarios → `useAdminUsers` cruza `profiles` con la Edge Function
   `set-admin-role` (acción `list_users`), que usa service role para leer roles
2. La función verifica que quien llama sea admin (401 sin sesión, 403 sin rol)
3. Asignar o quitar admin escribe `app_metadata.role`, que es exactamente lo
   que leen las policies RLS a través de `public.is_admin()`
   (`auth.jwt() -> 'app_metadata' ->> 'role'`)
4. Si la Edge Function falla, la pantalla degrada a mostrar solo los perfiles

---

## 🎨 Sistema de Diseño

```css
/* src/index.css — variables globales */
:root {
  --color-primary:       #3D1F0A;  /* Café profundo */
  --color-primary-hover: #2C1507;
  --color-accent:        #C4853A;  /* Tierra / cosecha */
  --color-bg:            #F7F1E8;  /* Fondo crema cálido */
  --color-surface:       #FFFFFF;
  --color-border:        #E2D5C3;
  --color-text:          #1C0F05;
  --color-text-muted:    #7A5C3E;
  --color-success:       #3A7D44;
  --color-error:         #C0392B;
  --color-warning:       #E67E22;
}
```

```js
// tailwind.config.js — lo que realmente pintan las clases (bg-bg, text-primary…)
colors: {
  primary: "#2D6A1F",   // Verde campo
  accent:  "#C4853A",
  bg:      "#F9F6F0",
  surface: "#FFFFFF",
  border:  "#DDD5C8",
  text:    "#2C1A0E",
  "text-muted": "#7A6553",
  success: "#3A7D44", error: "#C0392B", warning: "#E67E22",
}
fontFamily: {
  display: ["Fraunces", "Georgia", "serif"],      // Títulos y precios
  ui:      ["Plus Jakarta Sans", "sans-serif"],   // Nav, labels, botones
  body:    ["Inter", "sans-serif"],               // Cuerpo
}
```

> ⚠️ **Dos paletas conviven y ambas se ven.** Casi toda la app usa clases
> Tailwind, así que se pinta con el verde de `tailwind.config.js`. Pero
> `PoliticaPrivacidad.tsx` usa las variables CSS marrones vía sintaxis arbitraria
> (`text-[--color-primary]`, `border-[--color-border]`) en ~25 líneas: esa página
> se ve café mientras el resto se ve verde. El `body` también toma
> `var(--color-bg)`. Antes de tocar color, decidir cuál de las dos manda y
> unificar — no agregar una tercera.
>
> ⚠️ Las reglas de touch de abajo son la intención, no el estado: no existen los
> tokens `--touch-min`, `Button` mide ~44px (por eso los callers repiten
> `min-h-[48px]`), y los botones +/- son 40px en `Cart` y 32px con `gap-1` en
> `CartDrawer`. `hover:bg-primary-hover` en `StockAdjustModal` es una clase muerta:
> Tailwind no define `primary-hover` (el hover real está hardcodeado como
> `hover:bg-[#245517]`).

**Touch — el admin opera desde celular:**
- Todo botón de acción: mínimo 48px de alto
- Botones de cantidad (+/-): 48×48px cuadrado
- Separación entre elementos táctiles: mínimo 8px
- Fuente mínima en móvil: 14px

---

## 📦 Seed Data

Al inicializar el proyecto cargar automáticamente si la DB está vacía:

**Categorías (8)** — definidas en `src/lib/constants.ts` (`CATEGORIES`):
Lácteos y quesos, Mieles y derivados, Frutas y verduras, Hongos, Huevos y aves,
Panela y derivados, Café y cacao, Otros productos naturales.

> El catálogo real de Agronausa es de **producto agropecuario terminado**
> (alimento fresco y procesado), no de insumos agrícolas. Cualquier texto,
> categoría o ejemplo nuevo debe hablar en ese lenguaje.

**Productos de muestra (16):** 2 por categoría, con imagen placeholder, precio
estimado en COP, stock inicial variable (15–90) y 7 marcados `featured`.

Ojo: hay **dos seeds paralelos** — `src/lib/seed.ts` (el que corre en la app) y
`supabase/migrations/seed.sql`. Al cambiar el catálogo de muestra hay que tocar
ambos o decidir cuál se elimina.

**Usuario admin (1):**
El rol se asigna desde `/admin/users` vía la Edge Function `set-admin-role`, que
escribe `app_metadata.role = 'admin'`. `ADMIN_EMAIL` del `.env` ya no se usa en
el código: el correo de contacto vive en `app_settings.admin_email`.

**Hook de seed:**
```typescript
// src/lib/seed.ts
export async function runSeedIfEmpty() {
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
  if (count === 0) await seedDatabase()
}
// Llamar en App.tsx solo una vez
```

---

## 🖥️ Pantallas y Navegación

**Rutas (`src/App.tsx`):**

| Público | Admin (bajo `AdminGuard`) |
|---|---|
| `/` · `/catalog` · `/product/:slug` | `/admin` (Dashboard) |
| `/cart` · `/checkout` · `/order-confirm` | `/admin/products` · `/admin/categories` |
| `/account` · `/login` · `/register` | `/admin/orders` · `/admin/customers` |
| `/politica-de-privacidad` | `/admin/inventory` · `/admin/suppliers` |
| `/terminos-y-condiciones` | `/admin/alerts` · `/admin/analytics` |
| `*` → redirige a `/` | `/admin/settings` · `/admin/users` |

Navegación: el `Header` muestra el nav principal **en todos los tamaños** (se
comprime tipografía y padding en móvil, no se oculta); `MobileNav` agrega abajo
una tab bar fija + hoja deslizante con accesos de cuenta y de admin; y
`AdminSidebar` aparece dentro de `/admin` en pantallas `md+`.

```
HOME
┌─────────────────────────────────┐
│ [Logo Agronausa]    🛒 Carrito  │
├─────────────────────────────────┤
│   Hero: foto campo + tagline    │
│   [Ver catálogo completo]       │
├─────────────────────────────────┤
│ Categorías destacadas (scroll)  │
│ [🧀 Lácteos]  [🍯 Mieles]       │
├─────────────────────────────────┤
│ Productos destacados (grid 2x)  │
│ ┌──────┐ ┌──────┐              │
│ │ img  │ │ img  │              │
│ │$xxx  │ │$xxx  │              │
│ └──────┘ └──────┘              │
└─────────────────────────────────┘

CATÁLOGO
┌─────────────────────────────────┐
│ Filtro categoría [dropdown]     │
│ Buscar... [🔍]                  │
├─────────────────────────────────┤
│ Grid de productos (2 cols)      │
│ ┌──────┐ ┌──────┐              │
│ │ img  │ │ img  │              │
│ │Nombre│ │Nombre│              │
│ │$xx kg│ │$xx kg│              │
│ [+carr]  [+carr]               │
└─────────────────────────────────┘

CHECKOUT
┌─────────────────────────────────┐
│ Resumen pedido (colapsable)     │
├─────────────────────────────────┤
│ Nombre completo                 │
│ Teléfono                        │
│ Email                           │
│ Departamento / Ciudad           │
│ Dirección                       │
│ Notas (opcional)                │
├─────────────────────────────────┤
│ Total: $xxx.xxx COP             │
│ [Confirmar pedido]              │
└─────────────────────────────────┘

ADMIN — PEDIDOS (móvil)
┌─────────────────────────────────┐
│ [pendiente][confirmado][todos]  │
├─────────────────────────────────┤
│ AGN-2026-0042                   │
│ Carlos Martínez · hace 2h       │
│ $145.000 · 3 productos    [›]  │
├─────────────────────────────────┤
│ AGN-2026-0041                   │
│ Distribuciones El Campo · 1d    │
│ $890.000 · 8 productos    [›]  │
└─────────────────────────────────┘
```

---

## ⚙️ Configuración Técnica

```env
# .env.local
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Solo en funciones de servidor
ADMIN_EMAIL=david@agronausa.com
VITE_SITE_NAME=Agronausa
VITE_WHATSAPP_NUMBER=573204953114  # Para botón "Consultar por WhatsApp"
```

`SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_EMAIL` no se usan en el bundle: las Edge
Functions leen `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`
del entorno de Supabase. El número de WhatsApp está duplicado: el frontend usa
`VITE_WHATSAPP_NUMBER` y el admin edita `app_settings.whatsapp_number` — al
cambiarlo hay que tocar ambos hasta que se unifiquen. `VITE_SITE_NAME` no se usa
en `src/`: el nombre real sale de `app_settings.site_name`.

```typescript
// tsconfig.json — strict mode obligatorio
{
  "compilerOptions": {
    "strict": true,                    // ✅ activo
    "noUncheckedIndexedAccess": true   // ⚠️ aún NO activo en tsconfig.json
  }
}
```

---

## 🚀 Orden de Construcción para Claude Code

### Fase 1: Setup y base (Día 1)
- [x] Crear proyecto Vite + React + TypeScript + Tailwind
- [x] Configurar Supabase: tablas, RLS básico, Storage bucket para imágenes
- [x] Variables de entorno y cliente Supabase
- [x] Sistema de diseño: variables CSS, fuentes, componentes UI base (Button, Badge, Input)
- [x] Routing básico (React Router): Home, Catalog, Product, Cart, Checkout, Admin
- [x] **Criterio de éxito:** La app carga, el router funciona, Supabase conecta sin errores

### Fase 2: Catálogo público (Día 2)
- [x] `useProducts` hook con fetch, filtro por categoría y búsqueda
- [x] `ProductCard` con imagen, nombre, precio, unidad, botón agregar al carrito
- [x] `ProductGrid` con filtro de categorías
- [x] Página `Catalog.tsx` completa
- [x] Página `Product.tsx` con detalle y galería de imágenes
- [x] **Criterio de éxito:** Se pueden ver todos los productos, filtrar y buscar sin login

### Fase 3: Carrito y pedido (Día 3)
- [x] `useCart` hook con localStorage (agregar, quitar, cambiar cantidad)
- [x] `CartDrawer` lateral (slide-over en móvil)
- [x] Validación de stock en checkout (al enviar el formulario, no al entrar)
- [x] Formulario de checkout con validación
- [x] Creación de orden en Supabase + pantalla de confirmación con número AGN-XXXX
- [x] **Criterio de éxito:** Un visitante sin cuenta puede hacer un pedido completo de punta a punta

### Fase 4: Auth y precios B2B (Día 4)
- [x] Registro y login (email + password, Supabase Auth)
- [x] Formulario de registro con campo `customer_type` (persona / negocio)
- [x] `useAuth` hook con perfil y tipo de cliente
- [x] Lógica de precios: si el usuario es negocio con `special_pricing`, mostrar precio especial
- [x] Página `Account.tsx`: historial de pedidos del cliente
- [x] **Criterio de éxito:** Un usuario B2B ve su precio especial en el catálogo, un B2C ve el precio base

### Fase 5: Panel Admin (Día 5-6)
- [x] Guard de ruta admin (solo si `app_metadata.role === 'admin'`)
- [x] Dashboard con métricas básicas: pedidos hoy, ingresos del mes, productos con bajo stock
- [x] `Orders.tsx`: listado con filtros por estado, detalle de pedido, cambio de estado
- [x] `Products.tsx`: listado, formulario crear/editar, subida de imágenes a Supabase Storage
- [x] `Customers.tsx`: listado de clientes registrados, asignar `has_special_pricing`
- [x] Formulario de `SpecialPricing`: asignar precio especial por producto a un cliente B2B
- [x] **Criterio de éxito:** David puede gestionar pedidos, subir productos y asignar precios desde su celular

### Fase 6: Pulido y deploy (Día 7)
- [x] SEO básico: meta tags, Open Graph, favicon con logo Agronausa
- [x] Botón flotante "Consultar por WhatsApp" (usa `VITE_WHATSAPP_NUMBER`)
- [x] Estados vacíos, loading skeletons, manejo de errores en UI
- [x] Responsive final pass: revisar todo en 375px
- [x] Deploy en Vercel (agronausa.vercel.app; dominio agronausa.com pendiente)
- [x] **Criterio de éxito:** El sitio está publicado, David puede acceder al admin, el primer pedido de prueba funciona

### Fase 7: Módulos de operación (post-MVP)
- [x] Navegación admin: `AdminSidebar` en desktop + accesos de admin en `MobileNav`
- [x] `Categories.tsx`: CRUD de categorías con imagen y orden
- [x] `Inventory.tsx`: ajuste de stock con motivo e historial (`inventory_movements`)
- [x] `Suppliers.tsx`: CRUD de proveedores asociados a categorías
- [x] `Alerts.tsx`: alertas derivadas de stock bajo, pedidos sin atender y productos sin imagen
- [x] `Analytics.tsx`: ingresos, ticket promedio, top productos y serie diaria (recharts)
- [x] `Settings.tsx`: configuración maestra en `app_settings`
- [x] `AdminUsers.tsx` + Edge Function `set-admin-role`: asignar/quitar rol admin
- [x] `email` en `profiles`, sincronizado desde `auth.users` por `handle_new_user()`
- [x] **Criterio de éxito:** David opera inventario, proveedores, alertas y configuración desde el celular sin tocar Supabase

### Pendientes conocidos
- [ ] Migration de `consent_records` (la tabla existe en remoto, no en el repo)
- [ ] Descuento de stock transaccional dentro de `create-order`
- [ ] Unificar la paleta (CSS vars vs `tailwind.config.js`)
- [ ] `Header` redirige a `/ingresar` tras cerrar sesión, ruta que no existe → cae en `*` y termina en `/`
- [ ] `noUncheckedIndexedAccess` sigue apagado en `tsconfig.json`
- [ ] Número de WhatsApp duplicado entre `VITE_WHATSAPP_NUMBER` y `app_settings`
- [ ] `price_wholesale` / `min_wholesale_qty` se guardan pero no se aplican en ninguna pantalla
- [ ] `create-order` acepta el `price_applied` que manda el cliente sin recalcularlo
- [ ] `order_number` se genera con `count(*)`: dos pedidos simultáneos chocan contra el `unique`
- [ ] `ConsentCheckboxes` enlaza a `/politica-privacidad`; la ruta real es `/politica-de-privacidad` → cae en `*`
- [ ] `policy_version` hardcodeado en el checkout en vez de leer `app_settings.terms_version`
- [x] Rol admin movido a `app_metadata` en RLS, `AdminGuard`, `Header`, `MobileNav` y `set-admin-role` (migración `20260929000000_admin_role_app_metadata.sql`)
- [ ] La Edge Function `set-admin-role` está en el repo pero no desplegada en producción: `/admin/users` no puede listar ni asignar roles
- [ ] `any` usado en 18 puntos (hooks de Fase 7 y páginas de admin), contra la regla del proyecto
- [ ] `Account.tsx` es la única página que llama a `supabase` directo, sin hook
- [ ] Reglas de touch incumplidas: `Button` ~44px, +/- de 40px en `Cart` y 32px en `CartDrawer`
- [ ] `service_notes` es una clave fantasma: la RLS la excluye pero no existe en ningún lado
- [x] Textos heredados del catálogo de insumos: meta tags, hero, buscador y meta description de `Catalog.tsx`

---

## 🚨 Reglas de Código

**SIEMPRE:**
- TypeScript strict, nunca `any`
- Todo acceso a Supabase a través de hooks (`useProducts`, `useOrders`, etc.) — nunca llamadas directas desde componentes
- Formatear precios con `formatCOP(price)` — nunca template literals crudos
- Validar stock antes de crear un pedido
- RLS activado en todas las tablas desde el día 1
- Las políticas de admin usan `public.is_admin()`, que lee `app_metadata.role` del JWT
- Los snapshots de pedido (nombre, precio) son inmutables después de creado — nunca join vivo con productos

**NUNCA:**
- No hardcodear precios ni categorías — todo viene de la DB
- No mostrar el precio B2B a un usuario no autenticado o B2C
- No permitir stock negativo
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- No usar `useEffect` para lógica de negocio — usar hooks dedicados
- No insertar órdenes ni `consent_records` desde el cliente — eso es de `create-order`
- No cambiar roles desde el cliente — eso es de `set-admin-role`
- No leer ni escribir el rol admin en `user_metadata`: cualquier usuario puede
  editarlo con `supabase.auth.updateUser` y darse permisos de admin. El rol vive
  en `app_metadata.role` (solo lo escribe el servidor), y las policies RLS lo
  evalúan con `public.is_admin()`. Frontend y RLS deben leer lo mismo.

---

## 📋 Comandos de Desarrollo

```bash
npm run dev          # Servidor local
npm run build        # Build de producción
npm run preview      # Preview del build
npx supabase start   # DB local (opcional)
npx supabase db push # Aplicar migrations a producción

npx supabase functions deploy create-order     # Creación de pedidos + consentimiento
npx supabase functions deploy set-admin-role   # Gestión de roles admin
```

---

## 🔮 Roadmap Futuro (no construir ahora)

- **Pagos online con Wompi** — integrar en checkout como segunda opción de pago
- **Notificaciones WhatsApp** — avisar a David cuando llega un pedido vía API de WhatsApp Business
- **Pedidos recurrentes** — el cliente B2B puede repetir un pedido anterior con un clic
- **Catálogo con variantes** — mismo producto en distintas presentaciones (1kg, 5kg, bulto)
- **App móvil nativa** — si el volumen de pedidos lo justifica, migrar admin a React Native
- **Analítica de ventas** — reportes de productos más vendidos, clientes frecuentes, estacionalidad
