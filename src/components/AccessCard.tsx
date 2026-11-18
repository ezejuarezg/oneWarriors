import { type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useScrollAction } from "./useScrollAction";

const ease = [0.22, 1, 0.36, 1] as const;

type AccessCardProps = {
  target: string;
  title: string;
  text: string;
  icon: ReactNode;
  delay?: number;
};

export default function AccessCard({ target, title, text, icon, delay = 0 }: AccessCardProps) {
  const { phase, trigger } = useScrollAction(target);
  const loading = phase === "loading";
  const active = phase !== "idle";

  return (
    <div className="overflow-hidden">
      <div className="intro-mask" style={{ "--d": `${delay}s` } as CSSProperties}>
        <button
          type="button"
          onClick={trigger}
          aria-busy={loading}
          className={`group relative flex w-full cursor-pointer touch-manipulation items-center gap-3 overflow-hidden rounded-xl border bg-brand-surface/80 p-4 text-left backdrop-blur-sm transition-colors duration-300 sm:gap-5 sm:p-5 ${
            active ? "border-brand-lime/40" : "border-white/10 hover:border-brand-lime/40"
          }`}
        >
          {/* Brillo mientras carga */}
          <AnimatePresence>
            {loading && (
              <motion.span
                key="shimmer"
                aria-hidden="true"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-brand-lime/10 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Barra lima lateral */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-1 origin-center bg-brand-lime transition-transform duration-300 ${
              active ? "scale-y-100" : "scale-y-50 group-hover:scale-y-100"
            }`}
          />

          <span className="shrink-0 text-brand-lime">{icon}</span>

          <div className="flex-1">
            <h2 className="text-sm font-bold uppercase text-brand-text sm:text-base">{title}</h2>
            <p className="text-xs text-brand-muted sm:text-sm">{text}</p>
          </div>

          {/* Indicador: spinner, flecha hacia abajo o flecha a la derecha */}
          <span
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:h-10 sm:w-10 ${
              active ? "border-brand-lime" : "border-white/20 group-hover:border-brand-lime"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="spinner"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.15 },
                    rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
                  }}
                  className="block h-4 w-4 rounded-full border-2 border-white/20 border-t-brand-lime"
                />
              ) : phase === "arrow" ? (
                <motion.svg
                  key="down"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-brand-lime"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: [0, 0, 3, 0] }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    opacity: { duration: 0.15 },
                    y: { duration: 0.3, ease, times: [0, 0.3, 0.6, 1] },
                  }}
                >
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="right"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-brand-text transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-lime"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
        </button>
      </div>
    </div>
  );
}