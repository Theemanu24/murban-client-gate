import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PasswordGate } from "@/components/PasswordGate";
import { ClientHub } from "@/components/ClientHub";

type Client = Database['public']['Tables']['clients']['Row'];

const ClientPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTerminal = searchParams.get('terminal');
  
  const [client, setClient] = useState<Client | null>(null);
  const [authed, setAuthed] = useState(false); // Always starts as false
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
        const title = selectedTerminal 
          ? `${client.name} - ${selectedTerminal} • Murban Portal`
          : `${client.name} • Murban Portal`;
        document.title = title;
      }
      setLoading(false);
    };

    fetchClient();
  }, [slug, selectedTerminal]);

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
    <main 
      className="flex-1 overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/lovable-uploads/e81e94b1-120b-46c0-bec2-9dc6b2b3521a.png')` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/2 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/4 rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
      </div>
      
      <div className="container mx-auto py-10 h-full overflow-y-auto relative z-10">
        <section className="max-w-3xl mx-auto mb-8 animate-fade-in">
          <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 group">
            <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in group-hover:text-white/90 transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
              {client.name}
              {selectedTerminal && (
                <span className="text-lg font-normal text-white/80 ml-2">- {selectedTerminal}</span>
              )}
            </h1>
            {client.description && (
              <p className="text-white/80 mt-2 animate-fade-in group-hover:text-white/70 transition-colors duration-300" style={{ animationDelay: '0.2s' }}>{client.description}</p>
            )}
            {selectedTerminal && (
              <p className="text-white/60 mt-1 text-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Terminal: {selectedTerminal}
              </p>
            )}
          </article>
        </section>

        {!authed ? (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PasswordGate 
              clientSlug={client.slug} 
              terminal={selectedTerminal}
              onSuccess={() => setAuthed(true)} 
            />
          </div>
        ) : (
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ClientHub 
              appUrl={client.app_url} 
              terminal={selectedTerminal}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientPage;
