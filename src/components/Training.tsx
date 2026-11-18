import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { categories, type Media } from "../data/training";

const ease = [0.22, 1, 0.36, 1] as const;
const SEEN_KEY = "ow-entrenamiento-seen";

/* Indica cuándo el elemento está por entrar en pantalla, para cargar su contenido */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}

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

function PlayIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="translate-x-0.5"
    >
      <path d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

/* Video sin barra de progreso: solo reproducir y pausar */
function VideoPlayer({ src, poster, alt }: { src: string; poster?: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [flash, setFlash] = useState<"play" | "pause" | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const showFlash = (type: "play" | "pause") => {
    setFlash(type);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(null), 600);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().catch(() => {});
      showFlash("play");
    } else {
      v.pause();
      showFlash("pause");
    }
  };

  // Ícono central: el de la acción reciente, o el de reproducir si está pausado
  const icon = flash ?? (playing ? null : "play");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `Pausar: ${alt}` : `Reproducir: ${alt}`}
      className="absolute inset-0 block h-full w-full cursor-pointer"
    >
      <video
        ref={videoRef}
        src={`${src}#t=0.1`}
        poster={poster}
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />

      {/* Oscurecimiento: visible solo en pausa */}
      <span
        className={`pointer-events-none absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Botón central */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {icon && (
            <motion.span
              key={icon}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 0.25, ease }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-colors group-hover:border-brand-lime group-hover:text-brand-lime"
            >
              {icon === "play" ? <PlayIcon /> : <PauseIcon />}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Mientras reproduce, el ícono de pausa aparece al pasar el mouse */}
        {playing && !flash && (
          <span className="absolute flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:border-brand-lime group-hover:text-brand-lime group-hover:opacity-100">
            <PauseIcon />
          </span>
        )}
      </span>
    </button>
  );
}

function MediaCard({ item }: { item: Media }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="group relative aspect-4/5 w-full overflow-hidden rounded-xl border border-white/10 bg-brand-surface lg:aspect-3/4"
    >
      {inView &&
        (item.kind === "video" ? (
          <VideoPlayer src={item.src} poster={item.poster} alt={item.alt} />
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ))}
    </div>
  );
}

export default function Entrenamiento() {
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const [switched, setSwitched] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, revealed, instant } = useSectionReveal<HTMLElement>();

  const category = categories[active];
  const count = category.items.length;

  const revealClass = `transition-all duration-700 ease-out ${
    revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  const revealStyle = instant ? { transition: "none" } : undefined;

  // La barra depende de la posición real del scroll: llega al 100% en la última tarjeta
  const updateFromScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // Al cambiar de categoría, volvemos al inicio del carrusel
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateFromScroll();
  }, [active]);

  useEffect(() => {
    window.addEventListener("resize", updateFromScroll);
    return () => window.removeEventListener("resize", updateFromScroll);
  }, []);

  const go = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;

    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  };

  // Click en la barra: salta a esa posición del carrusel
  const seekTo = (e: MouseEvent<HTMLButtonElement>) => {
    const el = trackRef.current;
    if (!el) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    el.scrollTo({
      left: ratio * (el.scrollWidth - el.clientWidth),
      behavior: "smooth",
    });
  };

  const handleCategory = (i: number) => {
    setSwitched(true);
    setActive(i);
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-brand-bg text-brand-text transition-colors hover:border-brand-lime hover:text-brand-lime disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="entrenamiento"
        className="relative overflow-hidden bg-brand-bg py-10 sm:py-28 lg:py-18"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
          <div className={revealClass} style={revealStyle}>
            {/* Encabezado */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-lime sm:text-sm">
                  Entrenamiento
                </span>
                <span
                  className="hidden h-px w-24 bg-white/20 sm:block"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-0.5 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Disciplina que <br /> te hace{" "}
                <span className="text-brand-lime drop-shadow-[0_0_18px_rgba(155,227,28,0.45)]">
                  más fuerte
                </span>
              </h2>

              <p className="mx-auto mt-0.5 max-w-2xl text-sm text-brand-muted sm:text-lg">
                Entrená, superate y alcanzá tus objetivos con un entrenamiento
                real, enfocado en vos.
              </p>
            </div>

            {/* Selectores de categoría: centrados, encima del carrusel */}
            <div className="mt-10 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden sm:mt-12">
              <ul className="mx-auto flex w-max gap-6 sm:gap-12">
                {categories.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.id} className="group relative shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCategory(i)}
                        aria-current={isActive}
                        className="flex cursor-pointer items-center gap-3 pb-3 text-left"
                      >
                        <span
                          className={`text-xl font-semibold transition-colors duration-200 sm:text-2xl ${
                            isActive
                              ? "text-brand-text"
                              : "text-brand-muted/40 group-hover:text-brand-text"
                          }`}
                        >
                          0{i + 1}
                        </span>

                        <span
                          className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 sm:text-base ${
                            isActive
                              ? "text-brand-text"
                              : "text-brand-muted/50 group-hover:text-brand-text"
                          }`}
                        >
                          {c.label}
                        </span>
                      </button>

                      {/* Línea base */}
                      <span className="absolute bottom-0 left-0 h-px w-full bg-white/10 transition-colors duration-200 group-hover:bg-white/30" />

                      {/* Indicador: se dibuja en hover y queda fijo cuando está seleccionado */}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-brand-lime transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Carrusel: en desktop deja espacio a los costados para las flechas */}
            <div className="relative mt-10 min-w-0 sm:mt-12 lg:px-14">
              {/* Flechas laterales: solo desktop */}
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={!canPrev}
                aria-label="Anterior"
                className={`${arrowClass} left-0 hidden lg:flex`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => go(1)}
                disabled={!canNext}
                aria-label="Siguiente"
                className={`${arrowClass} right-0 hidden lg:flex`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>

              {/* La animación de cambio de categoría solo corre después de un clic */}
              <div
                key={category.id}
                className={switched ? "anim-slide-in" : undefined}
              >
                <div
                  ref={trackRef}
                  onScroll={updateFromScroll}
                  className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                  {category.items.map((item, i) => (
                    <div
                      key={`${category.id}-${i}`}
                      className="shrink-0 snap-start basis-[70%] sm:basis-[calc((100%-1rem)/2.5)] lg:basis-[calc((100%-2rem)/3)]"
                    >
                      <MediaCard item={item} />
                    </div>
                  ))}
                </div>

                {/* Barra de progreso continua: sigue el scroll y llega al final */}
                {count > 1 && (
                  <button
                    type="button"
                    onClick={seekTo}
                    aria-label="Progreso del carrusel"
                    className="group mt-6 block w-full cursor-pointer py-3 sm:mt-8"
                  >
                    <span className="relative block h-0.5 w-full overflow-hidden bg-white/15 transition-colors group-hover:bg-white/25">
                      <span
                        className="absolute inset-y-0 left-0 block origin-left bg-brand-lime transition-[width] duration-200 ease-out"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
        
      </section>
    </MotionConfig>
  );
}