import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../lib/constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85&auto=format&fit=crop";

const CATEGORIES = [
  { slug: "lacteos-quesos",    emoji: "🧀", label: "Lácteos y quesos" },
  { slug: "mieles-derivados",  emoji: "🍯", label: "Mieles y derivados" },
  { slug: "frutas-verduras",   emoji: "🫐", label: "Frutas y verduras" },
  { slug: "hongos",            emoji: "🍄", label: "Hongos" },
  { slug: "huevos-aves",       emoji: "🥚", label: "Huevos y aves" },
  { slug: "panela-derivados",  emoji: "🌿", label: "Panela y derivados" },
  { slug: "cafe-cacao",        emoji: "☕", label: "Café y cacao" },
  { slug: "otros-naturales",   emoji: "🌱", label: "Otros naturales" },
];

const VALUES = [
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Catálogo siempre visible",
    desc: "Explora todos los productos sin necesidad de crear una cuenta.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Precios claros",
    desc: "El precio que ves es el que pagas. Sin sorpresas en el checkout.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-6 3.75H9m1.5-12H9" />
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

  const heroItemClass = `hero-item${visible ? " is-visible" : ""}`;

  return (
    <div className="font-body min-h-screen bg-bg">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: "center 30%" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,28,10,0.30) 0%, rgba(10,28,10,0.68) 55%, rgba(10,28,10,0.92) 100%)",
          }}
        />

        {/* Grain */}
        <div className="grain-overlay absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-5 pb-28 pt-16 sm:px-10 sm:pb-32">
          <p
            className={`${heroItemClass} font-ui text-[11px] font-medium uppercase tracking-[0.14em] text-accent`}
            style={{ transitionDelay: "0.08s", marginBottom: "1rem" }}
          >
            Agronausa · Productos del campo colombiano
          </p>

          <h1
            className={`${heroItemClass} font-display font-black text-white`}
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              lineHeight: 1.07,
              letterSpacing: "-0.02em",
              transitionDelay: "0.18s",
              marginBottom: "1.4rem",
            }}
          >
            Del productor
            <br />
            <em className="italic" style={{ color: "#d4e8a0" }}>
              directo a tu mesa.
            </em>
          </h1>

          <p
            className={`${heroItemClass} font-body text-white/75`}
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.65,
              maxWidth: 460,
              fontWeight: 300,
              transitionDelay: "0.30s",
              marginBottom: "2.2rem",
            }}
          >
            Mieles, quesos artesanales, hongos, frutas de Cundinamarca y más.
            Compra sin registro. Precios reales, sin intermediarios.
          </p>

          <div
            className={`${heroItemClass} flex flex-col items-start gap-3`}
            style={{ transitionDelay: "0.44s" }}
          >
            <Link
              to={ROUTES.catalog}
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold font-ui text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#245517] hover:shadow-[0_8px_28px_rgba(45,106,31,0.5)] active:translate-y-0"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Ver catálogo completo
            </Link>

            <p className="text-[13px] text-white/50">
              ¿Eres distribuidor?{" "}
              <Link
                to={ROUTES.login}
                className="text-[#d4e8a0] underline underline-offset-2 hover:text-white transition-colors"
              >
                Ingresa para ver tus precios pactados
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS — flotan sobre el hero ──────────────────── */}
      <section className="relative z-10 -mt-14 px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-surface p-6 shadow-[0_8px_48px_rgba(0,0,0,0.13)] sm:p-8">
            <p className="mb-4 font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
              Categorías
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`${ROUTES.catalog}?categoria=${cat.slug}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-bg px-2 py-3.5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(45,106,31,0.12)]"
                >
                  <span className="text-2xl leading-none">{cat.emoji}</span>
                  <span className="font-ui text-[10px] font-medium leading-tight text-text sm:text-[11px]">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ AGRONAUSA ───────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="mb-4 h-0.5 w-12 bg-accent" />
            <h2
              className="font-display font-bold text-text"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.2 }}
            >
              Por qué comprar en Agronausa
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(45,106,31,0.1)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  {v.icon}
                </div>
                <h3 className="mb-2 font-display text-[1.05rem] font-bold text-text">
                  {v.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-text-muted">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER B2B ──────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#1a3a0f] px-8 py-12">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/8" />
            <div className="pointer-events-none absolute bottom-[-5rem] right-16 h-52 w-52 rounded-full bg-accent/6" />

            <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <p className="mb-3 font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                  Para distribuidores y negocios
                </p>
                <h2
                  className="mb-2 font-display font-bold text-white"
                  style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.8rem)", lineHeight: 1.2 }}
                >
                  ¿Compras por volumen?
                </h2>
                <p className="font-body text-sm leading-relaxed text-white/60">
                  Crea una cuenta de negocio y accede a precios mayoreo pactados
                  directamente con David.
                </p>
              </div>

              <Link
                to={ROUTES.register}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold font-ui text-white transition-all duration-200 hover:bg-[#a96e2e] hover:-translate-y-0.5 active:translate-y-0"
              >
                Crear cuenta de negocio
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
