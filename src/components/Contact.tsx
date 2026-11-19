import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { site } from "../data/site";

const SEEN_KEY = "ow-contacto-seen";

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

const channels = [
  {
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: site.whatsappUrl,
    icon: <path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.4L3 21z" />,
  },
  {
    label: "Instagram",
    value: "@onewarrior.vargas",
    href: site.instagramUrl,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Contacto() {
  const { ref, revealed, instant } = useSectionReveal<HTMLElement>();

  const revealClass = `transition-all duration-700 ease-out ${
    revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  const revealStyle = instant ? { transition: "none" } : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        id="contacto"
        className="relative overflow-hidden bg-brand-bg py-16 sm:py-24 lg:py-40"
      >
        {/* Fondo: foto del gimnasio con degradados */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src="/img/contacto/beWarrior.webp"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-50 grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/85 to-brand-bg/60" />
          <div className="absolute inset-0 bg-linear-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div
            className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${revealClass}`}
            style={revealStyle}
          >
            {/* Texto y CTA */}
            <div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-lime sm:text-sm">
                  Contacto
                </span>
                <span className="h-px w-24 bg-white/20 sm:w-40" aria-hidden="true" />
              </div>

              <h2 className="mt-6 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                Empezá ahora <br />
                <span className="block italic text-brand-lime drop-shadow-[0_0_18px_rgba(36,86,255,0.45)]">
                  tu camino
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-relaxed text-brand-muted sm:text-lg">
                Entrená en un espacio diseñado para que alcances tus objetivos.
                ¡Escribinos y reservá tu lugar!
              </p>
            </div>

            {/* Canales de contacto */}
            <ul className="flex flex-col gap-3 sm:gap-4">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-brand-surface/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-brand-lime/40 sm:p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-brand-lime transition-colors duration-300 group-hover:border-brand-lime">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {c.icon}
                      </svg>
                    </span>

                    <span className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-brand-muted">
                        {c.label}
                      </span>
                      <span className="text-sm font-semibold text-brand-text sm:text-base">
                        {c.value}
                      </span>
                    </span>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="ml-auto text-brand-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-lime"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}