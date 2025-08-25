import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PasswordGate } from "@/components/PasswordGate";
import { ClientHub } from "@/components/ClientHub";

type Client = Database['public']['Tables']['clients']['Row'];

const ClientPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching client:', error);
        setClient(null);
      } else if (!client) {
        setClient(null);
      } else {
        setClient(client);
        document.title = `${client.name} \u2022 Murban Portal`;
      }
      setLoading(false);
    };

    fetchClient();
  }, [slug]);

  useEffect(() => {
    if (!client) return;
    const existing = localStorage.getItem(`session:${client.slug}`);
    setAuthed(!!existing);
  }, [client]);

  if (loading) {
    return (
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-[#304259] to-[#1e2a3a] flex items-center justify-center">
        <div className="container mx-auto py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-white/80">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-[#304259] to-[#1e2a3a] flex items-center justify-center">
        <div className="container mx-auto py-16">
          <h1 className="text-2xl font-bold mb-2 text-white">Client not found</h1>
          <p className="text-white/80 mb-6">We couldn't find that client. Please check the link or search again.</p>
          <a className="underline cursor-pointer text-white hover:text-white/80" onClick={() => navigate('/')}>Go back home</a>
        </div>
      </main>
    );
  }

  // ---- ENFORCE AUTHENTICATION FOR THIS CLIENT ----
  if (!authed) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#304259] via-[#2a3b4f] to-[#1e2a3a]">
        <PasswordGate
          clientSlug={client.slug}
          onSuccess={() => setAuthed(true)}
        />
      </main>
    );
  }

  // ---- IF AUTHENTICATED, SHOW CLIENT HUB ----
  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-[#304259] via-[#2a3b4f] to-[#1e2a3a] relative">
      {/* Animated background or other elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        {/* ...additional effects if needed */}
      </div>
      {/* Render the actual ClientHub or whatever main authenticated content */}
      <ClientHub client={client} />
    </main>
  );
};

export default ClientPage;
