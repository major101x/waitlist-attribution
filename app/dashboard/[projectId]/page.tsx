import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import LinkHelper from "./LinkHelper";

interface Props {
  params: Promise<{ projectId: string }>;
}

interface SourceCount {
  source: string;
  count: number;
}

interface Signup {
  id: string;
  email: string;
  source: string;
  created_at: string;
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

  // Fetch signups with all fields for display
  const { data: signups } = await supabase
    .from("signups")
    .select("id, email, source, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

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

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="layout-container py-12">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 inline-block font-mono"
      >
        ← Back to Projects
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="font-mono text-sm text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded">
          {totalCount} total signups
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* The Link Helper */}
          <LinkHelper slug={project.slug} />

          {/* Attribution Table */}
          <div>
            <h2 className="text-lg font-bold mb-4">Attribution List</h2>
            {signups && signups.length > 0 ? (
              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--bg-secondary)] border-b border-[var(--color-border)]">
                    <tr>
                      <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">
                        Email
                      </th>
                      <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">
                        Source
                      </th>
                      <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {(signups as Signup[]).map((signup) => (
                      <tr
                        key={signup.id}
                        className="hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-[var(--text-primary)]">
                          {signup.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`badge ${
                              signup.source === "twitter"
                                ? "badge-twitter"
                                : signup.source === "linkedin"
                                  ? "badge-linkedin"
                                  : signup.source === "direct"
                                    ? "badge-direct"
                                    : "badge-source"
                            }`}
                          >
                            {signup.source || "direct"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-tertiary)]">
                          {formatDate(signup.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-lg">
                <p className="text-[var(--text-secondary)]">
                  No signups yet. Share your link to start tracking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              Top Sources
            </h3>
            {sourceBreakdown.length > 0 ? (
              <ul className="space-y-3">
                {sourceBreakdown.map(({ source, count }) => (
                  <li
                    key={source}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${source === "twitter" ? "bg-[#1d9bf0]" : "bg-[var(--text-tertiary)]"}`}
                      />
                      <span className="capitalize">{source}</span>
                    </div>
                    <span className="font-mono font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)]">
                No data yet.
              </p>
            )}
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)] border border-[var(--color-border)]">
            <h3 className="text-sm font-semibold mb-2">Pro Tip</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              You can add{" "}
              <code className="bg-[var(--bg-primary)] px-1 rounded border border-[var(--color-border)]">
                ?src=anything
              </code>{" "}
              to your URL to track specific campaigns or newsletters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
