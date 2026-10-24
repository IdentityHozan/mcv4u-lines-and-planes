import Link from "@/components/ui/SiteLink";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { conceptModules } from "@/data/linesAndPlanesData";
import { courseUnits, quizHref, testHref, sectionRange } from "@/data/courseUnits";

export const metadata = { title: "Lessons | MCV4U Lines and Planes" };

export default function LessonsPage() {
  return (
    <>
      <header className="border-b border-white/10">
        <div className="section-shell py-9 sm:py-12">
          <p className="micro-label text-sky-300">Lines and Planes</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Lessons</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">Choose a section, study the lesson, then complete its homework.</p>
        </div>
      </header>

      <div className="section-shell py-10 sm:py-14">
        {courseUnits.map((unit, unitIndex) => (
          <ScrollReveal key={unit.id} className={unitIndex > 0 ? "mt-12" : ""}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl"><span className="mr-3 text-sky-200">Unit {unit.id}</span>{unit.title}</h2>
              <p className="text-sm text-zinc-400">Sections {sectionRange(unit.sections)}</p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/15">
              {conceptModules.filter((lesson) => unit.sections.includes(lesson.index)).map((lesson) => (
                <article key={lesson.id} className="grid grid-cols-[3rem_1fr] items-center gap-x-3 gap-y-3 py-5 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-5">
                  <p className="font-mono text-sm text-sky-300">{lesson.index}</p>
                  <h3 className="text-base font-medium leading-7 text-zinc-100 sm:text-lg">{lesson.title}</h3>
                  <Link href={`/lessons/${lesson.id}`} className="col-start-2 w-fit text-sm font-semibold text-sky-200 hover:text-white sm:col-start-auto" aria-label={`Open lesson ${lesson.index}: ${lesson.title}`}>Open lesson</Link>
                </article>
              ))}
            </div>
            <div className="mt-4 flex gap-6 text-sm font-semibold text-zinc-300">
              <Link href={quizHref(unit.id)} className="hover:text-sky-200">Quiz {unit.id}</Link>
              <Link href={testHref(unit.id)} className="hover:text-sky-200">Test {unit.id}</Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
