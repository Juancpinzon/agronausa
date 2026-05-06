# FASE7.md — Admin Panel v2 — Agronausa

> Este archivo extiende CLAUDE.md. Lee CLAUDE.md completo antes de ejecutar cualquier tarea de esta fase.
> Las reglas de código, el stack, el sistema de diseño y los principios irrompibles del CLAUDE.md siguen vigentes sin excepción.

---

## Contexto de esta fase

El MVP (Fases 1–6) está completo y en producción. Esta fase expande el panel administrativo con módulos operacionales que David necesita para gestionar el negocio sin depender de hojas de cálculo ni WhatsApp. La referencia visual es BSM (Bogotá Seafood Market), un panel admin del mismo stack con módulos similares.

**Lo que NO cambia:** rutas existentes, hooks existentes, schema de tablas ya creadas, RLS ya configurado.
**Lo que SÍ se agrega:** nuevas tablas, nuevos hooks, nuevas páginas admin, navegación lateral expandida.

---

## Módulos a construir (7)

| # | Módulo | Ruta admin | Prioridad |
|---|---|---|---|
| 1 | Alertas Críticas | `/admin/alerts` | Alta |
| 2 | Análisis Financiero | `/admin/analytics` | Alta |
| 3 | Control de Inventario | `/admin/inventory` | Alta |
| 4 | Gestión de Categorías | `/admin/categories` | Media |
| 5 | Gestión de Proveedores | `/admin/suppliers` | Media |
| 6 | Configuración Maestra | `/admin/settings` | Alta |
| 7 | Usuarios y Roles | `/admin/users` | Media |

---

## Nuevas tablas — Supabase migrations

Crear como migration versionada en `supabase/migrations/`. RLS activado desde el día 1 en todas.

```sql
-- 1. Historial de movimientos de inventario
CREATE TABLE inventory_movements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('entrada', 'salida', 'ajuste', 'pedido')),
  quantity    integer NOT NULL,          -- positivo = entrada, negativo = salida/ajuste
  stock_before integer NOT NULL,
  stock_after  integer NOT NULL,
  reason      text,                      -- descripción del ajuste manual
  order_id    uuid REFERENCES orders(id), -- FK si el movimiento viene de un pedido
  created_by  uuid REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now()
);

-- RLS: solo admin puede leer y escribir
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON inventory_movements
  USING (auth.jwt() ->> 'role' = 'admin');

-- 2. Proveedores
CREATE TABLE suppliers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  contact_name text,
  phone        text,
  email        text,
  category_ids uuid[],                  -- categorías que provee
  notes        text,
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON suppliers
  USING (auth.jwt() ->> 'role' = 'admin');

-- 3. Configuración maestra (clave-valor)
CREATE TABLE app_settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
-- Admin puede leer y escribir; público puede leer claves no sensibles
CREATE POLICY "admin_write" ON app_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "public_read" ON app_settings
  FOR SELECT USING (key NOT IN ('admin_email', 'service_notes'));

-- Seed de configuración inicial
INSERT INTO app_settings (key, value) VALUES
  ('site_name', 'Agronausa'),
  ('whatsapp_number', '573204953114'),
  ('low_stock_threshold', '10'),
  ('alert_pending_hours', '24'),
  ('admin_email', 'david@agronausa.com'),
  ('store_department', 'Cundinamarca'),
  ('store_city', 'Bogotá'),
  ('store_address', ''),
  ('terms_version', '1.0');
```

---

## Estructura de archivos nuevos

