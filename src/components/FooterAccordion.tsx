import { useState, type ReactNode } from "react";

interface FooterAccordionProps {
  title: string;
  children: ReactNode;
}

export default function FooterAccordion({ title, children }: FooterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full md:w-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-lime sm:text-xs sm:tracking-[0.3em]">
          {title}
        </h3>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Cerrar" : "Abrir"} ${title}`}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-brand-text transition-colors hover:text-brand-lime md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Móvil: se colapsa con la altura. Desktop: siempre visible */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } md:grid-rows-[1fr] md:opacity-100`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 sm:pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}