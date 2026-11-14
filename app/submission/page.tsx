import Link from "@/components/ui/SiteLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { conceptModules, finalExam, homeworkSets, quizzes, tests, videoLessons } from "@/data/linesAndPlanesData";

export const metadata = { title: "Submission guide | MCV4U Lines and Planes" };

export default function SubmissionPage() {
  const homeworkCount = homeworkSets.reduce((count, set) => count + set.problems.length, 0);
  const assessmentCount = [...quizzes, ...tests, finalExam].reduce((count, paper) => count + paper.questions.length, 0);
  const checks = [
    { name: "Video lesson content", marks: 15, text: "The four recordings cover Sections 8.1 to 9.6. Each links to the corresponding written lessons. Worked mathematics and section changes were spot-checked.", href: "/videos", link: "Open videos" },
    { name: "Web page sequencing and content", marks: 15, text: `${conceptModules.length} written lessons follow the classroom sequence: lines, planes, intersections and distances. Each teaches the concept, demonstrates it, and links to its homework.`, href: "/lessons", link: "Open lessons" },
    { name: "Homework", marks: 10, text: `${homeworkSets.length} section homework sets and ${homeworkCount} problems cover the complete unit. Each problem has a hint and a typed worked solution.`, href: "/practice", link: "Open homework" },
    { name: "Effectiveness", marks: 10, text: "Worked examples, captions, diagrams and the interactive visualizer support the written explanations.", href: "/visualizer", link: "Open visualizer" },
    { name: "Organization", marks: 10, text: "Section links connect videos, lessons, homework, quizzes and tests. The course PDF provides a printable copy.", href: "/resources", link: "Open resources" },
    { name: "Delivery and timing", marks: 10, text: `The four runtimes are ${videoLessons.map(({ duration }) => duration).join(", ")}. Each exceeds the eight-minute minimum. The teacher assesses pacing, clarity and delivery.`, href: "/videos", link: "Review recordings" },
    { name: "Assessments", marks: 20, text: `${quizzes.length} quizzes, ${tests.length} tests and a separate final exam provide ${assessmentCount} questions. Each paper includes K, A, T and C, with typed worked solutions and criteria for written responses. Model answers are labelled as such.`, href: "/assessments", link: "Open assessments" },
    { name: "Conference", marks: 10, text: "The teacher assesses progress and feedback during the conference. Live presentation, team contribution and any authentic student work are separate evidence.", href: "", link: "" },
  ];
  return <>
    <PageHeader eyebrow="Course culminating task" title="Submission guide" description="Where to find the evidence for each rubric criterion." />
    <section className="section-shell py-10 sm:py-12">
      <a className="primary-action mb-8" href="/course/website.pdf" download="MCV4U_Lines_and_Planes_Website.pdf">Download website PDF</a>
      <dl className="divide-y divide-white/10 border-y border-white/15">
        {checks.map((item) => <div key={item.name} className="grid gap-2 py-5 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
          <dt className="font-semibold text-zinc-100">{item.name} <span className="whitespace-nowrap pl-1 text-sm text-sky-300">/{item.marks}</span></dt>
          <dd className="max-w-3xl text-zinc-300">{item.text}{item.href && <Link href={item.href} className="mt-2 block w-fit text-sm font-semibold text-sky-200 hover:text-white">{item.link}</Link>}</dd>
        </div>)}
      </dl>
    </section>
  </>;
}
