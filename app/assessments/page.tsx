import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Quizzes | MCV4U Topic H" };

export default function AssessmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Three interactive quizzes"
        title="Check each group of skills"
        description="Choose an answer, receive immediate feedback, and open the complete reasoning. Every question is explicitly tagged by KATC learning category."
        actions={<><Link href="/practice" className="secondary-action">Return to practice</Link><Link href="/exam" className="primary-action">View final exam</Link></>}
      />
      <section className="section-shell page-section"><AssessmentHub variant="quizzes" /></section>
    </>
  );
}
