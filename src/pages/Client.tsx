import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { initialClients } from "@/data/clients";
import { PasswordGate } from "@/components/PasswordGate";
import { ClientHub } from "@/components/ClientHub";

const ClientPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const client = useMemo(() => initialClients.find(c => c.slug === slug), [slug]);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    document.title = client ? `${client.name} • Murban Portal` : 'Client • Murban Portal';
  }, [client]);

  useEffect(() => {
    if (!client) return;
    const existing = localStorage.getItem(`session:${client.slug}`);
    setAuthed(!!existing);
  }, [client]);

  if (!client) {
    return (
      <main className="container mx-auto py-16">
        <h1 className="text-2xl font-bold mb-2">Client not found</h1>
        <p className="text-muted-foreground mb-6">We couldn’t find that client. Please check the link or search again.</p>
        <a className="underline" onClick={() => navigate('/')}>Go back home</a>
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
        <ClientHub appUrl={client.appUrl} />
      )}
    </main>
  );
};

export default ClientPage;
