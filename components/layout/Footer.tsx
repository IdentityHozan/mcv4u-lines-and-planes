import { courseMeta } from "@/data/linesAndPlanesData";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090909] py-9">
      <div className="section-shell flex flex-col gap-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {courseMeta.courseCode} · Topic {courseMeta.topicCode} · {courseMeta.title}
        </p>
        <p>Grade 12 Calculus and Vectors learning portal</p>
      </div>
    </footer>
  );
}
