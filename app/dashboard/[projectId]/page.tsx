import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ projectId: string }>;
}

interface SourceCount {
  source: string;
  count: number;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch project (RLS ensures only owner can read)
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, slug")
    .eq("id", projectId)
    .single();

  // If project not found or doesn't belong to user, 404
  if (projectError || !project) {
    notFound();
  }

  // Fetch signups for aggregation
  const { data: signups } = await supabase
    .from("signups")
    .select("source")
    .eq("project_id", projectId);

  // Calculate total count
  const totalCount = signups?.length || 0;

  // Calculate source breakdown
  const sourceMap = new Map<string, number>();
  signups?.forEach((signup) => {
    const source = signup.source || "direct";
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });

  // Sort by count descending
  const sourceBreakdown: SourceCount[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <Link href="/dashboard" style={{ color: "#666", textDecoration: "none" }}>
        ← Back to Dashboard
      </Link>

      <h1 style={{ marginTop: "24px", marginBottom: "8px" }}>{project.name}</h1>

      <p style={{ color: "#666", marginBottom: "32px" }}>
        Public URL:{" "}
        <code
          style={{
            backgroundColor: "#f5f5f5",
            color: "#000",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          /p/{project.slug}
        </code>
      </p>

      <div
        style={{
          padding: "24px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#666" }}>
          Total Signups
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "48px",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          {totalCount}
        </p>
      </div>

      <div>
        <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>
          Signups by Source
        </h2>
        {sourceBreakdown.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sourceBreakdown.map(({ source, count }) => (
              <li
                key={source}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "16px",
                }}
              >
                <span>{source}</span>
                <span style={{ fontWeight: "bold" }}>{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#999" }}>No signups yet</p>
        )}
      </div>
    </div>
  );
}
