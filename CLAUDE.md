# CLAUDE.md — TradeOS Personal
## Plataforma web de inversiones y trading NYSE + Cripto

> **Agente**: Lee este archivo completo antes de escribir cualquier línea de código. Es tu contrato de comportamiento para todo el proyecto.

---

## 🧠 Contexto del Negocio

TradeOS Personal es una plataforma de inversiones y trading unificada para un usuario individual (uso personal). Centraliza NYSE (via Alpaca) y cripto (via Binance) en una sola interfaz, con análisis asistido por Claude API.

**El problema que resuelve**: las plataformas de brokers son fragmentadas, sin análisis inteligente integrado, y sin visión unificada de portafolio multi-activo.

**Usuario**: trader/inversor individual con cuenta Alpaca paper/live y cuenta Binance.

**Flujo que NUNCA puede bloquearse**: ver el estado actual del portafolio.

---

## 🎯 Principios de Diseño Irrompibles

1. **Las API keys nunca tocan el frontend.** Todas las llamadas a Alpaca y Binance se hacen desde Supabase Edge Functions. El cliente solo llama a Supabase.

2. **Paper trading por defecto en Fase 1.** Ninguna orden real se ejecuta hasta que el módulo live trading esté explícitamente activado y probado.

3. **El dashboard carga en < 2s.** Los datos de mercado se cachean en Supabase; nunca se llama directo a brokers desde el render del dashboard.

4. **El Research Agent siempre muestra su fuente.** Todo análisis de Claude API incluye los datos exactos que usó (precio, volumen, ATH, RSI, etc.) para que el usuario pueda verificar. El análisis además es consciente del portafolio actual del usuario.

5. **Toda orden requiere confirmación explícita.** Ningún botón ejecuta una operación en un solo clic. Siempre hay un modal de confirmación con los detalles completos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | React 18 + TypeScript | SPA, tipado estricto |
| Estilos | Tailwind CSS + shadcn/ui | Componentes financieros rápidos |
| Backend/DB | Supabase (Postgres + Auth + Edge Functions) | Auth, storage seguro de keys, DB |
| Broker NYSE | Alpaca Markets API | Paper + live trading NYSE/NASDAQ |
| Broker Cripto | Binance API | Spot trading cripto |
| Análisis IA | Claude API (claude-sonnet-4-20250514) | Research Agent + Screener IA |
| Charts | Recharts + TradingView Widget (embed) | Equity chart + charts OHLCV por símbolo |
| Estado | Zustand | Estado global liviano |
| Fetching | TanStack Query (React Query) | Cache, refetch, loading states |
| Build | Vite | Dev rápido |
| Deploy | Vercel (preferido) o EasyPanel | CI/CD automático |

---

## 📁 Estructura del Proyecto

