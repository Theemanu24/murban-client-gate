import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import type { Database } from "@/integrations/supabase/types";
import "@/styles/loader.css";

type Client = Database['public']['Tables']['clients']['Row'];

const Resources = () => {
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
    <main
      className="relative flex-1 overflow-y-auto bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        fontSize: '1rem',
        backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9)), linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent, rgba(0, 0, 0, 0.3)), url('/lovable-uploads/d56c7b58-bae5-4c68-a39d-ca9a6576e652.png')"
      }}
    >
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
      </div>
      <section className="relative py-20 text-center">
        <div className="relative z-10 container mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
            Secure Client Portal
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-12 leading-relaxed font-medium drop-shadow-lg">
            Search your company, select your terminal location, enter your passkey, and launch your Murban app securely.
          </p>
          <SearchBar onSelect={handleSelection} />
        </div>
      </section>
      
      <section className="relative py-16">
        <div className="relative z-10 container mx-auto">
          <div className="grid md:grid-cols-5 gap-4 text-left">
            {["Search Company", "Select Terminal", "Enter Passkey", "Authenticate", "Launch"].map((step, i) => (
              <div 
                key={step} 
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 transition-all duration-500 hover:bg-white/25 hover:border-white/40 hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-white/20 active:scale-95 transform"
              >
                <div className="text-xs text-white/70 group-hover:text-white/90 transition-colors duration-300">
                  Step {i + 1}
                </div>
                <div className="font-bold text-sm mt-2 text-white group-hover:text-white transition-colors duration-300">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Resources;
