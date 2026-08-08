"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CourseNavigation } from "./Navigation";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 border-r border-white/10 bg-[#0a0a0a] px-6 py-8 lg:block">
        <CourseNavigation />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 top-16 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 top-16 z-40 w-[min(86vw,320px)] border-r border-white/10 bg-[#0a0a0a] px-6 py-8 lg:hidden"
            >
              <CourseNavigation onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