```
src/
├── hooks/
│   ├── useAlerts.ts          # Alertas activas (stock bajo, pedidos sin atender)
│   ├── useAnalytics.ts       # Métricas financieras por período
│   ├── useInventory.ts       # Movimientos de stock, ajuste manual
│   ├── useSuppliers.ts       # CRUD proveedores
│   ├── useCategories.ts      # CRUD categorías (admin)
│   ├── useSettings.ts        # Leer y escribir app_settings
│   └── useAdminUsers.ts      # Listar admins, cambiar roles
├── components/
│   └── admin/
│       ├── AlertBadge.tsx         # Badge contador de alertas en el nav
│       ├── AlertCard.tsx          # Card individual de alerta
│       ├── FinancialKPI.tsx       # Card de KPI financiero
│       ├── RevenueChart.tsx       # Gráfico de ingresos (recharts)
│       ├── TopProductsTable.tsx   # Tabla productos más vendidos
│       ├── InventoryRow.tsx       # Fila de inventario con ajuste inline
│       ├── MovementHistory.tsx    # Lista de movimientos de un producto
│       ├── StockAdjustModal.tsx   # Modal para ajuste manual de stock
│       ├── SupplierForm.tsx       # Formulario crear/editar proveedor
│       ├── CategoryForm.tsx       # Formulario crear/editar categoría
│       ├── SettingsForm.tsx       # Formulario de configuración maestra
│       └── AdminUserRow.tsx       # Fila de usuario con toggle de rol
└── pages/
    └── admin/
        ├── Alerts.tsx            # Módulo 1
        ├── Analytics.tsx         # Módulo 2
        ├── Inventory.tsx         # Módulo 3
        ├── Categories.tsx        # Módulo 4
        ├── Suppliers.tsx         # Módulo 5
        ├── Settings.tsx          # Módulo 6
        └── AdminUsers.tsx        # Módulo 7
```

---

## Módulo 1 — Alertas Críticas (`/admin/alerts`)

### Hook `useAlerts.ts`

```typescript
interface Alert {
  id: string
  type: 'stock_bajo' | 'pedido_sin_atender' | 'sin_imagen'
  severity: 'critica' | 'advertencia'
  title: string
  description: string
  action_url: string   // ruta a la que lleva al tocar
  created_at: Date
  product_id?: string
  order_id?: string
}

// Lógica:
// stock_bajo: productos con stock < low_stock_threshold (de app_settings)
// pedido_sin_atender: pedidos en estado 'pendiente' con created_at > alert_pending_hours
// sin_imagen: productos activos con images = [] o images.length === 0
```

### UI

```
ALERTAS CRÍTICAS
┌─────────────────────────────────┐
│ 🔴 2 críticas  ⚠️ 3 advertencias│
├─────────────────────────────────┤
│ 🔴 Stock agotado                │
│ Herbicida Ranger 1L — 0 und.    │
│ [Ajustar stock →]               │
├─────────────────────────────────┤
│ 🔴 Pedido sin atender (31h)     │
│ AGN-2026-0044 · $320.000        │
│ [Ver pedido →]                  │
├─────────────────────────────────┤
│ ⚠️ Producto sin foto            │
│ Abono 10-30-10 · Fertilizantes  │
│ [Editar producto →]             │
└─────────────────────────────────┘
```

- El ícono de campana en el nav lateral muestra badge rojo con el conteo de alertas críticas.
- `AlertBadge` se actualiza al montar el layout admin (una sola consulta, sin polling).
- Tocar cualquier alerta navega a la ruta correspondiente.

---

## Módulo 2 — Análisis Financiero (`/admin/analytics`)

### Hook `useAnalytics.ts`

```typescript
interface AnalyticsPeriod {
  start: Date
  end: Date
}

interface FinancialSummary {
  revenue_total: number          // suma de orders.total en el período
  orders_count: number
  avg_ticket: number             // revenue_total / orders_count
  orders_by_status: Record<OrderStatus, number>
  top_products: Array<{
    product_name: string
    units_sold: number
    revenue: number
  }>
  revenue_by_day: Array<{
    date: string                 // 'YYYY-MM-DD'
    revenue: number
    orders: number
  }>
  new_customers: number          // profiles creados en el período
}

// Solo contar órdenes con status !== 'cancelado'
// Queries directas a orders e items (no joins con products — usar snapshot)
```

### UI

```
ANÁLISIS FINANCIERO
┌──────────────────────────────────┐
│ [Esta semana][Este mes][Custom]  │
├──────────────────────────────────┤
│ $1.240.000   18 pedidos  $68.888 │
│  Ingresos     Pedidos   Ticket   │
├──────────────────────────────────┤
│ Ingresos por día (gráfico barras)│
│  ▄ ▄ █ ▄ ▅ █ ▄                  │
├──────────────────────────────────┤
│ Productos más vendidos           │
│ 1. Herbicida Ranger  42 und      │
│ 2. Semilla Maíz ICA  38 und      │
│ 3. Cal Dolomita 50kg 31 und      │
└──────────────────────────────────┘
```

