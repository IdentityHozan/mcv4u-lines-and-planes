import Link from "next/link";
import { HomeworkModule } from "@/components/assessments/HomeworkModule";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = { title: "Practice | MCV4U Lines and Planes" };

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="4 homework sets"
        title="Practise in a useful order"
        description="Begin with equation forms, then move to construction, intersections, and exact distance. Every problem includes a hint and full worked solution."
        actions={<><Link href="/lessons" className="secondary-action">Review lessons</Link><Link href="/assessments" className="primary-action">Go to quizzes</Link></>}
      />
      <ScrollReveal className="section-shell page-section"><HomeworkModule /></ScrollReveal>
    </>
  );
}
