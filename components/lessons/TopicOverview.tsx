import { ArrowDownRight, Box, GitMerge, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { learningObjectives } from "@/data/linesAndPlanesData";

const objectiveIcons = [Box, ArrowDownRight, GitMerge, Ruler];

export function TopicOverview() {
  return (
    <section id="objectives" className="border-b border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
      <div className="section-shell">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="micro-label text-sky-300">Learning architecture</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Four moves. One spatial language.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Every lesson progresses from representation to reasoning, then closes with mathematical communication.
          </p>
        </div>
        <div className="grid border-l border-t border-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {learningObjectives.map((objective, index) => {
            const Icon = objectiveIcons[index];
            return (
              <motion.article
                key={objective.code}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
                className="min-h-56 border-b border-r border-white/10 p-6 transition hover:bg-white/[0.025]"
              >
                <div className="flex items-center justify-between">
                  <span className="micro-label text-zinc-600">{objective.code}</span>
                  <Icon size={18} className="text-sky-300" strokeWidth={1.5} />
                </div>
                <h3 className="mt-12 text-xl font-semibold">{objective.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{objective.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
