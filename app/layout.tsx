import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCV4U Topic H: Lines and Planes",
  description:
    "An interactive Grade 12 Calculus and Vectors learning portal for lines, planes, intersections, and distance in three-space.",
  other: {
    "codex-preview": "development",
    "theme-color": "#0A0A0A",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const mathJaxConfiguration = `
  window.MathJax = {
    tex: {
      inlineMath: [['\\\\(', '\\\\)']],
      displayMath: [['\\\\[', '\\\\]']],
      processEscapes: true,
      packages: {'[+]': ['ams']}
    },
    svg: {
      fontCache: 'global',
      displayAlign: 'left'
    },
    startup: {
      typeset: false
    }
  };
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: mathJaxConfiguration }} />
        <script
          id="mathjax-script"
          defer
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        />
      </head>
      <body>
        <SiteHeader />
        <main className="min-h-[calc(100vh-12rem)] pt-16 sm:pt-[4.5rem]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
