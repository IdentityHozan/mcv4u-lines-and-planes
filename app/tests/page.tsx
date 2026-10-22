import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Unit Tests | MCV4U Lines and Planes" };

export default function TestsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assessment stage 2"
        title="Unit tests"
        description="Two 16-question papers for independent practice. Apply your knowledge, show complete working, and explain your conclusions before attempting the final examination."
        actions={<><Link href="/assessments" className="secondary-action">Review the quizzes</Link><Link href="/exam" className="primary-action">View final examination</Link></>}
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="tests" /></ScrollReveal>
    </>
  );
}
