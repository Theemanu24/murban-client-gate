import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ClientHub = ({ appUrl }: { appUrl: string }) => {
  const origin = useMemo(() => new URL(appUrl).origin, [appUrl]);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch allowed origins from clients table
    const fetchOrigins = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('app_url')
        .eq('active', true);

      if (error) {
        console.error('Error fetching origins:', error);
        return;
      }

      const origins = data.map(client => new URL(client.app_url).origin);
      setAllowedOrigins(origins);
    };

    fetchOrigins();
  }, []);

  const allowed = allowedOrigins.includes(origin);

  if (!allowed && allowedOrigins.length > 0) {
    return (
      <div className="rounded-2xl border p-6">
        <h3 className="font-semibold mb-2">Origin not allowed</h3>
        <p className="text-muted-foreground">
          This app's origin is not in the allowlist. Contact administrator.
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