import { useEffect, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import MotionButton from "./MotionButton";
import { scrollToId } from "./useScrollAction";

const links = [
  { label: "Entrenamiento", id: "entrenamiento" },
  { label: "Sobre Mí", id: "sobre-mi" },
  { label: "Preguntas Frecuentes", id: "faq" },
];

const ease = [0.22, 1, 0.36, 1] as const;

type NavbarProps = {
  /** Vacío en la página principal. En otras páginas, "/" para volver al inicio */
  homeBase?: string;
};

export default function Navbar({ homeBase = "" }: NavbarProps) {
  const isHome = homeBase === "";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = links.map((l) => l.id);

    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const line = window.innerHeight * 0.35;
      let current: string | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          current = id;
          break;
        }
      }

      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // En la página principal: scroll suave con Lenis.
  // En otras páginas: navegación normal hacia "/#seccion".
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!isHome) return;

    e.preventDefault();
    setActiveId(id);
    scrollToId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const hrefFor = (id: string) => `${homeBase}#${id}`;
  const active = scrolled || open || !isHome;

  const contactLinkClass =
    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-brand-lime px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:brightness-110";

  return (
    <header
      className={`intro-down fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-500 ${
        active
          ? "border-white/10 bg-brand-bg/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12 lg:py-4">
        {/* Logo */}
        <motion.a
          href={isHome ? "#inicio" : "/"}
          onClick={(e) => isHome && handleNav(e, "inicio")}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          aria-label="One Warrior, ir al inicio"
          className="flex shrink-0 items-center"
        >
          <img
            src="/img/logo/logo.webp"
            alt="One Warrior"
            width={512}
            height={512}
            className="h-10 w-auto sm:h-12 lg:h-14"
          />
        </motion.a>

        {/* Links: solo desktop */}
        <ul className="hidden items-center gap-8 text-sm font-medium lg:flex xl:gap-10">
          {links.map((link) => {
            const isActive = isHome && activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={hrefFor(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => handleNav(e, link.id)}
                  className={`underline-hover block py-1 transition-colors duration-300 ${
                    isActive ? "text-brand-text" : "text-brand-text/70 hover:text-brand-text"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {/* Botón del navbar: solo desktop */}
          <div className="hidden lg:block">
            {isHome ? (
              <MotionButton target="contacto" size="sm" className="whitespace-nowrap">
                Contacto
              </MotionButton>
            ) : (
              <a href={`${homeBase || "/"}#contacto`} className={contactLinkClass}>
                Contacto
              </a>
            )}
          </div>

          {/* Hamburguesa: todo lo que no es desktop */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
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
                {links.map((link) => {
                  const isActive = isHome && activeId === link.id;
                  return (
                    <motion.li
                      key={link.id}
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
                        href={hrefFor(link.id)}
                        aria-current={isActive ? "true" : undefined}
                        onClick={(e) => handleNav(e, link.id)}
                        className={`underline-hover block py-1 transition-colors duration-300 ${
                          isActive ? "text-brand-lime" : "text-brand-text"
                        }`}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {isHome ? (
                <MotionButton
                  target="contacto"
                  size="sm"
                  className="w-full whitespace-nowrap"
                  onClick={() => setOpen(false)}
                >
                  Contacto
                </MotionButton>
              ) : (
                <a
                  href={`${homeBase || "/"}#contacto`}
                  onClick={() => setOpen(false)}
                  className={`${contactLinkClass} w-full`}
                >
                  Contacto
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}