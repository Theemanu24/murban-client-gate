import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Resources = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex-1 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/d56c7b58-bae5-4c68-a39d-ca9a6576e652.png')"
        }}
      />
      
      {/* Sophisticated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />
      
      <section className="relative z-10 container mx-auto py-12 sm:py-16 lg:py-20 text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white drop-shadow-2xl">
          Secure Client Portal
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium drop-shadow-lg px-4 sm:px-0">
          Search your company, enter your passkey, and launch your Murban app securely.
        </p>
        <div className="px-4 sm:px-0">
          <SearchBar onSelect={(c) => navigate(`/c/${c.slug}`)} />
        </div>
      </section>

      <section className="relative z-10 py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-transparent via-black/40 to-black/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {["Search", "Select", "Enter Passkey", "Launch"].map((step, i) => (
              <div 
                key={step} 
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 sm:p-6 transition-all duration-500 hover:bg-white/25 hover:border-white/40 hover:scale-105 sm:hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-white/20 active:scale-95 transform"
              >
                <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                  Step {i + 1}
                </div>
                <div className="font-bold text-base sm:text-lg mt-2 text-white group-hover:text-white transition-colors duration-300">
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