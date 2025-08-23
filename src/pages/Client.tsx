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
        console.error('Client not found');
        setClient(null);
      } else {
        setClient(client);
        document.title = `${client.name} • Murban Portal`;
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

  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-b from-[#304259] to-[#1e2a3a]">
      <div className="container mx-auto py-10 h-full overflow-y-auto">
        <section className="max-w-3xl mx-auto mb-8 animate-fade-in">
          <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
            <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in" style={{ animationDelay: '0.1s' }}>{client.name}</h1>
            {client.description && (
              <p className="text-white/80 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>{client.description}</p>
            )}
          </article>
        </section>

        {!authed ? (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PasswordGate clientSlug={client.slug} onSuccess={() => setAuthed(true)} />
          </div>
        ) : (
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ClientHub appUrl={client.app_url} />
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientPage;