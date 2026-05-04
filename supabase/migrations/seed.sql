-- =============================================================
-- Agronausa — Seed Data
-- Categorías (8) y Productos de muestra (10)
-- =============================================================

-- ---------------------------------------------------------------
-- CATEGORÍAS
-- ---------------------------------------------------------------

INSERT INTO categories (id, name, slug, image_url, sort_order, active)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Insumos agrícolas',          'insumos-agricolas',         NULL, 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'Semillas y material vegetal', 'semillas-material-vegetal', NULL, 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'Herramientas',                'herramientas',              NULL, 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'Fertilizantes',               'fertilizantes',             NULL, 4, true),
  ('a1000000-0000-0000-0000-000000000005', 'Plaguicidas',                 'plaguicidas',               NULL, 5, true),
  ('a1000000-0000-0000-0000-000000000006', 'Equipos de riego',            'equipos-de-riego',          NULL, 6, true),
  ('a1000000-0000-0000-0000-000000000007', 'Alimentos para animales',     'alimentos-para-animales',   NULL, 7, true),
  ('a1000000-0000-0000-0000-000000000008', 'Otros',                       'otros',                     NULL, 8, true);


-- ---------------------------------------------------------------
-- PRODUCTOS (mínimo 2 por categoría principal, 10 en total)
-- ---------------------------------------------------------------

INSERT INTO products (
  id,
  name,
  slug,
  description,
  category_id,
  price_retail,
  price_wholesale,
  unit,
  min_wholesale_qty,
  stock,
  images,
  active,
  featured,
  created_at,
  updated_at
)
VALUES

  -- Insumos agrícolas (2)
  (
    'b2000000-0000-0000-0000-000000000001',
    'Cal agrícola dolomítica',
    'cal-agricola-dolomitica',
    'Corrector de acidez del suelo. Mejora la disponibilidad de nutrientes y la estructura del terreno. Presentación bulto x 50 kg.',
    'a1000000-0000-0000-0000-000000000001',
    15000,
    11000,
    'bulto',
    10,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),
  (
    'b2000000-0000-0000-0000-000000000002',
    'Sulfato de calcio (Yeso agrícola)',
    'sulfato-de-calcio-yeso-agricola',
    'Acondiciona el suelo arcilloso y aporta calcio y azufre disponibles para el cultivo. Presentación bulto x 50 kg.',
    'a1000000-0000-0000-0000-000000000001',
    18000,
    13500,
    'bulto',
    10,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),

  -- Semillas y material vegetal (2)
  (
    'b2000000-0000-0000-0000-000000000003',
    'Semilla de maíz híbrido ICA V-156',
    'semilla-maiz-hibrido-ica-v156',
    'Variedad de alto rendimiento certificada por el ICA. Adaptada a clima cálido y medio. Presentación: 1 kg.',
    'a1000000-0000-0000-0000-000000000002',
    28000,
    21000,
    'kg',
    5,
    50,
    ARRAY[]::text[],
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    'b2000000-0000-0000-0000-000000000004',
    'Semilla de fríjol cargamanto',
    'semilla-frijol-cargamanto',
    'Semilla seleccionada de fríjol cargamanto rojo. Alto porcentaje de germinación. Presentación: 1 kg.',
    'a1000000-0000-0000-0000-000000000002',
    12000,
    9000,
    'kg',
    5,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),

  -- Herramientas (1)
  (
    'b2000000-0000-0000-0000-000000000005',
    'Azadón profesional mango largo',
    'azadon-profesional-mango-largo',
    'Azadón de acero forjado con mango de madera de 130 cm. Ideal para labranza y deshierbe. Uso intensivo.',
    'a1000000-0000-0000-0000-000000000003',
    38000,
    30000,
    'unidad',
    5,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),

  -- Fertilizantes (2)
  (
    'b2000000-0000-0000-0000-000000000006',
    'Urea 46% N granulada',
    'urea-46-n-granulada',
    'Fertilizante nitrogenado de alta concentración. Ideal para gramíneas y cultivos de hoja. Presentación bulto x 50 kg.',
    'a1000000-0000-0000-0000-000000000004',
    95000,
    75000,
    'bulto',
    5,
    50,
    ARRAY[]::text[],
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    'b2000000-0000-0000-0000-000000000007',
    'Abono compuesto 10-30-10',
    'abono-compuesto-10-30-10',
    'Fertilizante complejo NPK ideal para la etapa de floración y fructificación. Presentación bulto x 50 kg.',
    'a1000000-0000-0000-0000-000000000004',
    88000,
    68000,
    'bulto',
    5,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),

  -- Plaguicidas (1)
  (
    'b2000000-0000-0000-0000-000000000008',
    'Herbicida glifosato 480 SL',
    'herbicida-glifosato-480-sl',
    'Herbicida sistémico de amplio espectro para control de malezas en cultivos y potreros. Presentación: 1 litro.',
    'a1000000-0000-0000-0000-000000000005',
    22000,
    16500,
    'litro',
    10,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  ),

  -- Alimentos para animales (2)
  (
    'b2000000-0000-0000-0000-000000000009',
    'Concentrado bovino engorde',
    'concentrado-bovino-engorde',
    'Alimento balanceado para engorde de bovinos. Fórmula con proteína 16%, energía y minerales. Bulto x 40 kg.',
    'a1000000-0000-0000-0000-000000000007',
    75000,
    60000,
    'bulto',
    5,
    50,
    ARRAY[]::text[],
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    'b2000000-0000-0000-0000-000000000010',
    'Sal mineralizada para bovinos',
    'sal-mineralizada-para-bovinos',
    'Sal con mezcla de macro y microminerales esenciales para el mantenimiento y la producción bovina. Bulto x 40 kg.',
    'a1000000-0000-0000-0000-000000000007',
    38000,
    29000,
    'bulto',
    5,
    50,
    ARRAY[]::text[],
    true,
    false,
    NOW(),
    NOW()
  );
