import Link from "@/components/ui/SiteLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { VideoLessonPlayer } from "@/components/lessons/VideoLessonPlayer";
import { conceptModules, videoLessons } from "@/data/linesAndPlanesData";

export const metadata = { title: "Videos | MCV4U Lines and Planes" };

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ section?: string | string[] }> }) {
  const { section } = await searchParams;
  return <>
    <PageHeader eyebrow="Chapters 8 and 9" title="Instructional videos" description="Four complete recordings with captions, worked examples and diagrams. Use the written lessons and homework to practise each method." />
    <div className="section-shell py-9 sm:py-12">
      <nav aria-label="Video index" className="mb-10 flex flex-wrap gap-3">
        {videoLessons.map((video) => <a key={video.id} href={`#${video.id}`} className="secondary-action">Video {Number(video.number)}</a>)}
      </nav>
      {videoLessons.map((video) => <section key={video.id} id={video.id} className="scroll-mt-24 border-t border-white/15 py-9 sm:py-12" aria-labelledby={`${video.id}-title`}>
        <p className="micro-label text-sky-300">Video {Number(video.number)} <span className="ml-3 text-zinc-400">{video.duration}</span></p>
        <h2 id={`${video.id}-title`} className="mt-3 text-2xl font-semibold sm:text-3xl">{video.title}</h2>
        <p className="mb-5 mt-2 text-sm text-zinc-400">{video.description}</p>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <VideoLessonPlayer lesson={video} initialChapter={typeof section === "string" && video.sections?.includes(section) ? video.timestamps.find((item) => item.label.startsWith(`${section} `)) : undefined} />
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-100">Written lessons and homework</h3>
            <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
              {conceptModules.filter((lesson) => lesson.videoGroup === video.id).map((lesson) => <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block py-3 text-sm leading-6 text-sky-100 hover:text-white"><span className="mr-2 font-mono text-sky-300">{lesson.index}</span>{lesson.title}</Link>)}
            </div>
          </div>
        </div>
      </section>)}
    </div>
  </>;
}
