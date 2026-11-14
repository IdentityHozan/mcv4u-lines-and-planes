import { AssessmentHub } from "@/components/assessments/AssessmentHub";

export const metadata = { title: "Final Exam | MCV4U Lines and Planes" };

export default async function ExamPage({ searchParams }: { searchParams: Promise<{ solution?: string }> }) {
  const { solution } = await searchParams;
  return (
    <div className="section-shell py-8 sm:py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-zinc-100 sm:mb-8 sm:text-4xl">Final exam</h1>
      <AssessmentHub variant="exam" initialSolution={solution} />
    </div>
  );
}
