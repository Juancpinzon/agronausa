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
