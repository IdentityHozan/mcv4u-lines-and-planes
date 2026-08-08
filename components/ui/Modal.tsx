"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "medium" | "large";
};

export function Modal({ open, onClose, title, children, size = "large" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex max-h-[92vh] w-full flex-col border border-white/15 bg-[#0e0e0e] shadow-2xl ${
              size === "large" ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center border border-white/10 text-zinc-500 transition hover:border-white/25 hover:text-white"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
