"use client";

import { useMemo, useRef, useState } from "react";
import type { ConceptModule, VideoLesson } from "@/data/linesAndPlanesData";
import { videoOneTeaching } from "@/data/videoOneTeaching";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { LessonDiagram } from "./LessonDiagram";
import { LineTeachingDemo } from "./LineTeachingDemo";
import { VideoLessonPlayer } from "./VideoLessonPlayer";

type NotebookPage = {
  id: string;
  title: string;
  explanation?: string;
  given?: string;
  formula?: string;
  steps: Array<{ label?: string; text: string; math?: string }>;
  demo?: "given" | "triangle" | "parameter" | "two-points" | "space";
  diagram?: boolean;
  practice?: boolean;
  questionOnly?: boolean;
};

function sectionPages(lesson: ConceptModule): NotebookPage[] {
  const lecture = videoOneTeaching.filter((page) => page.section === lesson.index && !page.title.startsWith("Homework"));
  if (lecture.length) return lecture;
  return [
    { id: "idea", title: "The idea", explanation: lesson.instruction.idea, diagram: true, steps: lesson.derivation?.length ? lesson.derivation : lesson.instruction.steps.map((text) => ({ text })) },
    ...(lesson.derivation?.length ? [{ id: "method", title: "Method", steps: lesson.instruction.steps.map((text) => ({ text })) }] : []),
    { id: "equations", title: "Equations", steps: lesson.equations.map((equation) => ({ label: equation.label, text: equation.note, math: equation.math })) },
    { id: "example", title: "Worked example", given: lesson.workedExample.prompt, steps: [...lesson.workedExample.steps, { label: "Answer", text: lesson.workedExample.conclusion }] },
    ...(lesson.extraExamples ?? []).map((example, index) => ({ id: `example-${index}`, title: example.title, given: example.prompt, steps: [...example.steps, { label: "Answer", text: example.conclusion }] })),
    { id: "check", title: "Check your work", explanation: lesson.instruction.commonMistake, steps: lesson.keyChecks.map((text) => ({ text })) },
  ];
}

export function LessonNotebook({ lesson, video }: { lesson: ConceptModule; video: VideoLesson | null }) {
  const pages = useMemo(() => sectionPages(lesson), [lesson]);
  const [format, setFormat] = useState<"lesson" | "video">("lesson");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [working, setWorking] = useState("");
  const board = useRef<HTMLDivElement>(null);
  const page = pages[index];
  function changePage(next: number) {
    setIndex(Math.max(0, Math.min(pages.length - 1, next)));
    setRevealed(0);
    setWorking("");
    board.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <section aria-label={`Lesson ${lesson.index}`}>
      <div role="tablist" aria-label="Lesson format" className="flex gap-7 border-b border-white/15">
        {(["lesson", ...(video ? ["video"] : [])] as Array<"lesson" | "video">).map((tab) => <button key={tab} type="button" role="tab" id={`tab-${tab}`} aria-controls={`panel-${tab}`} aria-selected={format === tab} onClick={() => setFormat(tab)} className={`min-h-12 border-b-2 pb-3 text-base font-semibold ${format === tab ? "border-sky-300 text-sky-200" : "border-transparent text-zinc-400 hover:text-zinc-100"}`}>{tab === "lesson" ? "Lesson" : "Video"}</button>)}
      </div>
      {format === "video" && video ? <div role="tabpanel" id="panel-video" aria-labelledby="tab-video" className="pt-7"><VideoLessonPlayer lesson={video} /></div> : <div role="tabpanel" id="panel-lesson" aria-labelledby="tab-lesson" className="pt-7">
        <div ref={board} className="scroll-mt-24 border border-white/15 bg-[#0e0e0e]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <label className="min-w-0 flex-1"><span className="sr-only">Lesson topic</span><select aria-label="Lesson topic" value={index} onChange={(event) => changePage(Number(event.target.value))} className="w-full min-w-0 border border-white/15 bg-[#111] px-3 py-2 text-base text-zinc-200 sm:max-w-xl">{pages.map((item, n) => <option key={item.id} value={n}>{n + 1}. {item.title}</option>)}</select></label>
            <p className="shrink-0 text-sm tabular-nums text-zinc-400">{index + 1} / {pages.length}</p>
          </div>
          <div key={page.id} className="p-5 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{page.title}</h2>
            <div className={`mt-5 ${page.demo || page.diagram ? "grid gap-8 lg:grid-cols-2 lg:items-start" : "max-w-4xl"}`}>
              <div className="min-w-0">
                {page.explanation && <MathJaxRenderer math={page.explanation} className="text-base leading-8 text-zinc-300" />}
                {page.given && <MathJaxRenderer math={page.given} className="mt-5 text-lg leading-8 text-zinc-100" />}
                {page.formula && <MathJaxRenderer math={page.formula} className="mt-5 text-xl text-sky-200" />}
                {page.practice && <label className="mt-6 block text-sm text-zinc-400">Your working<textarea aria-label="Your working" value={working} onChange={(event) => setWorking(event.target.value)} className="mt-2 min-h-24 w-full resize-y border border-white/15 bg-transparent p-3 text-base leading-7 text-zinc-100" /></label>}
                <div className="mt-6 space-y-6" aria-live="polite">
                  {page.steps.slice(0, revealed).map((step, n) => <div key={`${page.id}-${n}`} className="teaching-working-step border-l-2 border-sky-300/40 pl-4">
                    {step.label && <MathJaxRenderer math={step.label} className="mb-2 text-base font-semibold text-zinc-100" />}
                    <MathJaxRenderer math={step.text} className="text-base leading-8 text-zinc-300" />
                    {step.math && step.math !== page.given && <MathJaxRenderer math={step.math} className="mt-3 text-lg leading-8 text-sky-100" />}
                  </div>)}
                </div>
                {(page.questionOnly || revealed < page.steps.length || revealed > 0) && <div className="mt-7 flex flex-wrap items-center gap-4">
                  {page.questionOnly ? <button type="button" onClick={() => changePage(index + 1)} className="primary-action">Show solution</button> : revealed < page.steps.length && <button type="button" onClick={() => setRevealed((count) => count + 1)} className="primary-action">{revealed === 0 ? "Show working" : "Next step"}</button>}
                  {revealed > 0 && <button type="button" onClick={() => setRevealed(0)} className="text-sm font-semibold text-zinc-400 hover:text-zinc-100">Hide working</button>}
                </div>}
              </div>
              {page.demo ? <LineTeachingDemo key={page.id} mode={page.demo} /> : page.diagram ? <LessonDiagram lessonId={lesson.id} /> : null}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-7">
            <button type="button" disabled={index === 0} onClick={() => changePage(index - 1)} className="min-h-11 px-2 text-sm font-semibold text-zinc-300 hover:text-sky-200 disabled:cursor-default disabled:opacity-30">Previous topic</button>
            {index < pages.length - 1 ? <button type="button" onClick={() => changePage(index + 1)} className="min-h-11 px-2 text-sm font-semibold text-sky-200 hover:text-sky-100">Next topic</button> : <a href="#homework" className="min-h-11 px-2 py-3 text-sm font-semibold text-sky-200 hover:text-sky-100">Homework {lesson.index}</a>}
          </div>
        </div>
      </div>}
    </section>
  );
}
