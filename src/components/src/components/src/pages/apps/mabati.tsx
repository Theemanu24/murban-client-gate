import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AccessModal from "../../components/AccessModal";

const APP_ID = "mabati";
const APP_URL = "https://mabatirollingmills-eight.vercel.app/";
const APP_PASS = "M005";

export default function MabatiPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showInlinePrompt, setShowInlinePrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const key = `access:${APP_ID}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.unlocked) {
          setUnlocked(true);
        }
      } catch (e) {
        // ignore
      }
    }
    setChecking(false);
  }, []);

  // If not unlocked, show an inline prompt. You can also redirect to home instead.
  if (checking) {
    return <div style={{ padding: 24 }}>Checking access...</div>;
  }

  if (!unlocked && !showInlinePrompt) {
    // Show a simple landing with an option to open the password modal (in case user navigated directly)
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2>Mabati Rolling Mills</h2>
        <p>
          This app is available inside the portal. To open it, search "Mabati Rolling
          Mills" from the portal search and enter the password, or click the button below.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowInlinePrompt(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#0366d6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Enter password
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Back to portal
          </button>
        </div>

        {showInlinePrompt && (
          <AccessModal
            app={{ id: APP_ID, name: "Mabati Rolling Mills", url: APP_URL, password: APP_PASS }}
            onClose={() => {
              setShowInlinePrompt(false);
              // re-check unlock
              const key = `access:${APP_ID}`;
              const raw = localStorage.getItem(key);
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  if (parsed && parsed.unlocked) {
                    setUnlocked(true);
                  }
                } catch (e) {
                  // ignore
                }
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fafafa" }}>
        <strong>Mabati Rolling Mills</strong>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <iframe
          title="Mabati Rolling Mills"
          src={APP_URL}
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
