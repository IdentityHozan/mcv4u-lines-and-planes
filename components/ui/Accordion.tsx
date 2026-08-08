"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
  headerClassName = "",
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border border-white/10 bg-[#111] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.025] ${headerClassName}`}
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">{title}</span>
        <span className="shrink-0 text-xs font-semibold text-sky-300">{open ? "Hide" : "Show"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-5 sm:p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
