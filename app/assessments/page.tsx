import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Quizzes | MCV4U Lines and Planes" };

export default function AssessmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assessment stage 1"
        title="Practice quizzes"
        description="Three focused papers with 12 questions each. Build confidence with theory, calculations, and written reasoning before moving on to the unit tests."
        actions={<><Link href="/lessons" className="secondary-action">Review the lessons</Link><Link href="/tests" className="primary-action">View unit tests</Link></>}
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="quizzes" /></ScrollReveal>
    </>
  );
}
