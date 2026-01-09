import React, { useState } from "react";
import { useRouter } from "next/router";

type AppEntry = {
  id: string;
  name: string;
  url: string;
  description?: string;
  password: string;
};

export default function AccessModal({
  app,
  onClose,
}: {
  app: AppEntry;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function unlock() {
    setError(null);
    setLoading(true);

    // Simulate quick client-side check. IMPORTANT: client-side checks are not secure.
    setTimeout(() => {
      setLoading(false);
      if (value === app.password) {
        // mark unlocked in localStorage (simple session flag)
        const key = `access:${app.id}`;
        const payload = {
          unlocked: true,
          ts: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(payload));

        // navigate to the app page
        router.push(`/apps/${app.id}`);
        onClose();
      } else {
        setError("Incorrect password");
      }
    }, 350);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 420,
          background: "white",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{app.name}</h3>
        <p style={{ marginTop: 0, color: "#444" }}>Enter password to open the app</p>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          aria-label="App password"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={unlock}
            disabled={loading}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#0366d6",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Checking..." : "Open"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          Note: This example checks the password client-side for quick access. For production,
          validate on the server and use a token exchange to avoid exposing the secret.
        </div>
      </div>
    </div>
  );
}