- Gráfico con `recharts` (ya disponible en el stack). BarChart de ingresos por día.
- Filtros: "Esta semana", "Este mes", selector de rango personalizado (dos date inputs).
- En móvil: KPIs en stack vertical, gráfico con scroll horizontal.

---

## Módulo 3 — Control de Inventario (`/admin/inventory`)

### Hook `useInventory.ts`

```typescript
// adjustStock: crea inventory_movement y actualiza products.stock
// en una transacción de Supabase (rpc o dos queries secuenciales con validación)
async function adjustStock(
  product_id: string,
  new_quantity: number,
  reason: string
): Promise<void>

// getMovements: historial de movimientos de un producto
async function getMovements(product_id: string): Promise<InventoryMovement[]>
```

**Regla crítica:** `adjustStock` nunca puede dejar `stock < 0`. Validar antes de escribir. Si el resultado sería negativo, rechazar con error claro.

### UI

```
CONTROL DE INVENTARIO
┌──────────────────────────────────┐
│ Buscar producto...   [🔍]        │
│ Filtro: [Todos][Stock bajo][Sin] │
├──────────────────────────────────┤
│ Herbicida Ranger 1L              │
│ Stock: 0 und  🔴 [Ajustar]      │
├──────────────────────────────────┤
│ Semilla Maíz ICA 500g            │
│ Stock: 8 und  ⚠️ [Ajustar]      │
├──────────────────────────────────┤
│ Cal Dolomita 50kg                │
│ Stock: 47 und ✅ [Ajustar]      │
└──────────────────────────────────┘

MODAL — Ajustar stock
┌──────────────────────────────────┐
│ Herbicida Ranger 1L              │
│ Stock actual: 0 unidades         │
│                                  │
│ Nuevo stock: [___]               │
│ Motivo: [entrada / ajuste ▾]    │
│ Nota: [opcional...]              │
│                                  │
│ [Cancelar]      [Guardar]        │
└──────────────────────────────────┘
```

- Al tocar [Ajustar] abre `StockAdjustModal` con el producto precargado.
- Debajo de cada producto hay un botón [Ver historial] que expande `MovementHistory` inline.
- Historial muestra: fecha, tipo, cantidad (+/-), motivo, quién lo hizo.

---

## Módulo 4 — Gestión de Categorías (`/admin/categories`)

### Hook `useCategories.ts` (versión admin)

```typescript
// Extiende el hook existente useProducts con capacidad de escritura
// CRUD completo: create, update, toggle active, reorder
async function reorderCategories(ids: string[]): Promise<void>
// ids en el nuevo orden → actualiza sort_order en batch
```

### UI

```
GESTIÓN DE CATEGORÍAS
┌──────────────────────────────────┐
│                [+ Nueva categoría│
├──────────────────────────────────┤
│ ≡ 🌱 Semillas y material vegetal │
│     12 productos  ✅  [✏️][🗑️] │
├──────────────────────────────────┤
│ ≡ 🔧 Herramientas                │
│     8 productos   ✅  [✏️][🗑️] │
├──────────────────────────────────┤
│ ≡ 💊 Plaguicidas                 │
│     0 productos   ⬜  [✏️][🗑️] │
└──────────────────────────────────┘
```

- Drag-and-drop para reordenar (usar `@dnd-kit/core` si ya está en el proyecto, si no, usar botones ↑↓ en móvil).
- No se puede eliminar una categoría que tenga productos activos — mostrar error claro.
- `CategoryForm`: nombre, slug (auto-generado desde nombre), imagen opcional (Supabase Storage), toggle activo.

---

## Módulo 5 — Gestión de Proveedores (`/admin/suppliers`)

### Hook `useSuppliers.ts`

```typescript
interface Supplier {
  id: string
  name: string
  contact_name?: string
  phone?: string
  email?: string
  category_ids: string[]        // categorías que provee
  notes?: string
  active: boolean
  created_at: Date
  updated_at: Date
}
```

### UI

