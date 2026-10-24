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

  if (!playable) return <p className="py-6 text-base text-zinc-400">Video coming soon.</p>;
  return (
    <div>
      <div className="aspect-video overflow-hidden border border-white/10 bg-black">
        {mediaUrl ? <video ref={videoRef} controls preload="metadata" playsInline src={mediaUrl} className="h-full w-full" aria-label={lesson.title} /> : <iframe
          key={startAt}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startAt}&rel=0`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />}
      </div>
      <p className="mt-4 text-base text-zinc-300">{lesson.title}</p>
      {lesson.timestamps.length > 0 && <details className="mt-4 border-t border-white/10 pt-4">
        <summary className="cursor-pointer text-sm font-semibold text-zinc-400">Video chapters</summary>
        <div className="mt-3 grid gap-1 sm:grid-cols-2">{lesson.timestamps.map((timestamp) => <button key={timestamp.time} type="button" onClick={() => seek(timestamp.seconds)} className="min-h-11 px-3 py-2 text-left text-sm text-zinc-300 hover:text-sky-200"><span className="mr-3 font-mono text-sky-200">{timestamp.time}</span>{timestamp.label}</button>)}</div>
      </details>}
    </div>
  );
}
