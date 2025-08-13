import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/data/clients";
import { PasswordGate } from "@/components/PasswordGate";
import { ClientHub } from "@/components/ClientHub";

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
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        setClient(null);
      } else {
        setClient(data);
        document.title = `${data.name} • Murban Portal`;
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
      <main className="container mx-auto py-16">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="container mx-auto py-16">
        <h1 className="text-2xl font-bold mb-2">Client not found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find that client. Please check the link or search again.</p>
        <a className="underline cursor-pointer" onClick={() => navigate('/')}>Go back home</a>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <section className="max-w-3xl mx-auto mb-8">
        <article className="rounded-2xl border p-6">
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          {client.description && (
            <p className="text-muted-foreground mt-2">{client.description}</p>
          )}
        </article>
      </section>

      {!authed ? (
        <PasswordGate clientSlug={client.slug} onSuccess={() => setAuthed(true)} />
      ) : (
        <ClientHub appUrl={client.app_url} />
      )}
    </main>
  );
};

export default ClientPage;