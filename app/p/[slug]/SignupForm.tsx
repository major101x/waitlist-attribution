"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  projectId: string;
}

export default function SignupForm({ projectId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Read source from URL, default to "direct"
    const source = searchParams.get("src") || "direct";

    // Call SECURITY DEFINER function - all validation happens in Postgres
    const { data, error } = await supabase.rpc("submit_signup", {
      p_project_id: projectId,
      p_email: email.trim(),
      p_source: source,
      // Note: IP address would be captured server-side in production
      // For now we pass null - the function handles this gracefully
      p_ip_address: null as unknown as string,
    });

    if (error || (data && !(data as { success: boolean }).success)) {
      // Generic error message - do NOT leak DB or rate-limit details
      setStatus("error");
      setErrorMessage("Unable to verify signup. Please try again later.");
      return;
    }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <p className="text-[var(--text-primary)] font-medium">Spot reserved.</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="founder@company.com"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary py-3 justify-center"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing secure signup...
          </span>
        ) : (
          "Join Waiting List"
        )}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <p className="text-xs text-center text-[var(--text-tertiary)] flex items-center justify-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></span>
        Securely recorded via Postgres
      </p>
    </form>
  );
}
