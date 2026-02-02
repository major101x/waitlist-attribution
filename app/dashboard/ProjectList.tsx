"use client";

import Link from "next/link";

// Simple helper if date-fns not available
function timeAgo(dateString: string | null) {
  if (!dateString) return "unknown time";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface Signup {
  id: string;
  email: string;
  source: string;
  created_at: string | null;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
  signups: Signup[];
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4">
      {projects.map((project) => {
        // Sort signups to get latest
        const sortedSignups = [...project.signups].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        const lastSignup = sortedSignups[0];

        return (
          <Link
            key={project.id}
            href={`/dashboard/${project.id}`}
            className="block p-6 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] hover:border-[var(--color-brand)] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-brand)] transition-colors mb-1">
                  {project.name}
                </h2>
                <div className="text-sm text-[var(--text-secondary)] font-mono">
                  /p/{project.slug}
                </div>
                {lastSignup && (
                  <div className="mt-4 text-xs text-[var(--text-tertiary)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Last signup {timeAgo(lastSignup.created_at)} via{" "}
                    <span className="font-medium text-[var(--text-secondary)]">
                      {lastSignup.source}
                    </span>
                  </div>
                )}
                {!lastSignup && (
                  <div className="mt-4 text-xs text-[var(--text-tertiary)]">
                    No signups yet. Share your link to start tracking.
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                  {project.signups.length}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[var(--text-tertiary)] mt-1">
                  Signups
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
