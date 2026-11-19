import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";

const SEEN_KEY = "ow-sobre-mi-seen";
const ease = [0.22, 1, 0.36, 1] as const;

/* La entrada de la sección se reproduce solo la primera vez por sesión */
function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY) === "1") {
      setInstant(true);
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sessionStorage.setItem(SEEN_KEY, "1");
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, revealed, instant };
}

const pillars = [
  {
    label: "Entrenamiento personalizado",
    icon: <path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11" />,
  },
  {
    label: "Compromiso y constancia",
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  },
  {
    label: "Resultados reales",
    icon: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
      </>
    ),
  },
];

export default function SobreMi() {
  const { ref, revealed, instant } = useSectionReveal<HTMLElement>();

  const revealClass = `transition-all duration-700 ease-out ${
    revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  const revealStyle = instant ? { transition: "none" } : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        id="sobre-mi"
        className="relative overflow-hidden bg-brand-bg py-16 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Columna de texto */}
            <div className={revealClass} style={revealStyle}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-lime sm:text-sm">
                  Sobre mí
                </span>
                <span className="h-px w-24 bg-white/20 sm:w-40" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Mi pasión, <br />
                tu{" "}
                <span className="text-brand-lime drop-shadow-[0_0_18px_rgba(36,86,255,0.45)]">
                  entrenamiento
                </span>
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                <p className="text-brand-text">
                  Soy un apasionado del deporte y el entrenamiento. Mi objetivo
                  es ayudarte a alcanzar tus metas, ya sea mejorar tu condición
                  física, ganar fuerza o simplemente sentirte mejor en tu día a
                  día.
                </p>
                <p>
                  Acá vas a encontrar un espacio de entrenamiento real, con
                  compromiso, dedicación y buena energía.
                </p>
              </div>

              {/* Pilares */}
              <ul className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
                {pillars.map((p, i) => (
                  <li
                    key={p.label}
                    className={`flex flex-col gap-3 ${
                      i > 0 ? "border-l border-white/10 pl-4 sm:pl-6" : ""
                    }`}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="text-brand-lime"
                    >
                      {p.icon}
                    </svg>
                    <span className="text-xs leading-snug text-brand-muted sm:text-sm">
                      {p.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.instagram.com/ironarmourfit/"
                className="group mt-10 inline-flex items-center gap-3 rounded-md border-2 border-brand-lime px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-brand-lime transition-colors duration-300 hover:bg-brand-lime hover:text-white"
              >
                Conocé el gimnasio
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </div>

            {/* Collage de fotos */}
            <div
              className={`relative mx-auto w-full max-w-md lg:max-w-none ${revealClass}`}
              style={revealStyle}
            >
              {/* Marco azul decorativo */}
              <span
                className="pointer-events-none absolute -left-3 -top-4 h-[90%] w-[80%] -rotate-3 rounded-xl border border-brand-lime/70 sm:-left-6 sm:-top-6"
                aria-hidden="true"
              />

              <div className="grid grid-rows-2 gap-3 sm:gap-4">
                {/* Foto principal */}
                <div className="group relative col-span-3 row-span-2 aspect-3/4 -rotate-2 overflow-hidden rounded-xl border border-white/10 transition-transform duration-500 hover:rotate-0">
                  <img
                    src="/img/aboutme/coach.webp"
                    alt="Foto del coach Facundo Vargas posando en posición de combate"
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="mt-20 h-0.5 w-full bg-brand-lime sm:mt-24" aria-hidden="true" />
        </div>
      </section>
    </MotionConfig>
  );
}