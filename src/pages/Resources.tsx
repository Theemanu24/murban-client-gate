import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

const Resources = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen flex flex-col">
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
      
      <section className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white drop-shadow-2xl">
            Secure Client Portal
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium drop-shadow-lg px-4">
            Search your company, enter your passkey, and launch your Murban app securely.
          </p>
          <div className="px-4">
            <SearchBar onSelect={(c) => navigate(`/c/${c.slug}`)} />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-transparent via-black/40 to-black/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {["Search", "Select", "Enter Passkey", "Launch"].map((step, i) => (
              <div 
                key={step} 
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 sm:p-6 transition-all duration-500 hover:bg-white/25 hover:border-white/40 hover:scale-105 sm:hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-white/20 active:scale-95 transform text-center sm:text-left"
              >
                <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                  Step {i + 1}
                </div>
                <div className="font-bold text-lg mt-2 text-white group-hover:text-white transition-colors duration-300">
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