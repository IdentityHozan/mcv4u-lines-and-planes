import Link from "@/components/ui/SiteLink";
import { conceptModules } from "@/data/linesAndPlanesData";
import { courseUnits, quizHref, testHref, sectionRange } from "@/data/courseUnits";

export const metadata = { title: "Lessons | MCV4U Lines and Planes" };

export default function LessonsPage() {
  return (
    <div className="section-shell py-9 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-9">
          <p className="text-sm text-zinc-400">MCV4U Lines and Planes</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Lessons</h1>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {courseUnits.map((unit) => {
            const id = `unit-${unit.id.replace(".", "-")}`;
            return (
              <section key={unit.id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4">
                <header className="mb-3">
                  <p className="text-sm text-zinc-400">Sections {sectionRange(unit.sections)}</p>
                  <h2 id={`${id}-title`} className="mt-1 text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">{unit.title}</h2>
                </header>

                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {conceptModules.filter((lesson) => unit.sections.includes(lesson.index)).map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="group grid min-h-14 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-sm px-1 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 sm:gap-4 sm:px-2"
                      >
                        <span className="text-sm tabular-nums text-zinc-400">{lesson.index}</span>
                        <span className="text-base leading-6 text-zinc-100 group-hover:text-sky-200">{lesson.title}</span>
                        <span aria-hidden="true" className="text-zinc-400 group-hover:text-sky-200">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <nav aria-label={`Assessments for ${unit.title}`} className="mt-4 flex flex-wrap gap-2">
                  <Link href={quizHref(unit.id)} aria-label={`Quiz ${unit.id}: ${unit.title}`} className="primary-action rounded-md">Quiz {unit.id}</Link>
                  <Link href={testHref(unit.id)} aria-label={`Test ${unit.id}: ${unit.title}`} className="secondary-action rounded-md">Test {unit.id}</Link>
                </nav>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
