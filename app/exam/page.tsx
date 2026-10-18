import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Final Exam | MCV4U Lines and Planes" };

export default function ExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Final assessment"
        title="Bring every skill together"
        description="Complete 12 questions across all KATC categories. Written responses include clear criteria, student samples, and complete solutions."
        actions={<Link href="/assessments" className="secondary-action">Complete the quizzes first</Link>}
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="exam" /></ScrollReveal>
    </>
  );
}
