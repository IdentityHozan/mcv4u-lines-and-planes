import Link from "next/link";
import { AssessmentHub } from "@/components/assessments/AssessmentHub";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Final Exam | MCV4U Lines and Planes" };

export default function ExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assessment stage 3"
        title="Final examination"
        description="A comprehensive 24-question paper covering lines, planes, intersections, angles, and distances. Complete the full examination before reviewing the worked solutions and marking criteria."
        actions={<Link href="/tests" className="secondary-action">Complete the unit tests first</Link>}
      />
      <ScrollReveal className="section-shell page-section"><AssessmentHub variant="exam" /></ScrollReveal>
    </>
  );
}
