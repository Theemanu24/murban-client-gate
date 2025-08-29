import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ClientHub = ({ appUrl }: { appUrl: string }) => {
  const origin = useMemo(() => new URL(appUrl).origin, [appUrl]);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch allowed origins from clients collection
    const fetchOrigins = async () => {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('app_url')
        .eq('active', true);
        
      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }
      
      const origins = clients?.map(client => new URL(client.app_url).origin) || [];
      setAllowedOrigins(origins);
    };
    fetchOrigins();
  }, []);

  const allowed = allowedOrigins.includes(origin);

  if (!allowed && allowedOrigins.length > 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 animate-fade-in">
        <h3 className="font-semibold mb-2 text-white">Origin not allowed</h3>
        <p className="text-white/60">
          This app's origin is not in the allowlist. Contact administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in">
      {!loaded && (
        <div className="absolute inset-0 grid place-content-center text-white/60 animate-pulse bg-gradient-to-br from-[#304259] via-[#2a3b4f] to-[#1e2a3a]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading app…
          </div>
        </div>
      )}
      <iframe
        title="Client App"
        src={appUrl}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
        allow="fullscreen; clipboard-read; clipboard-write"
      />
    </div>
  );
};
