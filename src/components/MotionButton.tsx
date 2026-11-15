import { motion, AnimatePresence } from 'motion/react';
import type { MouseEvent, ReactNode } from 'react';
import { useScrollAction } from './useScrollAction';

const ease = [0.22, 1, 0.36, 1] as const;

const sizes = {
  lg: {
    button: 'min-w-[14rem] px-7 py-4 text-sm',
    label: 'gap-3',
  },
  sm: {
    button: 'px-5 py-3 text-xs',
    label: 'gap-2',
  },
} as const;

type MotionButtonProps = {
  children: ReactNode;
  /** Id de la sección a la que baja la página, sin "#" */
  target?: string;
  /** Tamaño visual: "lg" para el hero, "sm" para el navbar */
  size?: keyof typeof sizes;
  /** Estado de carga controlado desde el padre (ej: un envío de formulario) */
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  className?: string;
};

export default function MotionButton({
  children,
  target,
  size = 'lg',
  loading = false,
  onClick,
  type = 'button',
  className = '',
}: MotionButtonProps) {
  const { phase, trigger } = useScrollAction(target ?? '');
  const s = sizes[size];

  const isLoading = loading || phase === 'loading';
  const showArrow = phase === 'arrow' && !loading;
  const busy = isLoading || showArrow;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (target) trigger();
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      whileHover={busy ? undefined : { scale: 1.03 }}
      whileTap={busy ? undefined : { scale: 0.97 }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-md bg-brand-lime font-extrabold uppercase tracking-wide text-brand-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg disabled:cursor-wait ${s.button} ${className}`}
    >
      {/* Brillo mientras carga */}
      <AnimatePresence>
        {isLoading && (
          <motion.span
            key="shimmer"
            aria-hidden="true"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.span
            key="spinner"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
              rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' },
            }}
            className="block h-5 w-5 rounded-full border-2 border-brand-bg/30 border-t-brand-bg"
          />
        ) : showArrow ? (
          <motion.svg
            key="arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: [0, 0, 4, 0] }}
            exit={{ opacity: 0, y: 12 }}
            transition={{
              opacity: { duration: 0.2 },
              y: { duration: 0.5, ease, times: [0, 0.3, 0.6, 1] },
            }}
          >
            <path d="M12 5v14M6 13l6 6 6-6" />
          </motion.svg>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className={`inline-flex items-center ${s.label}`}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}