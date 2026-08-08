import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { VectorCalculator } from "@/components/vectors/VectorCalculator";

export const metadata = { title: "Vector Calculator | MCV4U Topic H" };

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Exact relationship solver"
        title="Check an intersection or distance"
        description="Enter your own vectors to classify a line–plane relationship or calculate the perpendicular distance from a point to a line."
        actions={<Link href="/visualizer" className="secondary-action">Compare in 3D</Link>}
      />
      <section className="section-shell page-section"><VectorCalculator /></section>
    </>
  );
}
