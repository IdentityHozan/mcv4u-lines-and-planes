import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { VectorLab } from "@/components/vectors/VectorLab";

export const metadata = { title: "3D Visualizer | MCV4U Lines and Planes" };

export default function VisualizerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Interactive geometry lab"
        title="Experiment with lines and planes"
        description="Set line anchors, direction vectors, plane normals, constants, and the parameter t. Compare line-plane and plane-plane relationships in 3D."
        actions={<Link href="/lessons" className="secondary-action">Review the lessons</Link>}
      />
      <section className="section-shell page-section">
        <VectorLab />
      </section>
    </>
  );
}
