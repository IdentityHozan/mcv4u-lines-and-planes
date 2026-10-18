"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { VideoLesson } from "@/data/linesAndPlanesData";

type VideoLessonPlayerProps = {
  lesson: VideoLesson;
};

export function VideoLessonPlayer({ lesson }: VideoLessonPlayerProps) {
  const [startAt, setStartAt] = useState(0);

  return (
    <article className="overflow-hidden border border-white/10 bg-[#111]">
      <div className="aspect-video bg-black">
        <iframe
          key={startAt}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?start=${startAt}&rel=0`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="grid lg:grid-cols-[1fr_250px]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Lesson {lesson.number}</Badge>
            <Badge>{lesson.duration}</Badge>
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">{lesson.title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-500">{lesson.description}</p>
          <ol className="mt-6 space-y-3 border-t border-white/10 pt-5">
            {lesson.takeaways.map((takeaway, index) => (
              <li key={takeaway} className="grid grid-cols-[28px_1fr] gap-3 text-sm leading-6 text-zinc-400">
                <span className="font-mono text-xs text-sky-300">{String(index + 1).padStart(2, "0")}</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
          <p className="micro-label text-zinc-500">Video chapters</p>
          <div className="mt-4 space-y-1">
            {lesson.timestamps.map((timestamp) => (
              <button
                type="button"
                key={timestamp.time}
                onClick={() => setStartAt(timestamp.seconds)}
                className={`grid w-full grid-cols-[48px_1fr] gap-3 border px-3 py-3 text-left text-xs transition ${
                  startAt === timestamp.seconds
                    ? "border-sky-400/35 bg-sky-400/[0.06] text-zinc-200"
                    : "border-transparent text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <span className="font-mono text-[10px] text-sky-300">{timestamp.time}</span>
                <span>{timestamp.label}</span>
              </button>
            ))}
          </div>
          <a
            href={lesson.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block border-t border-white/10 pt-4 text-xs font-semibold text-zinc-400 transition hover:text-sky-300"
          >
            Watch on {lesson.creator}&apos;s YouTube channel
          </a>
        </div>
      </div>
    </article>
  );
}
