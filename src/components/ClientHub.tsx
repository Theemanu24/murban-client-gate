import { Button } from "@/components/ui/button";
import { allowedOrigins } from "@/data/clients";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

export const ClientHub = ({ appUrl }: { appUrl: string }) => {
  const origin = useMemo(() => new URL(appUrl).origin, [appUrl]);
  const allowed = allowedOrigins.includes(origin);
  const [loaded, setLoaded] = useState(false);

  if (!allowed) {
    return (
      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold mb-2">Origin not allowed</h3>
        <p className="text-muted-foreground">
          This app's origin is not in the allowlist. Update APP_ORIGIN_ALLOWLIST in production.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">Client Hub</h3>
        <Button asChild>
          <a href={appUrl} target="_blank" rel="noopener noreferrer">
            Launch App <ExternalLink />
          </a>
        </Button>
      </div>
      <div className="rounded-2xl border overflow-hidden">
        {!loaded && (
          <div className="h-[60vh] grid place-content-center text-muted-foreground">Loading app…</div>
        )}
        <iframe
          title="Client App"
          src={appUrl}
          className="w-full h-[60vh]"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </section>
  );
};
