import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Resources = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/d56c7b58-bae5-4c68-a39d-ca9a6576e652.png')"
        }}
      />
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/60" />
      
      <section className="relative z-10 container mx-auto py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Secure Client Portal</h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
          Search your company, enter your passkey, and launch your Murban app securely.
        </p>
        <SearchBar onSelect={(c) => navigate(`/c/${c.slug}`)} />
      </section>

      <section className="border-t py-12">
        <div className="container mx-auto grid md:grid-cols-4 gap-6 text-left">
          {["Search", "Select", "Enter Passkey", "Launch"].map((step, i) => (
            <div key={step} className="rounded-2xl border p-5 glossy-card hover-scale">
              <div className="text-sm text-muted-foreground">Step {i + 1}</div>
              <div className="font-semibold mt-1">{step}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Resources;