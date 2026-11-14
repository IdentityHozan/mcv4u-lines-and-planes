"use client";

import { useRef, useState } from "react";
import type { VideoLesson } from "@/data/linesAndPlanesData";

type VideoLessonPlayerProps = {
  lesson: VideoLesson;
  initialChapter?: VideoLesson["timestamps"][number];
  embedded?: boolean;
};

export function VideoLessonPlayer({ lesson, initialChapter, embedded = false }: VideoLessonPlayerProps) {
  const [startAt, setStartAt] = useState(initialChapter?.seconds ?? 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(initialChapter?.seconds ?? null);
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
    if (videoRef.current) {
      if (videoRef.current.readyState > 0) {
        videoRef.current.currentTime = seconds;
        pendingSeek.current = null;
      } else pendingSeek.current = seconds;
      void videoRef.current.play().catch(() => {});
    }
  };

  const timedMediaUrl = mediaUrl && initialChapter ? `${mediaUrl}#t=${initialChapter.seconds}` : mediaUrl;

  const openMediaUrl = mediaUrl && startAt ? `${mediaUrl}#t=${startAt}` : mediaUrl;

  if (!playable) return <p className="py-6 text-base text-zinc-400">Video coming soon.</p>;
  return (
    <div className={embedded ? "lesson-player" : undefined}>
      <div className="aspect-video overflow-hidden border border-white/10 bg-black">
        {mediaUrl ? <video ref={videoRef} controls preload="none" playsInline poster={`/course/videos/video-${Number(lesson.number)}.jpg`} src={timedMediaUrl} onLoadedMetadata={(event) => {
          if (pendingSeek.current !== null) {
            event.currentTarget.currentTime = pendingSeek.current;
            pendingSeek.current = null;
          }
        }} onError={(event) => {
          const fallback = timedMediaUrl.replace(/^\/media\//, "/course/videos/");
          if (fallback !== timedMediaUrl && !event.currentTarget.src.endsWith(fallback)) {
            pendingSeek.current = startAt;
            event.currentTarget.src = fallback;
          }
        }} className="h-full w-full" aria-label={lesson.title} /> : <iframe
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
      {embedded && <div className="lesson-chapters">
        <div className="lesson-chapters-header"><h2>Chapters</h2><span>{lesson.duration}</span></div>
        <ul aria-label="Video chapters">
          {lesson.timestamps.map((timestamp) => <li key={timestamp.time}>
            <button type="button" aria-current={startAt === timestamp.seconds ? "true" : undefined} onClick={() => seek(timestamp.seconds)}>
              <span className="lesson-chapter-time">{timestamp.time}</span>
              <span>{timestamp.label}</span>
            </button>
          </li>)}
        </ul>
        {mediaUrl && <a className="lesson-video-file" href={openMediaUrl}>Open video file</a>}
      </div>}
      {!embedded && initialChapter && <p className="mt-3 text-sm text-zinc-200"><strong>Start here:</strong> {initialChapter.label} at {initialChapter.time}</p>}
      {!embedded && mediaUrl && <a className="mt-3 inline-block text-sm font-semibold text-sky-200 hover:text-white" href={openMediaUrl}>Open video file</a>}
      {!embedded && lesson.timestamps.length > 0 && <details open className="mt-4 border-t border-white/10 pt-4">
        <summary className="cursor-pointer text-sm font-semibold text-zinc-400">Video chapters</summary>
        <div className="mt-3 grid gap-1 sm:grid-cols-2">{lesson.timestamps.map((timestamp) => <button key={timestamp.time} type="button" onClick={() => seek(timestamp.seconds)} className="min-h-11 px-3 py-2 text-left text-sm text-zinc-300 hover:text-sky-200"><span className="mr-3 font-mono text-sky-200">{timestamp.time}</span>{timestamp.label}</button>)}</div>
      </details>}
    </div>
  );
}
