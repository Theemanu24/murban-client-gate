import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/076c0e82-43a2-43e9-b835-48b5f384368f.png')"
        }}
      />
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Murban Engineering
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Industrial Engineering Solutions & Client Resources Portal
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-slate-800/90 hover:bg-slate-700 hover:scale-105 hover:shadow-2xl hover:shadow-slate-800/40 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 transform active:scale-95"
            >
              <Link to="/resources">
                Access Resources
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 bg-white/10 hover:bg-white/25 hover:border-white/50 hover:scale-105 hover:shadow-xl hover:shadow-white/20 text-white hover:text-white px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 transform active:scale-95"
            >
              <a 
                href="https://murban-eng.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;