```
tradeos-personal/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── portfolio/
│   │   │   ├── PortfolioSummary.tsx
│   │   │   ├── PositionCard.tsx
│   │   │   ├── EquityChart.tsx
│   │   │   └── PnLWidget.tsx
│   │   ├── trading/
│   │   │   ├── OrderForm.tsx
│   │   │   ├── OrderBook.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   └── ConfirmOrderModal.tsx
│   │   ├── research/
│   │   │   ├── ResearchPanel.tsx          # Input + historial
│   │   │   ├── AnalysisCard.tsx           # Resultado con KPIs + TradingView widget
│   │   │   ├── KpiGrid.tsx                # ATH dist, RSI, EPS guidance, etc.
│   │   │   ├── TradingViewWidget.tsx      # Embed iframe del chart TradingView
│   │   │   ├── PortfolioContext.tsx       # Muestra exposición actual al símbolo analizado
│   │   │   └── WatchlistItem.tsx
│   │   ├── screener/
│   │   │   ├── ScreenerPanel.tsx          # Filtros configurables
│   │   │   ├── ScreenerResultsTable.tsx   # Tabla interactiva con sort/filter
│   │   │   ├── ScreenerCriteriaForm.tsx   # Formulario de criterios
│   │   │   └── ScreenerSaveModal.tsx      # Guardar screener como preset
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── AppShell.tsx
│   ├── hooks/
│   │   ├── usePortfolio.ts
│   │   ├── useOrders.ts
│   │   ├── useMarketData.ts
│   │   ├── useResearch.ts                 # Llamadas al Research Agent (con contexto de portafolio)
│   │   ├── useScreener.ts                 # Ejecutar y guardar screeners
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── portfolioStore.ts
│   │   ├── tradingStore.ts
│   │   ├── screenerStore.ts               # Criterios activos y resultados del screener
│   │   └── uiStore.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Trading.tsx
│   │   ├── Research.tsx
│   │   ├── Screener.tsx                   # Nueva pantalla — Fase 5
│   │   ├── History.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── supabase/
│   ├── functions/
│   │   ├── alpaca-proxy/
│   │   │   └── index.ts
│   │   ├── binance-proxy/
│   │   │   └── index.ts
│   │   ├── claude-research/               # Research Agent potenciado
│   │   │   └── index.ts
│   │   └── claude-screener/               # Screener con Claude API + web search
│   │       └── index.ts
│   └── migrations/
│       ├── 001_auth_setup.sql
│       ├── 002_portfolio_tables.sql
│       ├── 003_orders_tables.sql
│       ├── 004_watchlist.sql
│       └── 005_screener.sql
├── .env.local
├── .env.example
├── CLAUDE.md
└── package.json
```

---

## 💾 Schema de Base de Datos

```typescript
// --- USUARIOS Y CONFIGURACIÓN ---

interface UserSettings {
  id: string                        // uuid, FK → auth.users
  alpaca_mode: 'paper' | 'live'    // SIEMPRE 'paper' en Fase 1
  default_broker: 'alpaca' | 'binance'
  risk_per_trade_pct: number        // % del portafolio por operación (default: 2)
  created_at: Date
  updated_at: Date
}

// Las API keys se guardan como Supabase Secrets (vault), NUNCA en tablas

// --- PORTAFOLIO ---

interface Position {
  id: string
  user_id: string
  broker: 'alpaca' | 'binance'
  symbol: string
  qty: number
  avg_entry_price: number
  current_price: number
  market_value: number              // calculado: qty * current_price
  unrealized_pnl: number            // calculado
  unrealized_pnl_pct: number        // calculado
  portfolio_weight_pct: number      // calculado: market_value / total_equity * 100
  side: 'long' | 'short'
  asset_class: 'equity' | 'crypto'
  synced_at: Date
  created_at: Date
}

interface EquitySnapshot {
  id: string
  user_id: string
  broker: 'alpaca' | 'binance' | 'total'
  equity: number
  cash: number
  buying_power: number
  snapshot_at: Date
}

// --- ÓRDENES ---

interface Order {
  id: string
  user_id: string
  broker_order_id: string
  broker: 'alpaca' | 'binance'
  symbol: string
  side: 'buy' | 'sell'
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit'
  qty: number
  limit_price?: number
  stop_price?: number
  filled_qty?: number
  filled_avg_price?: number
  status: 'pending' | 'accepted' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected'
  asset_class: 'equity' | 'crypto'
  submitted_at: Date
  filled_at?: Date
  notes?: string
}

// --- WATCHLIST ---

interface WatchlistItem {
  id: string
  user_id: string
  symbol: string
  broker: 'alpaca' | 'binance'
  asset_class: 'equity' | 'crypto'
  alert_price_above?: number
  alert_price_below?: number
  notes?: string
  added_at: Date
}

// --- RESEARCH ---

interface ResearchEntry {
  id: string
  user_id: string
  symbol: string
  query: string
  analysis: string
  data_used: ResearchDataSnapshot    // snapshot completo de datos usados
  portfolio_context: PortfolioContext // exposición al símbolo en el momento del análisis
  model: string                      // 'claude-sonnet-4-20250514'
  created_at: Date
}

interface ResearchDataSnapshot {
  price: number
  price_change_pct_1d: number
  volume: number
  volume_avg_30d: number
  market_cap?: number
  week_52_high: number               // para calcular distancia a ATH
  week_52_low: number
  ath_distance_pct: number           // calculado: (price - week_52_high) / week_52_high * 100
  rsi_weekly?: number                // RSI semanal si disponible
  eps_current?: number               // EPS último reportado
  eps_next_estimate?: number         // EPS consenso próximo trimestre
  revenue_growth_pct?: number        // crecimiento YoY
  pe_ratio?: number
  fetched_at: Date
}

interface PortfolioContext {
  has_position: boolean
  qty?: number
  avg_entry_price?: number
  unrealized_pnl_pct?: number
  portfolio_weight_pct?: number      // % del portafolio total que representa esta posición
}

// --- SCREENER ---

interface ScreenerPreset {
  id: string
  user_id: string
  name: string                       // ej: "Momentum Growth", "Breakout cerca de ATH"
  criteria: ScreenerCriteria
  last_run_at?: Date
  created_at: Date
}

interface ScreenerCriteria {
  market_cap_min?: number            // en USD (ej: 2_000_000_000)
  price_min?: number                 // precio mínimo por acción
  revenue_growth_min_pct?: number    // crecimiento de ingresos YoY mínimo
  volume_avg_min?: number            // volumen diario promedio mínimo
  eps_next_positive: boolean         // EPS proyectado próximo año debe ser positivo
  ath_distance_max_pct?: number      // máx % de distancia al máximo de 52 semanas (ej: 20)
  rsi_weekly_min?: number            // RSI semanal mínimo
  rsi_weekly_max?: number            // RSI semanal máximo
  exclude_dividends?: boolean        // excluir empresas que pagan dividendos
  asset_class: 'equity' | 'crypto' | 'both'
}

interface ScreenerResult {
  id: string
  user_id: string
  preset_id?: string                 // FK → screener_presets (si se corrió desde un preset)
  criteria: ScreenerCriteria
  results: ScreenerResultItem[]
  total_found: number
  ai_summary?: string                // resumen Claude de los resultados más destacados
  run_at: Date
}

interface ScreenerResultItem {
  symbol: string
  name: string
  price: number
  market_cap: number
  revenue_growth_pct: number
  ath_distance_pct: number           // negativo = está debajo del ATH
  rsi_weekly?: number
  eps_next_estimate?: number
  volume_avg: number
  score: number                      // 0-100 calculado por Claude según fit con criterios
  ai_note?: string                   // nota breve de Claude sobre por qué destaca
}
```

