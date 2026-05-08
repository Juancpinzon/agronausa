-- 1. Historial de movimientos de inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('entrada', 'salida', 'ajuste', 'pedido')),
  quantity     integer NOT NULL,
  stock_before integer NOT NULL,
  stock_after  integer NOT NULL,
  reason       text,
  order_id     uuid REFERENCES orders(id),
  created_by   uuid REFERENCES auth.users(id),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all" ON inventory_movements;
CREATE POLICY "admin_all" ON inventory_movements
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- 2. Proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  contact_name text,
  phone        text,
  email        text,
  category_ids uuid[],
  notes        text,
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all" ON suppliers;
CREATE POLICY "admin_all" ON suppliers
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- 3. Configuración maestra (clave-valor)
CREATE TABLE IF NOT EXISTS app_settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_write" ON app_settings;
CREATE POLICY "admin_write" ON app_settings
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
DROP POLICY IF EXISTS "public_read" ON app_settings;
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
  ('terms_version', '1.0')
ON CONFLICT (key) DO NOTHING;
