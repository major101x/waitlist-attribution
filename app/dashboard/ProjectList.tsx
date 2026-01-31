"use client";

interface Signup {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  signups: Signup[];
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
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

          <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
            <h3
              style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#333" }}
            >
              Signups ({project.signups?.length || 0})
            </h3>
            {project.signups && project.signups.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px" }}>
                {project.signups.map((signup) => (
                  <li key={signup.id} style={{ marginBottom: "4px" }}>
                    {signup.email}
                    <span style={{ color: "#999", marginLeft: "8px" }}>
                      via {signup.source}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
                No signups yet
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