---

## 🔄 Flujos de Negocio Críticos

### Flujo 1: Ver estado del portafolio (< 2s)
1. Usuario abre Dashboard
2. `usePortfolio` lee `positions` y último `equity_snapshot` desde Supabase (cache React Query, stale 30s)
3. Si los datos tienen > 60s, se dispara sync en background via Edge Function `alpaca-proxy`
4. Dashboard renderiza con datos del cache; badge "actualizando" si hay sync en curso
5. Al completar sync, React Query invalida y re-renderiza

### Flujo 2: Ejecutar una orden (paper trading)
1. Usuario selecciona símbolo en watchlist o posición
2. Abre `OrderForm` → ingresa side, type, qty, precio (si aplica)
3. Sistema calcula impacto: % del portafolio, valor aproximado
4. Usuario hace click "Revisar orden" → `ConfirmOrderModal` muestra resumen completo
5. Usuario confirma → llamada a Edge Function `alpaca-proxy` POST `/orders`
6. Alpaca responde → orden se guarda en tabla `orders` con status `accepted`
7. Polling actualiza status a `filled`
8. Posición actualizada en tabla `positions`

### Flujo 3: Research Agent (con contexto de portafolio)
1. Usuario ingresa símbolo o pregunta en `ResearchPanel`
2. Hook `useResearch` llama a Edge Function `claude-research`
3. Edge Function ejecuta en paralelo:
   - (a) Datos de mercado del símbolo: precio, volumen, high/low 52w, ATH distance, RSI semanal
   - (b) Datos fundamentales: EPS actual, EPS guidance próximo trimestre, revenue growth, P/E
   - (c) Contexto de portafolio: posición actual del usuario en ese símbolo (qty, entry price, weight %)
