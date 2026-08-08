import { AdminPanel } from "@/components/admin/AdminPanel";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Lesson Admin | MCV4U Lines and Planes" };

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Content administration"
        title="Manage additional lessons"
        description="Create, edit, publish, and remove teacher-authored lessons. New lessons appear in the student lesson library without changing the source code."
      />
      <section className="section-shell page-section">
        <AdminPanel />
      </section>
    </>
  );
}
