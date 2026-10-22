import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const coursePath = [
  {
    number: "01",
    title: "Watch and learn",
    description: "Start with the video, then work through the lesson notes, diagrams, and examples.",
    href: "/lessons",
    linkLabel: "Open lessons",
  },
  {
    number: "02",
    title: "Explore",
    description: "Change a line or plane and watch the geometry respond in three dimensions.",
    href: "/visualizer",
    linkLabel: "Open the visualizer",
  },
  {
    number: "03",
    title: "Practise",
    description: "Solve graduated homework sets, then compare your method with the full solution.",
    href: "/practice",
    linkLabel: "Start practice",
  },
  {
    number: "04",
    title: "Quizzes",
    description: "Check each topic with multiple-choice questions, written problems, and worked solutions.",
    href: "/assessments",
    linkLabel: "Open assessments",
  },
  {
    number: "05",
    title: "Tests",
    description: "Apply several skills in a formal test before reviewing the worked solutions.",
    href: "/tests",
    linkLabel: "Open tests",
  },
  {
    number: "06",
    title: "Final exam",
    description: "Complete a cumulative assessment across equations, intersections, distances, and reasoning.",
    href: "/exam",
    linkLabel: "Open final exam",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="industrial-grid border-b border-white/10">
        <ScrollReveal className="section-shell flex min-h-[min(720px,calc(100dvh-4.5rem))] items-center py-16">
          <div className="max-w-4xl">
            <p className="micro-label text-sky-300">MCV4U</p>
            <h1 className="page-title mt-5 text-zinc-100">Lines and Planes</h1>
            <p className="page-lead mt-6 max-w-2xl">
              Study Sections 8.1 to 9.6 in order. Learn line and plane equations, solve intersections, and calculate exact distances.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lessons/line-equations" className="primary-action">Start learning</Link>
              <Link href="/visualizer" className="secondary-action">Explore in 3D</Link>
              <Link href="/resources" className="secondary-action">Course resources</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="section-shell page-section" aria-labelledby="course-path-title">
        <ScrollReveal className="max-w-2xl">
          <p className="micro-label text-sky-300">Course path</p>
          <h2 id="course-path-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">One clear sequence</h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2">
          {coursePath.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 0.05} className="h-full">
              <article className="flex h-full flex-col bg-[#101010] p-6 sm:p-8">
                <p className="font-mono text-xs text-sky-300">{step.number}</p>
                <h3 className="mt-5 text-2xl font-semibold text-zinc-100">{step.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">{step.description}</p>
                <Link href={step.href} className="mt-6 w-fit text-sm font-semibold text-sky-300 hover:text-sky-200">{step.linkLabel}</Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
