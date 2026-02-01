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
      p_ip_address: null,
    });

    if (error || (data && !data.success)) {
      // Generic error message - do NOT leak DB or rate-limit details
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
  };

  if (status === "success") {
    return <p style={{ color: "#22c55e" }}>Thanks for signing up!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        disabled={status === "loading"}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "12px",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "Signing up..." : "Sign Up"}
      </button>
      {status === "error" && (
        <p style={{ color: "#ef4444", marginTop: "12px" }}>{errorMessage}</p>
      )}
    </form>
  );
}
