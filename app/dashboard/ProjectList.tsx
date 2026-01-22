"use client";

interface Project {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0" }}>{project.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#666" }}>Public URL:</span>
            <code
              style={{
                backgroundColor: "#f5f5f5",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              /p/{project.slug}
            </code>
            <button
              onClick={() => copyUrl(project.slug)}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
