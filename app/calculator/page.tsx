import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { VectorCalculator } from "@/components/vectors/VectorCalculator";

export const metadata = { title: "Vector Calculator | MCV4U Lines and Planes" };

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Exact relationship solver"
        title="Check an intersection or distance"
        description="Calculate line-plane intersections, point-line distance, point-plane distance, and the intersection of two planes."
        actions={<Link href="/visualizer" className="secondary-action">Compare in 3D</Link>}
      />
      <section className="section-shell page-section"><VectorCalculator /></section>
    </>
  );
}
