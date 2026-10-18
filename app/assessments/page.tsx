import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Quizzes | MCV4U Lines and Planes" };

export default function AssessmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="3 quizzes"
        title="Check your understanding"
        description="Each quiz combines multiple-choice and written-response questions. Compare every answer with complete reasoning and a student sample."
        actions={<><Link href="/practice" className="secondary-action">Return to practice</Link><Link href="/exam" className="primary-action">View final exam</Link></>}
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="quizzes" /></ScrollReveal>
    </>
  );
}
