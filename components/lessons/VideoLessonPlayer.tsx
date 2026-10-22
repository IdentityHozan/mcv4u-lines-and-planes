"use client";

import { useRef, useState } from "react";
import type { VideoLesson } from "@/data/linesAndPlanesData";

type VideoLessonPlayerProps = {
  lesson: VideoLesson;
};

export function VideoLessonPlayer({ lesson }: VideoLessonPlayerProps) {
  const [startAt, setStartAt] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = lesson.videoUrl || lesson.sourceUrl;
  let youtubeId = lesson.youtubeId;
  let mediaUrl = "";
  if (source) {
    try {
      const url = new URL(source, "https://course.local");
      if (url.protocol === "https:" || url.protocol === "http:") {
        const host = url.hostname.replace(/^www\./, "");
        if (host === "youtu.be") youtubeId = url.pathname.slice(1).split("/")[0];
        else if (host === "youtube.com" || host === "youtube-nocookie.com") youtubeId = url.searchParams.get("v") || url.pathname.split("/")[2] || "";
        else if (/\.(mp4|webm)(\?|$)/i.test(url.pathname)) mediaUrl = source;
      }
    } catch {}
  }
  const playable = /^[\w-]{11}$/.test(youtubeId) || Boolean(mediaUrl);
  const seek = (seconds: number) => {
    setStartAt(seconds);
    if (videoRef.current) videoRef.current.currentTime = seconds;
  };

  return (
    <article className="overflow-hidden border border-white/10 bg-[#111]">
      {playable ? <div className="aspect-video bg-black">
        {mediaUrl ? <video ref={videoRef} controls preload="metadata" playsInline src={mediaUrl} className="h-full w-full" aria-label={lesson.title} /> : (
        <iframe
          key={startAt}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startAt}&rel=0`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
        )}
      </div> : <div className="border-b border-white/10 bg-[#0c0c0c] p-6 sm:p-8">
        <p className="text-sm font-semibold text-sky-200">Class recording pending</p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">The teaching team has not added this recording yet. The written lesson and worked examples are available below.</p>
      </div>}
      <div className="grid lg:grid-cols-[1fr_300px]">
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">{lesson.duration}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{lesson.title}</h3>
          <p className="mt-3 text-base leading-7 text-zinc-300">{lesson.description}</p>
          <details className="mt-5 border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Learning objectives</summary>
            <ol className="mt-4 space-y-3">
              {lesson.takeaways.map((takeaway, index) => (
                <li key={takeaway} className="grid grid-cols-[24px_1fr] gap-3 text-base leading-7 text-zinc-300">
                  <span className="font-mono text-sm text-sky-300">{index + 1}</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
        <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
          <details open={playable}>
          <summary className="cursor-pointer text-sm font-semibold text-zinc-200">{playable ? "Video chapters" : "Planned coverage"}</summary>
          <div className="mt-4 space-y-1">
            {lesson.timestamps.map((timestamp) => (
              <button
                type="button"
                key={timestamp.time}
                onClick={() => seek(timestamp.seconds)}
                disabled={!playable}
                aria-pressed={startAt === timestamp.seconds}
                className={`grid w-full grid-cols-[48px_1fr] gap-3 border px-3 py-3 text-left text-sm leading-6 transition ${
                  startAt === timestamp.seconds
                    ? "border-sky-400/35 bg-sky-400/[0.06] text-zinc-200"
                    : "border-transparent text-zinc-300 hover:border-white/10 hover:text-zinc-100"
                }`}
              >
                <span className="font-mono text-xs leading-6 text-sky-300">{timestamp.time}</span>
                <span>{timestamp.label}</span>
              </button>
            ))}
          </div>
          {source && playable && <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block border-t border-white/10 pt-4 text-xs font-semibold text-zinc-400 transition hover:text-sky-300"
          >
            Open recording
          </a>}
          </details>
        </div>
      </div>
    </article>
  );
}
