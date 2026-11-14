import { unitForSection } from "@/data/courseUnits";
import type { HomeworkProblem } from "@/data/linesAndPlanesData";
import { recordingUrls } from "@/data/videoRecordings";

export function HomeworkReview({ section, review }: { section: string; review?: HomeworkProblem["review"] }) {
  const unit = unitForSection(section);
  if (!unit || !review) return null;
  const source = recordingUrls[unit.videoId];
  if (!source) return null;
  const [minutes, seconds] = review.time.split(":").map(Number);
  return (
    <p className="mt-3 text-sm leading-6 text-zinc-300">
      <a href={`${source}#t=${minutes * 60 + seconds}`} target="_blank" rel="noopener noreferrer" aria-label={`Review at ${review.time}, opens video in a new tab`} className="text-sky-200 underline decoration-sky-200/40 underline-offset-4 hover:text-white">Review at {review.time}</a>
      {`: ${review.topic}`}
    </p>
  );
}
