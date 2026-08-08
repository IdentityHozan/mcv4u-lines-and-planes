import Link from "next/link";
import { conceptModules, learningObjectives } from "@/data/linesAndPlanesData";

const studyPath = [
  {
    title: "Learn the equation forms",
    description: "Work through eight focused lessons, each with checks and a complete example.",
    href: "/lessons",
    linkLabel: "Browse lessons",
  },
  {
    title: "Explore the geometry",
    description: "Change line and plane values, rotate the scene, and classify intersections live.",
    href: "/visualizer",
    linkLabel: "Open the visualizer",
  },
  {
    title: "Practise with feedback",
    description: "Complete four homework sets and reveal the typed reasoning only when needed.",
    href: "/practice",
    linkLabel: "Start practice",
  },
  {
    title: "Check your understanding",
    description: "Take three KATC-tagged quizzes, then complete the comprehensive final exam.",
    href: "/assessments",
    linkLabel: "View quizzes",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="industrial-grid border-b border-white/10">
        <div className="section-shell grid gap-12 py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center lg:py-24">
          <div>
            <p className="micro-label text-sky-300">Grade 12 Calculus and Vectors · Topic H</p>
            <h1 className="page-title mt-6 text-zinc-100">Lines and Planes</h1>
            <p className="page-lead mt-7">
              Learn how to represent, visualize, and solve lines and planes in R² and R³. Follow the lessons in order or open a tool when you need focused practice.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/lessons/line-equations" className="primary-action">Start Lesson 1</Link>
              <Link href="/visualizer" className="secondary-action">Open 3D Visualizer</Link>
            </div>
          </div>

          <aside className="border border-white/12 bg-[#101010]/95 p-6 sm:p-8" aria-labelledby="study-order-title">
            <p className="micro-label text-sky-300">Recommended study order</p>
            <h2 id="study-order-title" className="mt-3 text-2xl font-semibold tracking-tight">A clear route through Topic H</h2>
            <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {studyPath.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[32px_1fr] gap-3 py-4">
                  <span className="font-mono text-xs text-sky-300">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{step.title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{step.description}</p>
                    <Link href={step.href} className="mt-2 inline-block text-xs font-semibold text-sky-300 hover:text-sky-200">
                      {step.linkLabel}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="page-section section-shell" aria-labelledby="objectives-title">
        <div className="max-w-3xl">
          <p className="micro-label text-sky-300">Learning objectives</p>
          <h2 id="objectives-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What you will be able to do</h2>
        </div>
        <div className="mt-9 grid gap-px bg-white/10 md:grid-cols-2">
          {learningObjectives.map((objective) => (
            <article key={objective.code} className="bg-[#101010] p-6 sm:p-8">
              <p className="micro-label text-sky-300">{objective.code}</p>
              <h3 className="mt-4 text-xl font-semibold text-zinc-100">{objective.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{objective.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="section-shell page-section">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="micro-label text-sky-300">Course coverage</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Eight focused lessons</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Each topic has its own readable page with definitions, equation forms, checks, and a worked solution.</p>
            </div>
            <Link href="/lessons" className="secondary-action">View all lessons</Link>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {conceptModules.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="border border-white/10 bg-[#111] p-5 transition hover:border-sky-400/35 hover:bg-sky-400/[0.035]">
                <p className="micro-label text-sky-300">{lesson.index}</p>
                <h3 className="mt-4 text-base font-semibold text-zinc-200">{lesson.title}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{lesson.kicker}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
