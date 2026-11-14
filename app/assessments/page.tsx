import { AssessmentHub } from "@/components/assessments/AssessmentHub";

export const metadata = { title: "Quizzes | MCV4U Lines and Planes" };

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<{ unit?: string; solution?: string }> }) {
  const { unit, solution } = await searchParams;
  return (
    <div className="section-shell py-8 sm:py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-zinc-100 sm:mb-8 sm:text-4xl">Quizzes</h1>
      <AssessmentHub variant="quizzes" initialUnit={unit} initialSolution={solution} />
    </div>
  );
}