4. Construye prompt con TODOS esos datos explícitos + pregunta del usuario
5. Claude API genera análisis en streaming que incluye:
   - Cuadro de mando ejecutivo (ticker, precio, distancia a ATH, market cap)
   - Tesis de inversión y catalizadores
   - Análisis de KPIs fundamentales con guidance
   - **Sección "Tu exposición"**: si el usuario tiene posición, evalúa si mantener/recortar/ampliar
   - Riesgos clave
   - Niveles técnicos (soporte, resistencia, RSI)
6. UI muestra: análisis streaming + panel lateral con datos fuente + TradingView widget del símbolo
7. Análisis guardado en `research_entries` con `data_used` y `portfolio_context`

### Flujo 4: Screener (buscar oportunidades)
1. Usuario va a `/screener` y configura criterios en `ScreenerCriteriaForm`
2. Puede cargar un preset guardado o crear criterios nuevos
3. Hook `useScreener` llama a Edge Function `claude-screener`
4. Edge Function:
   - (a) Obtiene universo de símbolos filtrado por criterios objetivos (market cap, volumen, precio) vía Alpaca data API
   - (b) Para los candidatos, obtiene datos fundamentales y técnicos
   - (c) Claude API filtra, puntúa (score 0-100) y genera nota breve por símbolo
   - (d) Claude genera resumen ejecutivo de los mejores resultados en el contexto del portafolio actual
5. `ScreenerResultsTable` muestra tabla interactiva: sortable por score, distancia ATH, growth
6. Usuario puede hacer click en cualquier resultado → abre Research Agent con ese símbolo precargado
7. Resultado guardado en `screener_results`; preset guardable para correr de nuevo

### Flujo 5: Configurar API keys (onboarding)
1. Usuario va a Settings
2. Ingresa keys de Alpaca (paper) y/o Binance
3. Frontend llama a Edge Function `save-api-keys` que guarda en Supabase Vault
4. Edge Function hace test de conexión; retorna `{valid: true/false}`
5. UI confirma configuración activa

---

## 🎨 Sistema de Diseño

```css
/* Tema dark trading — profesional, alta densidad de información */
:root {
  /* Backgrounds */
  --bg-base:      #0a0e17;
  --bg-surface:   #111827;
  --bg-elevated:  #1f2937;
  --bg-hover:     #374151;

  /* Texto */
  --text-primary:   #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted:     #6b7280;

  /* Semánticos financieros */
  --color-profit:  #10b981;
  --color-loss:    #ef4444;
  --color-neutral: #6b7280;
  --color-warning: #f59e0b;

  /* Accent */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;

  /* Bordes */
  --border-subtle: #1f2937;
  --border-default: #374151;
}
```

**Tipografía:**
- Display/títulos: `Inter` (weight 600-700)
- Cuerpo/UI: `Inter` (weight 400-500)
- Números/precios: `JetBrains Mono` — siempre monospace

**Reglas de densidad:**
- Números de precio/PnL siempre en monospace
- Positivo = `text-emerald-400`, negativo = `text-red-400`
- Porcentajes con signo explícito: `+2.3%` / `-1.1%`
- Score del screener: badge de color por rango (≥80 verde, 60-79 amarillo, <60 gris)

---

## 📦 Seed Data

Al completar onboarding, precargar:

**Watchlist default:**
```
Equities (Alpaca):  AAPL, MSFT, NVDA, TSLA, SPY
Cripto (Binance):   BTC/USDT, ETH/USDT, SOL/USDT
```

**Screener presets default (2):**
```
1. "Momentum Growth"
   - Market cap > $2B
   - Revenue growth > 20%
   - Volumen diario > 200K
   - Distancia ATH < 20%
   - EPS próximo positivo

2. "Breakout Técnico"
   - Market cap > $1B
   - Precio > $10
   - Distancia ATH < 10%
   - RSI semanal 50-70
```

---

## 🖥️ Pantallas y Navegación

