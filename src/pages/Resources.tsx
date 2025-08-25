import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Resources = () => {
  const navigate = useNavigate();
  
  return (
    <main 
      className="relative flex-1 overflow-y-auto bg-cover bg-center bg-no-repeat min-h-screen" 
      style={{ 
        fontSize: '1rem',
        backgroundImage: "url('/lovable-uploads/d56c7b58-bae5-4c68-a39d-ca9a6576e652.png')"
      }}
    >
      {/* Sophisticated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />
      
      <section className="relative z-10 container mx-auto py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
          Secure Client Portal
        </h1>
        <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-12 leading-relaxed font-medium drop-shadow-lg">
          Search your company, enter your passkey, and launch your Murban app securely.
        </p>
        <SearchBar onSelect={(c) => navigate(`/c/${c.slug}`)} />
      </section>
      
      <section className="relative z-10 py-16 bg-gradient-to-b from-transparent via-black/40 to-black/60">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-left">
            {["Search", "Select", "Enter Passkey", "Launch"].map((step, i) => (
              <div 
                key={step} 
                className="group cursor-pointer rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md p-6 transition-all duration-500 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-300/50 hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 transform"
              >
                <div className="text-sm text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                  Step {i + 1}
                </div>
                <div className="font-bold text-lg mt-2 text-white group-hover:text-blue-50 transition-colors duration-300">
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
