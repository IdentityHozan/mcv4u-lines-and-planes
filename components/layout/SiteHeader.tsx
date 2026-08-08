"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/lessons", label: "Lessons" },
  { href: "/visualizer", label: "3D Visualizer" },
  { href: "/calculator", label: "Calculator" },
  { href: "/practice", label: "Practice" },
  { href: "/assessments", label: "Quizzes" },
  { href: "/exam", label: "Final Exam" },
  { href: "/admin", label: "Admin" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between gap-5 sm:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label="MCV4U Topic H home">
          <span className="block text-sm font-bold tracking-tight text-zinc-100">MCV4U</span>
          <span className="micro-label block text-sky-300">Topic H</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 text-xs font-semibold transition ${
                  active ? "bg-sky-400/10 text-sky-300" : "text-zinc-400 hover:bg-white/[0.035] hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="min-h-10 border border-white/15 px-4 text-sm font-semibold text-zinc-200 xl:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? "Close menu" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="border-t border-white/10 bg-[#0d0d0d] p-3 xl:hidden" aria-label="Mobile navigation">
          <div className="section-shell grid gap-1 sm:grid-cols-2">
            {navigation.map((item) => {
              const active = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`border px-4 py-3 text-sm font-semibold ${
                    active ? "border-sky-400/30 bg-sky-400/[0.07] text-sky-300" : "border-white/10 text-zinc-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
