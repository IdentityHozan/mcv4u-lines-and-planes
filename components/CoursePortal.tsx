"use client";

import { ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { HomeworkModule } from "@/components/assessments/HomeworkModule";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TextMaterial } from "@/components/lessons/TextMaterial";
import { TopicOverview } from "@/components/lessons/TopicOverview";
import { VideoLessonPlayer } from "@/components/lessons/VideoLessonPlayer";
import { Badge } from "@/components/ui/Badge";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { VectorCalculator } from "@/components/vectors/VectorCalculator";
import { VectorLab } from "@/components/vectors/VectorLab";
import { courseMeta, videoLessons } from "@/data/linesAndPlanesData";

export function CoursePortal() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} />
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pt-16 lg:pl-64">
        <section id="overview" className="industrial-grid relative min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute -right-40 top-24 h-[440px] w-[440px] rounded-full bg-sky-400/[0.055] blur-[110px]" />
          <div className="section-shell flex min-h-[calc(100vh-4rem)] flex-col justify-center py-20 sm:py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
              className="grid items-end gap-14 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]"
            >
              <div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.55 }}
                  className="mb-8 flex flex-wrap items-center gap-3"
                >
                  <Badge tone="accent">Topic {courseMeta.topicCode}</Badge>
                  <span className="micro-label text-zinc-500">{courseMeta.eyebrow}</span>
                </motion.div>

                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-4xl text-[clamp(3.3rem,8vw,7.8rem)] font-semibold leading-[0.88] tracking-[-0.065em]"
                >
                  Lines meet.
                  <span className="block text-zinc-600">Planes resolve.</span>
                </motion.h1>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.55 }}
                  className="mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8"
                >
                  {courseMeta.summary} This is a complete Topic H studio for visual learning,
                  deliberate practice, and KATC-ready assessment.
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.55 }}
                  className="mt-10 flex flex-col gap-3 sm:flex-row"
                >
                  <a
                    href="#spatial-lab"
                    className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#f5f5f5] px-5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-sky-300"
                  >
                    Enter the spatial lab
                    <ArrowDownRight size={16} className="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </a>
                  <a
                    href="#objectives"
                    className="inline-flex min-h-12 items-center justify-center border border-white/15 bg-black/20 px-5 text-sm font-semibold text-zinc-300 transition hover:border-sky-400/45 hover:text-sky-300"
                  >
                    View learning map
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="border-l border-white/10 pl-6 sm:pl-8"
              >
                <p className="micro-label text-zinc-500">Anchor relationship</p>
                <MathJaxRenderer
                  math="\[\vec r=\vec r_0+t\vec d\qquad \vec n\cdot(\vec r-\vec r_0)=0\]"
                  className="mt-5 text-lg text-sky-300 sm:text-xl"
                  ariaLabel="Vector equation of a line and point-normal equation of a plane"
                />
                <div className="mt-10 grid grid-cols-3 border-y border-white/10">
                  {courseMeta.metrics.map((metric, index) => (
                    <div key={metric.label} className={`py-5 ${index > 0 ? "border-l border-white/10 pl-4" : "pr-4"}`}>
                      <p className="font-mono text-2xl font-medium text-zinc-100">{metric.value}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-5 text-zinc-600">
                  Built for Ontario Grade 12 · Topic H only · Fully typed solutions
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <TopicOverview />

        <section id="spatial-lab" className="py-20 sm:py-24">
          <div className="section-shell">
            <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div>
                <p className="micro-label text-sky-300">Module 01 · Visualization</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  Change the algebra. Watch the geometry respond.
                </h2>
              </div>
              <p className="text-sm leading-7 text-zinc-500 lg:justify-self-end lg:text-right">
                The white point is the line anchor. The blue point tracks <span className="font-mono text-zinc-300">t</span>.
                The blue arrow is the plane&apos;s normal vector.
              </p>
            </div>
            <VectorLab />
          </div>
        </section>

        <section id="video-lessons" className="border-y border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
          <div className="section-shell">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.65fr] md:items-end">
              <div>
                <p className="micro-label text-sky-300">Module 02 · Instruction</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Watch the forms become geometry.</h2>
              </div>
              <p className="text-sm leading-7 text-zinc-500 md:text-right">
                Two full-length lessons with chapter navigation and a focused takeaway layer.
              </p>
            </div>
            <div className="space-y-6">
              {videoLessons.map((lesson) => <VideoLessonPlayer key={lesson.id} lesson={lesson} />)}
            </div>
          </div>
        </section>

        <section id="theory" className="py-20 sm:py-24">
          <div className="section-shell">
            <TextMaterial />
          </div>
        </section>

        <section id="calculator" className="border-y border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
          <div className="section-shell">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.65fr] md:items-end">
              <div>
                <p className="micro-label text-sky-300">Module 04 · Computation</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Check the relationship, not just the answer.</h2>
              </div>
              <p className="text-sm leading-7 text-zinc-500 md:text-right">
                Explore exact line-plane classifications and point-to-line distance with live numeric inputs.
              </p>
            </div>
            <VectorCalculator />
          </div>
        </section>

        <section id="homework" className="py-20 sm:py-24">
          <div className="section-shell">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.65fr] md:items-end">
              <div>
                <p className="micro-label text-sky-300">Module 05 · Deliberate practice</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Four sets. Twelve complete solutions.</h2>
              </div>
              <p className="text-sm leading-7 text-zinc-500 md:text-right">
                Hints preserve productive struggle. Fully typed walkthroughs make every vector step auditable.
              </p>
            </div>
            <HomeworkModule />
          </div>
        </section>

        <section id="assessments" className="border-t border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
          <div className="section-shell">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.65fr] md:items-end">
              <div>
                <p className="micro-label text-sky-300">Modules 06–07 · Assessment</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Test the model. Then inspect the reasoning.</h2>
              </div>
              <p className="text-sm leading-7 text-zinc-500 md:text-right">
                Three instant-feedback quizzes plus one comprehensive exam, explicitly tagged across KATC.
              </p>
            </div>
            <AssessmentHub />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
