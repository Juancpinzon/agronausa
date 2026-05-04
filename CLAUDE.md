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
| Frontend | React 18 + TypeScript | Base del proyecto BSM, tipado evita errores en lógica de precios |
| Estilos | Tailwind CSS v3 | Consistencia visual con BSM, velocidad de desarrollo |
| Backend / DB | Supabase (PostgreSQL) | Auth, RLS, storage para imágenes de productos |
| Auth | Supabase Auth | Registro por email, diferenciación de rol en user metadata |
| Imágenes | Supabase Storage | Fotos de productos subidas por David desde el admin |
| Deploy | Vercel | Dominio propio de Agronausa, preview por branch |
| Pagos | Wompi (fase 2) | Pasarela colombiana, integración sencilla |

---

## 📁 Estructura del Proyecto

```
agronausa/
├── src/
│   ├── components/
│   │   ├── ui/               # Botones, inputs, badges, modales reutilizables
│   │   ├── catalog/          # ProductCard, ProductGrid, CategoryFilter
│   │   ├── cart/             # CartDrawer, CartItem, CartSummary
│   │   ├── orders/           # OrderCard, OrderStatus, OrderDetail
│   │   ├── admin/            # ProductForm, InventoryTable, OrdersPanel
│   │   └── layout/           # Header, Footer, MobileNav
│   ├── hooks/
│   │   ├── useProducts.ts    # Fetch + filtros de catálogo
│   │   ├── useCart.ts        # Estado del carrito (localStorage)
│   │   ├── useOrders.ts      # Crear y consultar pedidos
│   │   ├── useAuth.ts        # Login, registro, perfil, tipo de cliente
│   │   └── useAdmin.ts       # CRUD de productos, gestión de pedidos
│   ├── pages/
│   │   ├── Home.tsx          # Hero + categorías destacadas
│   │   ├── Catalog.tsx       # Catálogo completo con filtros
│   │   ├── Product.tsx       # Detalle de producto
│   │   ├── Cart.tsx          # Carrito y resumen
│   │   ├── Checkout.tsx      # Datos de envío + confirmación
│   │   ├── OrderConfirm.tsx  # Pantalla de pedido recibido
│   │   ├── Account.tsx       # Historial de pedidos del cliente
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── Orders.tsx
│   │       └── Customers.tsx
│   ├── lib/
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── formatters.ts     # formatCOP, formatDate, formatWeight
│   │   └── constants.ts      # Categorías, estados de pedido, roles
│   ├── types/
│   │   └── index.ts          # Todos los tipos del dominio
│   └── App.tsx
├── supabase/
│   └── migrations/           # SQL migrations versionadas
├── public/
└── CLAUDE.md
```

---

## 💾 Schema de Base de Datos

```typescript
// Extendido del user metadata de Supabase Auth
interface UserProfile {
  id: string                    // uuid — mismo que auth.users.id
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
  name: string                  // 'Insumos', 'Semillas', 'Herramientas', etc.
  slug: string
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
  price_wholesale?: number      // Precio mayoreo — visible solo a negocios
  unit: string                  // 'kg', 'bulto', 'litro', 'unidad', 'caja'
  min_wholesale_qty?: number    // Cantidad mínima para precio mayoreo
  stock: number
  images: string[]              // URLs en Supabase Storage
  active: boolean
  featured: boolean
  created_at: Date
  updated_at: Date
}

interface CartItem {
  product_id: string
  quantity: number
  price_applied: number         // Precio en el momento de agregar al carrito
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
```

---

## 🔄 Flujos de Negocio Críticos

### Flujo 1: Cliente explora y hace un pedido (sin cuenta)
1. Entra a agronausa.com — ve catálogo sin login
2. Filtra por categoría o busca producto
3. Agrega al carrito (persiste en localStorage)
4. Va a checkout → ingresa nombre, email, teléfono, dirección
5. Confirma pedido → se crea `order` con `customer_id: null`
6. Recibe pantalla de confirmación con número de pedido
7. David recibe notificación (email o WhatsApp — fase 2)

### Flujo 2: Cliente B2B ve sus precios especiales
1. Entra y hace login con su cuenta
2. Si `customer_type === 'negocio'` y `has_special_pricing === true`:
   - Los `ProductCard` muestran el precio de `special_pricing` en vez de `price_retail`
3. El carrito usa `price_applied` desde `special_pricing`
4. El pedido registra el precio real cobrado (snapshot inmutable)

