import { VectorLab } from "@/components/vectors/VectorLab";

export const metadata = { title: "Interactive Visualizer | MCV4U Lines and Planes" };

export default async function VisualizerPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  return <VectorLab key={section ?? "default"} initialSection={section} />;
}
