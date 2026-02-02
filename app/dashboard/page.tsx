import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectList from "./ProjectList";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, name, slug, created_at, signups(id, email, source, created_at)",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="layout-container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
        <Link href="/dashboard/new" className="btn-primary">
          + New Project
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded bg-red-50 text-red-600 border border-red-100 mb-6">
          Error loading projects: {error.message}
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-lg bg-[var(--bg-secondary)]">
          <p className="text-[var(--text-secondary)] mb-4">
            You haven&apos;t created any tracking endpoints yet.
          </p>
          <Link href="/dashboard/new" className="btn-secondary">
            Create your first project
          </Link>
        </div>
      )}

      {projects && projects.length > 0 && <ProjectList projects={projects} />}
    </div>
  );
}