### Flujo 3: David gestiona un pedido (admin móvil)
1. Entra al panel admin → ve listado de pedidos ordenados por fecha
2. Toca un pedido → ve detalle completo
3. Cambia el estado (pendiente → confirmado → despachado → entregado)
4. Puede agregar nota interna (`admin_notes`)
5. El historial del cliente se actualiza en tiempo real

### Flujo 4: David actualiza stock / agrega producto
1. Admin → Productos → "Nuevo producto" o toca un producto existente
2. Sube fotos desde el celular (Supabase Storage)
3. Ingresa precio detal, y opcionalmente precio mayoreo + cantidad mínima
4. Guarda → visible inmediatamente en el catálogo público

### Flujo 5: Producto sin stock en checkout
1. Cliente tiene producto en carrito
2. Al llegar a checkout, el sistema verifica stock en tiempo real
3. Si stock < cantidad solicitada → muestra alerta antes del pago
4. Cliente puede ajustar cantidad o eliminar el ítem
5. Nunca se genera un pedido con stock negativo

---

## 🎨 Sistema de Diseño

```css
:root {
  /* Paleta Agronausa — tierra, vegetación, confianza */
  --color-primary:     #2D6A1F;  /* Verde campo — CTA principal */
  --color-primary-hover: #245517;
  --color-accent:      #C4853A;  /* Tierra / cosecha — badges, highlights */
  --color-bg:          #F9F6F0;  /* Fondo crema cálido */
  --color-surface:     #FFFFFF;
  --color-border:      #DDD5C8;
  --color-text:        #2C1A0E;  /* Café oscuro */
  --color-text-muted:  #7A6553;
  --color-success:     #3A7D44;
  --color-error:       #C0392B;
  --color-warning:     #E67E22;

  /* Tipografía */
  --font-display:  'Plus Jakarta Sans', sans-serif;  /* Títulos */
  --font-body:     'Inter', sans-serif;              /* Cuerpo */
  --font-mono:     'JetBrains Mono', monospace;      /* Precios, cantidades */

  /* Touch — el admin opera desde celular */
  --touch-min:     48px;   /* Altura mínima de cualquier elemento interactivo */
  --touch-min-sm:  44px;   /* En componentes compactos */
}
```

**Reglas de touch obligatorias:**
- Todo botón de acción: mínimo 48px de alto
- Botones de cantidad (+/-): 48×48px cuadrado
- Separación entre elementos táctiles: mínimo 8px
- Fuente mínima en móvil: 14px

---

## 📦 Seed Data

Al inicializar el proyecto cargar automáticamente si la DB está vacía:

**Categorías (8):**
Insumos agrícolas, Semillas y material vegetal, Herramientas, Fertilizantes, Plaguicidas, Equipos de riego, Alimentos para animales, Otros

**Productos de muestra (10):**
Mínimo 2 productos por categoría principal, con foto placeholder, precio real estimado en COP, stock inicial de 50.

**Usuario admin (1):**
Email configurado en `.env` como `ADMIN_EMAIL`. Role asignado via Supabase metadata `{ role: 'admin' }`.

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

```
HOME
┌─────────────────────────────────┐
│ [Logo Agronausa]    🛒 Carrito  │
├─────────────────────────────────┤
│   Hero: foto campo + tagline    │
│   [Ver catálogo completo]       │
├─────────────────────────────────┤
│ Categorías destacadas (scroll)  │
│ [🌱 Semillas] [🔧 Herramientas] │
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

```typescript
// tsconfig.json — strict mode obligatorio
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 🚀 Orden de Construcción para Claude Code

### Fase 1: Setup y base (Día 1)
- [ ] Crear proyecto Vite + React + TypeScript + Tailwind
- [ ] Configurar Supabase: tablas, RLS básico, Storage bucket para imágenes
- [ ] Variables de entorno y cliente Supabase
- [ ] Sistema de diseño: variables CSS, fuentes, componentes UI base (Button, Badge, Input)
- [ ] Routing básico (React Router): Home, Catalog, Product, Cart, Checkout, Admin
- [ ] **Criterio de éxito:** La app carga, el router funciona, Supabase conecta sin errores

