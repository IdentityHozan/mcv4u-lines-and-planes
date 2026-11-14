import Link from "@/components/ui/SiteLink";
import { conceptModules } from "@/data/linesAndPlanesData";
import { courseUnits, sectionRange } from "@/data/courseUnits";

export default function HomePage() {
  const firstLesson = conceptModules[0];

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-3xl">
        <header className="py-14 sm:py-20">
          <p className="text-sm font-medium text-zinc-400">MCV4U Calculus and Vectors</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-6xl">Lines and Planes</h1>
          <Link href={firstLesson ? `/lessons/${firstLesson.id}` : "/lessons"} className="primary-action mt-6 rounded-md">
            Start learning
          </Link>
        </header>

        <section className="pb-14 sm:pb-20" aria-labelledby="course-units">
          <h2 id="course-units" className="text-lg font-semibold text-zinc-100">Course contents</h2>
          <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {courseUnits.map((unit) => (
              <li key={unit.id}>
                <Link
                  href={`/lessons#unit-${unit.id.replace(".", "-")}`}
                  className="group flex min-h-14 items-center justify-between gap-4 rounded-sm px-1 py-3 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 sm:px-2"
                >
                  <span className="font-medium">{unit.title}</span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-zinc-400">
                    <span>{sectionRange(unit.sections)}</span>
                    <span aria-hidden="true" className="text-base group-hover:text-sky-200">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
