"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { courseMeta } from "@/data/linesAndPlanesData";

type NavbarProps = {
  onMenuToggle: () => void;
  menuOpen: boolean;
};

export function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0a0a0a]/92 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex h-full items-center justify-between">
        <a href="#overview" className="flex items-center gap-3" aria-label="Return to overview">
          <span className="grid h-8 w-8 place-items-center border border-sky-400/40 bg-sky-400/10 font-mono text-xs font-bold text-sky-300">
            H
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-tight">{courseMeta.courseCode}</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              Spatial systems
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <span className="micro-label text-zinc-500">Topic {courseMeta.topicCode}</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="text-sm text-zinc-300">{courseMeta.title}</span>
          <a
            href="#spatial-lab"
            className="border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold transition hover:border-sky-400/45 hover:text-sky-300"
          >
            Open spatial lab
          </a>
        </div>

        <button
          type="button"
          onClick={onMenuToggle}
          className="grid h-10 w-10 place-items-center border border-white/10 text-zinc-300 md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </motion.header>
  );
}
