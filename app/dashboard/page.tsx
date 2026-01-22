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
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1>Your Projects</h1>
        <Link
          href="/dashboard/new"
          style={{
            padding: "10px 20px",
            backgroundColor: "#000",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Create Project
        </Link>
      </div>

      {error && (
        <p style={{ color: "red" }}>Error loading projects: {error.message}</p>
      )}

      {projects && projects.length === 0 && (
        <p style={{ color: "#666" }}>No projects yet. Create your first one!</p>
      )}

      {projects && projects.length > 0 && <ProjectList projects={projects} />}
    </div>
  );
}