### Fase 2: Catálogo público (Día 2)
- [ ] `useProducts` hook con fetch, filtro por categoría y búsqueda
- [ ] `ProductCard` con imagen, nombre, precio, unidad, botón agregar al carrito
- [ ] `ProductGrid` con filtro de categorías
- [ ] Página `Catalog.tsx` completa
- [ ] Página `Product.tsx` con detalle y galería de imágenes
- [ ] **Criterio de éxito:** Se pueden ver todos los productos, filtrar y buscar sin login

### Fase 3: Carrito y pedido (Día 3)
- [ ] `useCart` hook con localStorage (agregar, quitar, cambiar cantidad)
- [ ] `CartDrawer` lateral (slide-over en móvil)
- [ ] Validación de stock en checkout (consulta en tiempo real)
- [ ] Formulario de checkout con validación
- [ ] Creación de orden en Supabase + pantalla de confirmación con número AGN-XXXX
- [ ] **Criterio de éxito:** Un visitante sin cuenta puede hacer un pedido completo de punta a punta

### Fase 4: Auth y precios B2B (Día 4)
- [ ] Registro y login (email + password, Supabase Auth)
- [ ] Formulario de registro con campo `customer_type` (persona / negocio)
- [ ] `useAuth` hook con perfil y tipo de cliente
- [ ] Lógica de precios: si el usuario es negocio con `special_pricing`, mostrar precio especial
- [ ] Página `Account.tsx`: historial de pedidos del cliente
- [ ] **Criterio de éxito:** Un usuario B2B ve su precio especial en el catálogo, un B2C ve el precio base

### Fase 5: Panel Admin (Día 5-6)
- [ ] Guard de ruta admin (solo si `role === 'admin'`)
- [ ] Dashboard con métricas básicas: pedidos hoy, ingresos del mes, productos con bajo stock
- [ ] `Orders.tsx`: listado con filtros por estado, detalle de pedido, cambio de estado
- [ ] `Products.tsx`: listado, formulario crear/editar, subida de imágenes a Supabase Storage
- [ ] `Customers.tsx`: listado de clientes registrados, asignar `has_special_pricing`
- [ ] Formulario de `SpecialPricing`: asignar precio especial por producto a un cliente B2B
- [ ] **Criterio de éxito:** David puede gestionar pedidos, subir productos y asignar precios desde su celular

### Fase 6: Pulido y deploy (Día 7)
- [ ] SEO básico: meta tags, Open Graph, favicon con logo Agronausa
- [ ] Botón flotante "Consultar por WhatsApp" (usa `VITE_WHATSAPP_NUMBER`)
- [ ] Estados vacíos, loading skeletons, manejo de errores en UI
- [ ] Responsive final pass: revisar todo en 375px
- [ ] Deploy en Vercel con dominio agronausa.com
- [ ] **Criterio de éxito:** El sitio está publicado, David puede acceder al admin, el primer pedido de prueba funciona

---

## 🚨 Reglas de Código

**SIEMPRE:**
- TypeScript strict, nunca `any`
- Todo acceso a Supabase a través de hooks (`useProducts`, `useOrders`, etc.) — nunca llamadas directas desde componentes
- Formatear precios con `formatCOP(price)` — nunca template literals crudos
- Validar stock antes de crear un pedido
- RLS activado en todas las tablas desde el día 1
- Los snapshots de pedido (nombre, precio) son inmutables después de creado — nunca join vivo con productos

**NUNCA:**
- No hardcodear precios ni categorías — todo viene de la DB
- No mostrar el precio B2B a un usuario no autenticado o B2C
- No permitir stock negativo
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- No usar `useEffect` para lógica de negocio — usar hooks dedicados

---

## 📋 Comandos de Desarrollo

```bash
npm run dev          # Servidor local
npm run build        # Build de producción
npm run preview      # Preview del build
npx supabase start   # DB local (opcional)
npx supabase db push # Aplicar migrations a producción
```

---

## 🔮 Roadmap Futuro (no construir ahora)

- **Pagos online con Wompi** — integrar en checkout como segunda opción de pago
- **Notificaciones WhatsApp** — avisar a David cuando llega un pedido vía API de WhatsApp Business
- **Pedidos recurrentes** — el cliente B2B puede repetir un pedido anterior con un clic
- **Catálogo con variantes** — mismo producto en distintas presentaciones (1kg, 5kg, bulto)
- **App móvil nativa** — si el volumen de pedidos lo justifica, migrar admin a React Native
- **Analítica de ventas** — reportes de productos más vendidos, clientes frecuentes, estacionalidad
