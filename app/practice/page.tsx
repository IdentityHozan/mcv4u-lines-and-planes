import Link from "next/link";
import { HomeworkModule } from "@/components/assessments/HomeworkModule";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Practice | MCV4U Lines and Planes" };

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Four homework sets"
        title="Practise with complete solutions"
        description="Work through lines, planes, intersections, and distance problems. Your completion state stays in this browser, and every problem includes a typed hint and walkthrough."
        actions={<><Link href="/lessons" className="secondary-action">Review lessons</Link><Link href="/assessments" className="primary-action">Go to quizzes</Link></>}
      />
      <section className="section-shell page-section"><HomeworkModule /></section>
    </>
  );
}
