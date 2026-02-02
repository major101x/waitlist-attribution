import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SignupForm from "./SignupForm";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-[var(--bg-card)] p-8 rounded-xl shadow-sm border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Join the waitlist to get early access.
            </p>
          </div>

          <SignupForm projectId={project.id} />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors font-mono"
          >
            Powered by Waitlist Attribution
          </Link>
        </div>
      </div>
    </div>
  );
}
