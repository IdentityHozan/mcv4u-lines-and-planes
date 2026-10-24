import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Unit Tests | MCV4U Lines and Planes" };

export default async function TestsPage({ searchParams }: { searchParams: Promise<{ unit?: string }> }) {
  const { unit } = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Lines and Planes"
        title="Unit tests"
        description="Choose a unit."
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="tests" initialUnit={unit} /></ScrollReveal>
    </>
  );
}
