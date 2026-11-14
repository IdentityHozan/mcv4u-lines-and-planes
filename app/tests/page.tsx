import { AssessmentHub } from "@/components/assessments/AssessmentHub";

export const metadata = { title: "Unit Tests | MCV4U Lines and Planes" };

export default async function TestsPage({ searchParams }: { searchParams: Promise<{ unit?: string; solution?: string }> }) {
  const { unit, solution } = await searchParams;
  return (
    <div className="section-shell py-8 sm:py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-zinc-100 sm:mb-8 sm:text-4xl">Unit tests</h1>
      <AssessmentHub variant="tests" initialUnit={unit} initialSolution={solution} />
    </div>
  );
}
