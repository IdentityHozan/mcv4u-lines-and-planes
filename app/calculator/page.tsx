import { VectorWorkbench } from "@/components/vectors/VectorWorkbench";
export const metadata = { title: "Lines and Planes Calculator | MCV4U Lines and Planes" };
export default async function CalculatorPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  return <VectorWorkbench key={section ?? "default"} initialSection={section} />;
}