```
GESTIÓN DE PROVEEDORES
┌──────────────────────────────────┐
│                  [+ Proveedor]   │
├──────────────────────────────────┤
│ AgroInsumos del Valle            │
│ 📞 3201234567 · Insumos, Fert.  │
│ ✅ activo           [✏️]        │
├──────────────────────────────────┤
│ SemillasCol S.A.S                │
│ 📞 3009876543 · Semillas         │
│ ✅ activo           [✏️]        │
└──────────────────────────────────┘
```

- `SupplierForm`: nombre (requerido), contacto, teléfono, email, categorías (multiselect de las categorías existentes), notas, toggle activo.
- No hay integración de órdenes de compra en esta fase — es solo directorio de proveedores.

---

## Módulo 6 — Configuración Maestra (`/admin/settings`)

### Hook `useSettings.ts`

```typescript
// Lee todos los registros de app_settings al montar
// Escribe clave por clave con upsert
async function getSetting(key: string): Promise<string>
async function updateSetting(key: string, value: string): Promise<void>
async function updateSettings(updates: Record<string, string>): Promise<void>
```

### UI por secciones

```
CONFIGURACIÓN MAESTRA

── Tienda ──────────────────────────
Nombre de la tienda   [Agronausa      ]
WhatsApp              [573204953114   ]
Departamento          [Cundinamarca   ]
Ciudad                [Bogotá         ]
Dirección             [               ]

── Alertas ─────────────────────────
Umbral stock bajo     [10] unidades
Pedido sin atender    [24] horas

── Legal ───────────────────────────
Versión TyC           [1.0            ]
Email administrador   [david@agro...  ]

                           [Guardar cambios]
```

- Un solo formulario con todas las secciones. Un botón "Guardar cambios" al final.
- Los valores se cargan desde `app_settings` al montar — no hardcodeados.
- `low_stock_threshold` y `alert_pending_hours` son los valores que usa `useAlerts`.

---

## Módulo 7 — Usuarios y Roles (`/admin/users`)

### Hook `useAdminUsers.ts`

```typescript
// Lista todos los profiles con su rol (de user_metadata)
// Puede promover a admin o quitar rol admin
// Usa supabase.auth.admin — SOLO llamable desde funciones de servidor
// En frontend: llamar a una Supabase Edge Function que use service_role
async function listUsers(): Promise<UserProfile[]>
async function setAdminRole(user_id: string, is_admin: boolean): Promise<void>
```

**Seguridad:** `setAdminRole` llama a una Edge Function `set-admin-role` que usa `SUPABASE_SERVICE_ROLE_KEY` — nunca exponer la key en el frontend.

### Edge Function `set-admin-role`

```typescript
// supabase/functions/set-admin-role/index.ts
// Verifica que el llamador sea admin antes de modificar otro usuario
// Actualiza user_metadata: { role: 'admin' } o elimina el campo
```

### UI

```
USUARIOS Y ROLES
┌──────────────────────────────────┐
│ david@agronausa.com              │
│ Admin principal  🔑 Admin        │
├──────────────────────────────────┤
│ maria@agronausa.com              │
│ María González   👤 Empleada     │
│ [Dar acceso admin]               │
├──────────────────────────────────┤
│ carlos@distcampo.com             │
│ Distribuciones El Campo  B2B     │
│ (cliente — sin acceso admin)     │
└──────────────────────────────────┘
```

- El admin principal (`ADMIN_EMAIL` del `.env`) no puede perder su rol desde esta pantalla.
- Separar visualmente: admins, empleados con acceso, clientes B2B.

---

## Navegación lateral — Actualización

Reemplazar el sidebar actual con esta estructura. Mantener el mismo componente de layout, solo actualizar las rutas y secciones.

```
Admin Panel
[Ir a la Tienda]

── CONTROL DE MANDO ────────────
  📊 Tablero (KPIs)            /admin
  🔔 Alertas Críticas    [N]   /admin/alerts

── VENTAS Y OPERACIONES ────────
  🛒 Gestión de Pedidos        /admin/orders
  👥 Cartera de Clientes       /admin/customers
  📈 Análisis Financiero       /admin/analytics

── CATÁLOGO ────────────────────
  📦 Productos                 /admin/products
  📂 Categorías                /admin/categories
  🏷️  Inventario               /admin/inventory

── PROVEEDORES ─────────────────
  🚛 Gestión de Proveedores    /admin/suppliers

── SISTEMA ─────────────────────
  👤 Usuarios y Roles          /admin/users
  ⚙️  Configuración Maestra    /admin/settings
```

