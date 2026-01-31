import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SignupForm from "./SignupForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicSignupPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Server-side: resolve slug to project
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("slug", slug)
    .single();

  // If project not found, return 404
  if (error || !project) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "8px" }}>{project.name}</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Sign up to get updates
      </p>
      <SignupForm projectId={project.id} />
    </div>
  );
}