```
SIDEBAR (izquierda, colapsable)
├── 📊 Dashboard        → /
├── 📈 Trading          → /trading
├── 🔍 Research         → /research
├── 🎯 Screener         → /screener         ← NUEVA
├── 📋 Historial        → /history
└── ⚙️  Settings        → /settings

DASHBOARD (/)
┌─────────────────────────────────────────────┐
│  Total Equity: $XX,XXX.XX   PnL Hoy: +X.X% │
│  [Alpaca: $XX,XXX] [Binance: $XX,XXX]       │
├────────────────────┬────────────────────────┤
│  POSICIONES        │  EQUITY CHART (30d)    │
│  AAPL  +2.3%  $XXX │  [línea temporal]      │
│  BTC   -1.1%  $XXX │                        │
└────────────────────┴────────────────────────┘

TRADING (/trading)
┌──────────────┬────────────────────────────────┐
│  ORDER FORM  │  WATCHLIST + PRECIOS EN TIEMPO │
│  Symbol: ___ │  AAPL   $XXX.XX  +X.X%         │
│  Side: B/S   │  BTC    $XX,XXX  -X.X%         │
│  [REVISAR]   │                                │
└──────────────┴────────────────────────────────┘

RESEARCH (/research)
┌─────────────────────────────────────────────────────────┐
│  [Analizar símbolo o hacer pregunta...]   [ANALIZAR]    │
├──────────────────────────────┬──────────────────────────┤
│  ANÁLISIS (streaming)        │  DATOS FUENTE            │
│                              │  Precio:    $XXX.XX      │
│  📊 CUADRO DE MANDO          │  ATH dist:  -8.3%        │
│  AAPL  $XXX  ATH: -8.3%     │  RSI sem:   62           │
│  Market cap: $X.XT           │  EPS act:   $X.XX        │
│                              │  EPS est:   $X.XX (+X%)  │
│  📈 TESIS DE INVERSIÓN       │  Rev grow:  +XX%         │
│  [análisis Claude...]        │  Vol:       XXM          │
│                              ├──────────────────────────┤
│  💼 TU EXPOSICIÓN            │  TU POSICIÓN             │
│  Tenés X% del portafolio     │  Qty: XX @ $XXX          │
│  PnL actual: +X.X%           │  PnL: +$XXX (+X.X%)      │
│  Recomendación: [...]        │  Weight: X% del total    │
│                              ├──────────────────────────┤
│  ⚠️ RIESGOS                  │  [TradingView Chart]     │
│  [análisis Claude...]        │  [AAPL — 1D — vela]     │
│                              │                          │
│  📐 NIVELES TÉCNICOS         │                          │
│  Soporte: $XXX               │                          │
│  Resistencia: $XXX           │                          │
└──────────────────────────────┴──────────────────────────┘
│  [Historial de análisis anteriores]                     │
└─────────────────────────────────────────────────────────┘

SCREENER (/screener)
┌─────────────────────────────────────────────────────────┐
│  🎯 SCREENER    [Presets ▼]   [Guardar preset]  [▶ Run] │
├─────────────────────────────────────────────────────────┤
│  CRITERIOS                                              │
│  Market Cap mín: [$2B    ]  Revenue growth mín: [20%]  │
│  Precio mín:     [$9     ]  Dist. ATH máx:      [20%]  │
│  Volumen diario: [200K   ]  RSI semanal:         [--  ] │
│  ☑ EPS próximo positivo    ☐ Sin dividendos            │
├─────────────────────────────────────────────────────────┤
│  RESULTADOS — 12 encontrados   IA: "Los más destacados  │
│                                 son NVDA y META por..." │
│  SYMBOL  PRECIO  GROW%  ATH%   RSI  EPS EST  SCORE     │
│  NVDA    $XXX   +45%   -5.2%  65   $X.XX     94 🟢     │
│  META    $XXX   +22%   -8.1%  58   $X.XX     87 🟢     │
│  CRWD    $XXX   +31%   -12%   61   $X.XX     79 🟡     │
│  ...                                                    │
│  [Click en cualquier fila → abre Research de ese símbolo]│
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuración Técnica

**.env.example:**
```
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Solo en Edge Functions (Supabase secrets, no en .env del frontend)
# ALPACA_API_KEY=
# ALPACA_SECRET_KEY=
# ALPACA_BASE_URL=https://paper-api.alpaca.markets
# BINANCE_API_KEY=
# BINANCE_SECRET_KEY=
# ANTHROPIC_API_KEY=
```

**tsconfig.json — strict mode obligatorio:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 🚀 Orden de Construcción para Claude Code

### Fase 1: Setup + Auth + Dashboard Básico

- [ ] `npm create vite@latest tradeos-personal -- --template react-ts`
- [ ] Instalar dependencias: `tailwindcss shadcn/ui zustand @tanstack/react-query @supabase/supabase-js recharts`
- [ ] Configurar Tailwind con tema dark (variables CSS del sistema de diseño)
- [ ] Inicializar shadcn/ui con tema custom
- [ ] Crear proyecto en Supabase, configurar Auth (email/password)
- [ ] Migration `001`: tabla `user_settings`
- [ ] Migration `002`: tablas `positions` y `equity_snapshots`
- [ ] Implementar `Login.tsx` con Supabase Auth
- [ ] Implementar `AppShell.tsx` con Sidebar colapsable
- [ ] Crear Edge Function `alpaca-proxy` con endpoints: GET `/account`, GET `/positions`
- [ ] Guardar Alpaca paper keys como Supabase Secrets
- [ ] Hook `usePortfolio` → llama a `alpaca-proxy`, cachea en React Query (stale 30s)
- [ ] `Dashboard.tsx`: muestra equity total, lista de posiciones con PnL color-coded
- [ ] `EquityChart.tsx`: línea de equity histórico con Recharts
- [ ] **Criterio de éxito Fase 1**: Login funciona → se ven posiciones reales de Alpaca paper → dashboard carga en < 2s

### Fase 2: Trading Engine (paper)

- [ ] Migration `003`: tabla `orders`
- [ ] `OrderForm.tsx` con validación de campos
- [ ] `ConfirmOrderModal.tsx` con resumen de impacto
- [ ] Edge Function `alpaca-proxy` POST `/orders`
- [ ] Hook `useOrders` para historial y polling de status
- [ ] `Trading.tsx` completo con watchlist de precios en tiempo real
- [ ] **Criterio de éxito Fase 2**: Se puede enviar y ver una orden paper en Alpaca desde la UI

### Fase 3: Research Agent Potenciado

- [ ] Edge Function `claude-research`:
  - Fetch en paralelo: precio, volumen, 52w high/low, ATH distance, RSI semanal (Alpaca data API)
  - Fetch fundamentales: EPS actual + guidance, revenue growth, P/E (Alpaca o fuente alternativa)
  - Incluir contexto de portafolio: posición actual del usuario en ese símbolo
  - Prompt estructurado que genere las 5 secciones del análisis (cuadro mando, tesis, exposición personal, riesgos, niveles técnicos)
  - Respuesta en streaming
- [ ] `KpiGrid.tsx`: panel de datos fuente (precio, ATH dist, RSI, EPS actual vs estimado, revenue growth)
- [ ] `TradingViewWidget.tsx`: embed del chart de TradingView via iframe para el símbolo analizado
- [ ] `PortfolioContext.tsx`: sección "Tu exposición" con datos de la posición actual si existe
- [ ] `ResearchPanel.tsx` con streaming response y layout de dos columnas (análisis | datos + chart)
- [ ] Migration `004`: tabla `research_entries` (con campos `data_used` y `portfolio_context`)
- [ ] Guardar historial de análisis por símbolo
- [ ] **Criterio de éxito Fase 3**: Análisis de AAPL muestra datos reales de ATH, RSI, EPS guidance + sección de exposición del portafolio + chart TradingView

### Fase 4: Binance + Cripto

- [ ] Edge Function `binance-proxy` con endpoints spot
- [ ] Normalizar `positions` para mostrar crypto y equity juntos
- [ ] Unified equity total (Alpaca + Binance)
- [ ] **Criterio de éxito Fase 4**: Dashboard muestra posiciones de ambos brokers unificadas

### Fase 5: Screener + Alertas + Deploy

- [ ] Migration `005`: tablas `screener_presets` y `screener_results`
- [ ] Edge Function `claude-screener`:
  - Recibe `ScreenerCriteria` del cliente
  - Filtra universo vía Alpaca data API (market cap, precio, volumen)
  - Para candidatos: obtiene datos fundamentales y técnicos
  - Claude API: puntúa cada candidato (score 0-100) con nota breve, genera resumen ejecutivo
  - Retorna `ScreenerResult` con contexto del portafolio actual
- [ ] `ScreenerCriteriaForm.tsx`: formulario de criterios con rangos numéricos y toggles
- [ ] `ScreenerResultsTable.tsx`: tabla interactiva con sort por cualquier columna, badge de score
- [ ] `ScreenerPanel.tsx`: gestión de presets (cargar, guardar, nombrar)
- [ ] Precargar 2 screener presets default al onboarding
- [ ] Click en resultado → navega a Research con símbolo precargado
- [ ] Tabla `watchlist` con alertas de precio
- [ ] `Settings.tsx` completo con gestión de keys y preferencias
- [ ] Deploy en Vercel con variables de entorno configuradas
- [ ] **Criterio de éxito Fase 5**: Screener corre con criterios reales, devuelve resultados puntuados, se puede navegar a Research desde un resultado

---

## 🚨 Reglas de Código

### SIEMPRE:
- TypeScript strict — `noImplicitAny` en todo
- Acceder a Supabase solo desde hooks en `src/hooks/`; nunca directo en componentes
- Todos los números financieros formateados con `formatCurrency()` o `formatPercent()` de `lib/formatters.ts`
- Números y precios en fuente monospace (clase `font-mono`)
- Positivo/negativo con clases `text-emerald-400` / `text-red-400` consistentemente
- Toda llamada a Edge Function con manejo de error explícito (try/catch + toast)
- Edge Functions con validación de JWT de Supabase al inicio
- El prompt de `claude-research` debe incluir TODOS los datos del `ResearchDataSnapshot` y el `PortfolioContext` antes de la pregunta del usuario
- El prompt de `claude-screener` debe recibir el portafolio actual del usuario para que Claude pueda identificar oportunidades que complementen (no dupliquen) las posiciones existentes

### NUNCA:
- API keys de Alpaca, Binance o Anthropic en el frontend o en tablas de Supabase
- Ejecutar órdenes sin pasar por `ConfirmOrderModal`
- Llamadas directas a brokers externos desde el cliente (siempre via Edge Functions)
- `any` en TypeScript sin comentario explicativo
- Estado local para datos que vienen de la DB (usar React Query)
- Hardcodear el modo 'live' en Fase 1-2
- Mostrar análisis de Research sin el panel de datos fuente visible simultáneamente
- Mostrar resultados del Screener sin el score y la nota de Claude por ítem

---

## 📋 Comandos de Desarrollo

```bash
# Setup inicial
npm create vite@latest tradeos-personal -- --template react-ts
cd tradeos-personal
npm install

# Dev
npm run dev

# Supabase local
supabase start
supabase functions serve alpaca-proxy --env-file .env.local
supabase functions serve claude-research --env-file .env.local
supabase functions serve claude-screener --env-file .env.local

# Migrations
supabase db push

# Deploy
vercel --prod
```

---

## 🔮 Roadmap Futuro (no construir ahora)

- **Live trading**: activar modo live en Alpaca (requiere cuenta real + validación extra)
- **Screener scheduling**: correr screeners automáticamente antes de apertura del mercado (cron)
- **Alertas push**: notificación cuando un screener preset encuentra nuevas oportunidades
- **Mobile PWA**: versión optimizada para móvil
- **Backtesting**: probar estrategias con datos históricos
- **Multi-usuario**: convertir a SaaS si hay demanda
- **TradingView charts avanzados**: reemplazar embed por Lightweight Charts con datos propios
- **Portfolio analytics**: Sharpe ratio, drawdown máximo, correlación entre activos
- **Estrategias automatizadas**: reglas if/then para órdenes programáticas
