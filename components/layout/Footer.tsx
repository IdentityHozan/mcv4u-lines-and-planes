"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/visualizer") return null;

  return (
    <footer className="border-t border-white/10 bg-[#090909] py-9">
      <div className="section-shell flex flex-col gap-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>MCV4U · Lines and Planes</p>
        <p>Grade 12 Calculus and Vectors learning portal</p>
      </div>
    </footer>
  );
}
