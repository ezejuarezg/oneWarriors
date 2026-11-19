import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { faqs, type Faq } from "../data/faq";
import { site } from "../data/site";

const SEEN_KEY = "ow-faq-seen";
const ease = [0.22, 1, 0.36, 1] as const;

const MAP_EMBED = `https://www.google.com/maps?q=${site.location.lat},${site.location.lng}&z=16&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${site.location.lat},${site.location.lng}`;

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

function FAQItem({
  item,
  open,
  onToggle,
}: {
  item: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-brand-surface/80 backdrop-blur-sm transition-colors duration-300 ${
        open ? "border-brand-lime/40" : "border-white/10 hover:border-white/25"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span className="text-sm font-medium text-brand-text sm:text-base">
          {item.question}
        </span>

        {/* Signo + que gira a × al abrir */}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease }}
          className="relative flex h-6 w-6 shrink-0 items-center justify-center text-brand-lime"
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 sm:px-6">
              <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
                {item.answer}
              </p>

              {item.showMap && (
                <>
                  {/* El iframe solo existe mientras la pregunta está abierta */}
                  <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                    <iframe
                      src={MAP_EMBED}
                      title="Ubicación del gimnasio en Google Maps"
                      width="100%"
                      height="240"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="block w-full border-0"
                      style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(0.6)" }}
                    />
                  </div>

                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-hover mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-lime"
                  >
                    Abrir en Google Maps
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { ref, revealed, instant } = useSectionReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const revealClass = `transition-all duration-700 ease-out ${
    revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  const revealStyle = instant ? { transition: "none" } : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        id="faq"
        className="relative overflow-hidden bg-brand-bg py-16 sm:py-24 lg:py-28"
      >
        {/* Foto de fondo, a la izquierda, con degradado hacia el fondo */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2" aria-hidden="true">
          <img
            src="/img/faq/faq.webp"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-left opacity-40 grayscale lg:opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/80 to-brand-bg" />
          <div className="absolute inset-0 bg-linear-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Columna izquierda */}
            <div className={`relative ${revealClass}`} style={revealStyle}>
              {/* "FAQ" contorneado de fondo */}
              <span
                className="pointer-events-none absolute -top-16 left-0 select-none text-[7rem] font-black italic leading-none text-transparent sm:-top-20 sm:text-[10rem] lg:-top-24 lg:text-[12rem]"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}
                aria-hidden="true"
              >
                FAQ
              </span>

              <div className="relative pt-6 sm:pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-lime sm:text-sm">
                    Preguntas frecuentes
                  </span>
                  <span className="h-px w-24 bg-white/20 sm:w-40" aria-hidden="true" />
                </div>

                <h2 className="mt-5 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                  Resolvé tus <br />
                  <span className="text-brand-lime drop-shadow-[0_0_18px_rgba(36,86,255,0.45)]">
                    dudas
                  </span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-relaxed text-brand-muted sm:text-base">
                  Acá encontrás las respuestas a las preguntas más comunes sobre
                  nuestros entrenamientos, horarios y más.
                </p>

                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-10 inline-flex items-center gap-3 rounded-md border-2 border-brand-lime px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-brand-lime transition-colors duration-300 hover:bg-brand-lime hover:text-white"
                >
                  ¿No encontrás tu respuesta?
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.4L3 21z" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna derecha: acordeón */}
            <div className={`flex flex-col gap-3 sm:gap-4 ${revealClass}`} style={revealStyle}>
              {faqs.map((f, i) => (
                <FAQItem
                  key={f.question}
                  item={f}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="mt-20 h-0.5 w-full bg-brand-lime sm:mt-24" aria-hidden="true" />
        </div>
      </section>
    </MotionConfig>
  );
}