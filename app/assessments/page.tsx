import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Quizzes | MCV4U Lines and Planes" };

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<{ unit?: string }> }) {
  const { unit } = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Lines and Planes"
        title="Quizzes"
        description="Choose a unit."
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="quizzes" initialUnit={unit} /></ScrollReveal>
    </>
  );
}
