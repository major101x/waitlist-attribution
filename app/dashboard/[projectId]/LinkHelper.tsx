"use client";

import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react"; // Assuming lucide-react is available, or use SVG directly

export default function LinkHelper({ slug }: { slug: string }) {
  const [activeSource, setActiveSource] = useState("twitter");
  const [copied, setCopied] = useState(false);

  const sources = [
    {
      id: "twitter",
      label: "Twitter",
      color: "text-[#1d9bf0] bg-[#1d9bf0]/10 border-[#1d9bf0]/20",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      color: "text-[#0a66c2] bg-[#0a66c2]/10 border-[#0a66c2]/20",
    },
    {
      id: "newsletter",
      label: "Newsletter",
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
    {
      id: "producthunt",
      label: "Product Hunt",
      color: "text-[#da552f] bg-[#da552f]/10 border-[#da552f]/20",
    },
  ];

  // We need to access window.location on client, but for SSR safety we might need useEffect or just show relative path if window undefined
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = `${origin}/p/${slug}?src=${activeSource}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] mb-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
        Generate Tracking Link
      </h3>

      {/* Source Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sources.map((src) => (
          <button
            key={src.id}
            onClick={() => setActiveSource(src.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeSource === src.id
                ? src.color
                : "border-[var(--color-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {src.label}
          </button>
        ))}
        <button
          onClick={() => setActiveSource("custom")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            activeSource === "custom"
              ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
              : "border-[var(--color-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          }`}
        >
          Custom
        </button>
      </div>

      {/* Input Group */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
            <span className="text-sm font-bold">🔗</span>
          </div>
          <input
            type="text"
            readOnly
            value={
              activeSource === "custom" ? `${origin}/p/${slug}?src=` : fullUrl
            }
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-md font-mono text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
          />
        </div>

        <button onClick={copyToClipboard} className="btn-primary min-w-[100px]">
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--text-tertiary)]">
        Paste this link where you want to track traffic from. The{" "}
        <code className="bg-[var(--bg-tertiary)] px-1 rounded">src</code>{" "}
        parameter is locked on signup.
      </p>
    </div>
  );
}
