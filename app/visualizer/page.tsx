import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { VectorLab } from "@/components/vectors/VectorLab";

export const metadata = { title: "3D Visualizer | MCV4U Topic H" };

export default function VisualizerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Interactive geometry lab"
        title="Experiment with lines and planes"
        description="Manipulate line anchors, direction vectors, plane normals, constants, and the parameter t. The scene and relationship analysis update immediately."
        actions={<Link href="/lessons" className="secondary-action">Review the lessons</Link>}
      />
      <section className="section-shell page-section">
        <VectorLab />
      </section>
    </>
  );
}
