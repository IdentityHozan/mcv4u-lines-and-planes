import { HomeworkModule } from "@/components/assessments/HomeworkModule";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Homework | MCV4U Lines and Planes" };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Lines and Planes"
        title="Homework"
        description="Choose a section."
      />
      <ScrollReveal className="section-shell page-section"><HomeworkModule initialSection={section} /></ScrollReveal>
    </>
  );
}
