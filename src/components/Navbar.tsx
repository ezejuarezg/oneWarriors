import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MotionButton from "./MotionButton";

const links = [
  { label: "Entrenamiento", href: "#entrenamiento" },
  { label: "Planes", href: "#planes" },
  { label: "Sobre Mí", href: "#sobre-mi" },
  { label: "FAQ", href: "#faq" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = scrolled || open;

  return (
    <header
      className={`intro-down fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-500 ${
        active
          ? "border-white/10 bg-brand-bg/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12 lg:py-5">
        <motion.a
          href="#inicio"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="flex origin-left flex-col text-xl font-black leading-[0.85] tracking-tight text-brand-text sm:text-2xl"
        >
          <span>one</span>
          <span>warrior</span>
        </motion.a>

        {/* Links: solo desktop */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-brand-text/80 lg:flex xl:gap-10">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative block py-1 transition-colors hover:text-brand-text"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-lime transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Botón del navbar: solo desktop */}
          <div className="hidden lg:block">
            <MotionButton
              target="contacto"
              size="sm"
              className="whitespace-nowrap"
            >
              Contacto
            </MotionButton>
          </div>

          {/* Hamburguesa: todo lo que no es desktop */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="block h-0.5 w-6 bg-brand-text"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-6 bg-brand-text"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="block h-0.5 w-6 bg-brand-text"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="px-5 pb-6 sm:px-8">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                  },
                }}
                className="flex flex-col gap-4 py-4 text-base font-medium"
              >
                {links.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.4, ease },
                      },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-1"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <MotionButton
                target="planes"
                size="sm"
                className="whitespace-nowrap w-full"
              >
                {" "}
                Contacto
              </MotionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