`[N]` = badge rojo con número de alertas críticas activas. Se carga con `useAlerts` en el layout.

---

## Nuevos tipos — `src/types/index.ts`

Agregar al archivo existente sin reemplazar nada:

```typescript
// Módulo Inventario
interface InventoryMovement {
  id: string
  product_id: string
  type: 'entrada' | 'salida' | 'ajuste' | 'pedido'
  quantity: number
  stock_before: number
  stock_after: number
  reason?: string
  order_id?: string
  created_by?: string
  created_at: Date
}

// Módulo Proveedores
interface Supplier {
  id: string
  name: string
  contact_name?: string
  phone?: string
  email?: string
  category_ids: string[]
  notes?: string
  active: boolean
  created_at: Date
  updated_at: Date
}

// Módulo Configuración
type AppSettingKey =
  | 'site_name'
  | 'whatsapp_number'
  | 'low_stock_threshold'
  | 'alert_pending_hours'
  | 'admin_email'
  | 'store_department'
  | 'store_city'
  | 'store_address'
  | 'terms_version'

type AppSettings = Record<AppSettingKey, string>

// Módulo Alertas
interface Alert {
  id: string
  type: 'stock_bajo' | 'pedido_sin_atender' | 'sin_imagen'
  severity: 'critica' | 'advertencia'
  title: string
  description: string
  action_url: string
  product_id?: string
  order_id?: string
}

// Módulo Analytics
interface FinancialSummary {
  revenue_total: number
  orders_count: number
  avg_ticket: number
  orders_by_status: Record<OrderStatus, number>
  top_products: Array<{
    product_name: string
    units_sold: number
    revenue: number
  }>
  revenue_by_day: Array<{
    date: string
    revenue: number
    orders: number
  }>
  new_customers: number
}
```

---

## Criterios de éxito por módulo

| Módulo | Criterio |
|---|---|
| Alertas | David ve en 1 pantalla qué productos tienen stock bajo y qué pedidos llevan +24h sin atender |
| Analytics | David puede ver cuánto vendió esta semana y cuáles son sus 3 productos más vendidos |
| Inventario | David puede ajustar el stock de un producto en 3 toques desde el celular |
| Categorías | David puede crear una categoría nueva y reordenarlas sin tocar código |
| Proveedores | David puede registrar el teléfono de su proveedor de insumos y encontrarlo rápido |
| Config | David puede cambiar el número de WhatsApp de la tienda sin tocar el código ni el .env |
| Usuarios | David puede darle acceso admin a un empleado sin necesidad de ir a Supabase |

---

## Reglas adicionales para esta fase

- **Recharts ya está en el proyecto** (usado en Dashboard). Reutilizar para Analytics — no agregar nueva librería de gráficos.
- **Todos los modales deben funcionar con swipe-to-close en móvil** o con botón X grande (48px mínimo).
- **Las Edge Functions van en `supabase/functions/`** con su propio `index.ts`. No llamar a service_role desde el cliente.
- **`useSettings` debe cachear los valores** en memoria durante la sesión — no hacer una query por cada componente que necesite un setting.
- **El sidebar actualizado no reemplaza** el componente existente de layout — lo extiende con las nuevas rutas.

---

## Orden de ejecución sugerido para los agentes

1. **Primero:** Migrations SQL (nuevas tablas) → sin esto nada funciona
2. **Segundo:** Nuevos tipos en `index.ts`
3. **Tercero:** Hooks (`useAlerts`, `useInventory`, `useSettings`, `useSuppliers`, `useCategories`, `useAdminUsers`)
4. **Cuarto:** Edge Function `set-admin-role`
5. **Quinto:** Componentes (empezar por los más simples: `AlertCard`, `InventoryRow`, `SettingsForm`)
6. **Sexto:** Páginas (ensamblan los componentes)
7. **Séptimo:** Actualización del sidebar de navegación
8. **Octavo:** Prueba de criterios de éxito módulo por módulo
