// Home.tsx — Agronausa
// Diseño: "Tierra Viva" — orgánico premium, campo colombiano
// Fuentes: Playfair Display (títulos) + DM Sans (cuerpo)
// Reemplaza: src/pages/Home.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../lib/constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format&fit=crop";

const CATEGORIES = [
  { slug: "lacteos-quesos", emoji: "🧀", label: "Lácteos y quesos" },
  { slug: "mieles-derivados", emoji: "🍯", label: "Mieles y derivados" },
  { slug: "frutas-verduras", emoji: "🫐", label: "Frutas y verduras" },
  { slug: "hongos", emoji: "🍄", label: "Hongos" },
  { slug: "huevos-aves", emoji: "🥚", label: "Huevos y aves" },
  { slug: "panela-derivados", emoji: "🌿", label: "Panela y derivados" },
  { slug: "cafe-cacao", emoji: "☕", label: "Café y cacao" },
  { slug: "otros-naturales", emoji: "🌱", label: "Otros naturales" },
];

const VALUES = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: "Catálogo siempre visible",
    desc: "Explora todos los productos sin necesidad de crear una cuenta.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Precios claros",
    desc: "El precio que ves es el que pagas. Sin sorpresas en el checkout.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-6 3.75H9m1.5-12H9"
        />
      </svg>
    ),
    title: "Pedidos con número",
    desc: "Cada pedido queda registrado. Consulta el estado en cualquier momento.",
  },
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Fuentes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .agro-home * { box-sizing: border-box; }

        .agro-font-display { font-family: 'Playfair Display', Georgia, serif; }
        .agro-font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        .agro-hero-text {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1);
        }
        .agro-hero-text.visible { opacity: 1; transform: translateY(0); }
        .agro-hero-text.delay-1 { transition-delay: 0.12s; }
        .agro-hero-text.delay-2 { transition-delay: 0.24s; }
        .agro-hero-text.delay-3 { transition-delay: 0.38s; }
        .agro-hero-text.delay-4 { transition-delay: 0.52s; }

        .agro-cat-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .agro-cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(45,106,31,0.15);
        }

        .agro-cta-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .agro-cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .agro-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,106,31,0.45); }
        .agro-cta-btn:hover::after { opacity: 1; }
        .agro-cta-btn:active { transform: translateY(0); }

        .agro-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.35;
        }

        .agro-divider {
          width: 48px; height: 2px;
          background: #C4853A;
          margin: 1rem 0 1.5rem;
        }

        @media (max-width: 640px) {
          .agro-hero-inner { padding: 2.5rem 1.25rem 6rem; }
          .agro-hero-title { font-size: clamp(2.2rem, 9vw, 3.5rem) !important; }
          .agro-cats-grid  { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
          .agro-cats-label { font-size: 10px !important; }
          .agro-vals-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="agro-home agro-font-body"
        style={{ background: "#F9F6F0", minHeight: "100vh" }}
      >
        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Imagen de fondo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />

          {/* Overlay degradado */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(10,28,10,0.35) 0%, rgba(10,28,10,0.72) 60%, rgba(10,28,10,0.92) 100%)",
            }}
          />

          {/* Grain */}
          <div className="agro-grain" />

          {/* Contenido hero */}
          <div
            className="agro-hero-inner"
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 760,
              padding: "4rem 2.5rem 7rem",
            }}
          >
            <p
              className={`agro-font-body agro-hero-text delay-1 ${visible ? "visible" : ""}`}
              style={{
                color: "#C4853A",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Agronausa · Productos del campo colombiano
            </p>

            <h1
              className={`agro-font-display agro-hero-title agro-hero-text delay-2 ${visible ? "visible" : ""}`}
              style={{
                color: "#fff",
                fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                margin: "0 0 1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Del productor
              <br />
              <em style={{ fontStyle: "italic", color: "#d4e8a0" }}>
                directo a tu mesa.
              </em>
            </h1>

            <p
              className={`agro-hero-text delay-3 ${visible ? "visible" : ""}`}
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                maxWidth: 480,
                marginBottom: "2.25rem",
                fontWeight: 300,
              }}
            >
              Mieles, quesos artesanales, hongos, frutas de Cundinamarca y más.
              Compra sin registro. Precios reales, sin intermediarios.
            </p>

            <div
              className={`agro-hero-text delay-4 ${visible ? "visible" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <Link
                to={ROUTES.catalog}
                className="agro-cta-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#2D6A1F",
                  color: "#fff",
                  padding: "0.9rem 2rem",
                  borderRadius: 100,
                  fontWeight: 500,
                  fontSize: "1rem",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Ver catálogo completo
              </Link>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                ¿Eres distribuidor?{" "}
                <Link
                  to={ROUTES.login}
                  style={{
                    color: "#d4e8a0",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Ingresa para ver tus precios pactados
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            CATEGORÍAS — flotan sobre el hero
        ══════════════════════════════ */}
        <section
          style={{
            position: "relative",
            zIndex: 3,
            marginTop: -56,
            padding: "0 1.5rem 3rem",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Tarjeta contenedora */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "2rem 2rem 1.75rem",
                boxShadow: "0 8px 48px rgba(0,0,0,0.12)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#7A6553",
                  marginBottom: "1.25rem",
                }}
              >
                Categorías
              </p>
              <div
                className="agro-cats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: 12,
                }}
              >
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`${ROUTES.catalog}?categoria=${cat.slug}`}
                    className="agro-cat-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      padding: "1rem 0.5rem",
                      borderRadius: 14,
                      background: "#F9F6F0",
                      border: "1px solid #EAE4DA",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1 }}>
                      {cat.emoji}
                    </span>
                    <span
                      className="agro-cats-label agro-font-body"
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#2C1A0E",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            VALORES
        ══════════════════════════════ */}
        <section style={{ padding: "2rem 1.5rem 5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <div className="agro-divider" />
              <h2
                className="agro-font-display"
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#2C1A0E",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Por qué comprar en Agronausa
              </h2>
            </div>

            <div
              className="agro-vals-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem",
              }}
            >
              {VALUES.map((v, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #EAE4DA",
                    borderRadius: 16,
                    padding: "1.75rem 1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "#EAF3DE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2D6A1F",
                      marginBottom: "1.1rem",
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3
                    className="agro-font-display"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#2C1A0E",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#7A6553",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            BANNER CAMPO
        ══════════════════════════════ */}
        <section style={{ padding: "0 1.5rem 5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                borderRadius: 20,
                background: "#1a3a0f",
                padding: "3rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
                flexWrap: "wrap",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Detalle decorativo */}
              <div
                style={{
                  position: "absolute",
                  right: -60,
                  top: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: "rgba(196,133,58,0.08)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 60,
                  bottom: -80,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(196,133,58,0.06)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    color: "#C4853A",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Para distribuidores y negocios
                </p>
                <h2
                  className="agro-font-display"
                  style={{
                    color: "#fff",
                    fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                    fontWeight: 700,
                    margin: "0 0 0.75rem",
                    lineHeight: 1.25,
                  }}
                >
                  ¿Compras por volumen?
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    maxWidth: 420,
                    margin: 0,
                  }}
                >
                  Crea una cuenta de negocio y accede a precios mayoreo pactados
                  directamente con David.
                </p>
              </div>

              <Link
                to={ROUTES.register}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#C4853A",
                  color: "#fff",
                  padding: "0.85rem 1.75rem",
                  borderRadius: 100,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background 0.18s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#a96e2e")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#C4853A")
                }
              >
                Crear cuenta de negocio
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
