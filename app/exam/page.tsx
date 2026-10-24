import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Final Exam | MCV4U Lines and Planes" };

export default function ExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lines and Planes"
        title="Final examination"
        description="Sections 8.1 to 8.6 and 9.1 to 9.6."
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="exam" /></ScrollReveal>
    </>
  );
}
