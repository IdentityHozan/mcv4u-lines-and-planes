import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Final Exam | MCV4U Lines and Planes" };

export default function ExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lines and Planes final assessment"
        title="Demonstrate complete understanding"
        description="Complete all questions before submitting. The exam covers Knowledge, Application, Thinking, and Communication with a full solution walkthrough for every item."
        actions={<Link href="/assessments" className="secondary-action">Complete the quizzes first</Link>}
      />
      <section className="section-shell page-section"><AssessmentHub variant="exam" /></section>
    </>
  );
}
