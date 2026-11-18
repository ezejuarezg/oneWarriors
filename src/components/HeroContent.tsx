import { useRef, type CSSProperties } from "react";
import { motion, MotionConfig, useScroll, useTransform } from "motion/react";
import MotionButton from "./MotionButton";
import AccessCard from "./AccessCard";

const heroImage = "/img/hero.webp";

/* Retraso de la intro, se lee desde CSS como --d */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export default function HeroContent() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="inicio"
        className="relative flex min-h-svh items-end overflow-hidden lg:items-center"
      >
        {/* Foto con parallax (Motion) y zoom de entrada (CSS) */}
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-x-0 top-[-8%] h-[116%]"
        >
          <img
            src={heroImage}
            alt="Atleta entrenando con determinación"
            className="intro-zoom h-full w-full object-cover object-[65%_top] sm:object-[60%_top] lg:object-right"
            loading="eager"
          />
        </motion.div>

        {/* Degradados: vertical en móvil para leer el texto, horizontal en desktop */}
        <div
          className="absolute inset-0 bg-linear-to-t from-brand-bg via-brand-bg/70 to-brand-bg/30 sm:via-brand-bg/60 lg:bg-linear-to-r lg:from-brand-bg lg:via-brand-bg/60 lg:to-brand-bg/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pt-32 lg:pb-16">
          <div className="max-w-2xl">
            <p
              className="intro-up text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-lime sm:text-sm sm:tracking-[0.35em]"
              style={d(0.1)}
            >
              Entrenamiento personalizado
            </p>

            <h1 className="mt-4 text-[2.5rem] font-black uppercase leading-[0.95] tracking-tight sm:mt-5 sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden">
                <span
                  className="intro-mask block text-brand-text"
                  style={d(0.2)}
                >
                  Convertite en un
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="intro-mask block italic text-brand-lime"
                  style={d(0.28)}
                >
                  Warrior
                </span>
              </span>
            </h1>

            <p
              className="intro-up mt-4 text-sm text-brand-muted sm:mt-6 sm:text-lg"
              style={d(0.4)}
            >
              Entrenamiento real. Resultados reales.
            </p>

            {/* Móvil: botón de ancho completo. Desktop: tamaño natural */}
            <div className="mt-6 overflow-hidden sm:mt-8 sm:inline-block">
              <div className="intro-mask" style={d(0.5)}>
                <MotionButton
                  target="contacto"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Empezá ahora
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </MotionButton>
              </div>
            </div>
          </div>

          {/* Móvil: 1 columna apilada. Tablet: 2 columnas. Desktop: columna con ancho máximo */}
          <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:mt-12 lg:max-w-xl">
            <AccessCard
              target="entrenamiento"
              title="Entrenamiento"
              text="Kick Boxing, Muai Thai, Musculación, Rutinas y Preparación Física"
              delay={0.6}
              icon={
                <svg
                  className="h-7 w-7 sm:h-9 sm:w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11" />
                </svg>
              }
            />

            <AccessCard
              target="faq"
              title="Horarios y ubicación"
              text="Respuestas sobre nuestros horarios, dirección y atención."
              delay={0.68}
              icon={
                <svg
                  className="h-7 w-7 sm:h-9 sm:w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
