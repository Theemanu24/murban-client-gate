import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import type { Database } from "@/integrations/supabase/types";

type Client = Database['public']['Tables']['clients']['Row'];

const Index = () => {
  const navigate = useNavigate();

  const handleSelection = (client: Client, terminal?: string) => {
    if (terminal) {
      // Navigate to client page with terminal parameter
      navigate(`/c/${client.slug}?terminal=${encodeURIComponent(terminal)}`);
    } else {
      // Navigate to client page without terminal
      navigate(`/c/${client.slug}`);
    }
  };

  return (
    <main>
      <section className="container mx-auto py-20 text-center bg-gradient-to-b from-primary/10 to-transparent rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Secure Client Portal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Search your company, select your terminal location, enter your passkey, and launch your Murban app securely.
        </p>
        <SearchBar onSelect={handleSelection} />
      </section>
      <section className="border-t py-12">
        <div className="container mx-auto grid md:grid-cols-5 gap-6 text-left">
          {["Search Company", "Select Terminal", "Enter Passkey", "Authenticate", "Launch"].map((step, i) => (
            <div key={step} className="rounded-2xl border p-5 glossy-card hover-scale">
              <div className="text-sm text-muted-foreground">Step {i + 1}</div>
              <div className="font-semibold mt-1 text-sm">{step}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
