import React, { useMemo, useState } from "react";
import AccessModal from "./AccessModal";

type AppEntry = {
  id: string;
  name: string;
  url: string;
  description?: string;
  password: string; // for client-side example only
};

const APPS: AppEntry[] = [
  {
    id: "mabati",
    name: "Mabati Rolling Mills",
    url: "https://mabatirollingmills-eight.vercel.app/",
    description: "Open the Mabati Rolling Mills app inside the portal.",
    password: "M005",
  },
  // Add more apps here if needed
];

export default function PortalSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AppEntry | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return APPS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ position: "relative", maxWidth: 480 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search apps..."
        aria-label="Search apps"
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #eee",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            borderRadius: 8,
            zIndex: 40,
            overflow: "hidden",
          }}
        >
          {results.map((r) => (
            <div
              key={r.id}
              style={{
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid #f4f4f4",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                {r.description && (
                  <div style={{ fontSize: 13, color: "#666" }}>{r.description}</div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setSelected(r)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#0366d6",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <AccessModal
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
