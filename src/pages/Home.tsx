import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Home = () => {
  const titleWords = ["Murban", "Engineering"];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.2,
        delayChildren: 0.8
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1, 
      filter: "blur(6px)",
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: { 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.5, 
        delay: 4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.8, 
        delay: 5.5,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        damping: 30,
        stiffness: 100
      }
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Animated Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/076c0e82-43a2-43e9-b835-48b5f384368f.png')"
        }}
      />
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 animate-gradient-shift" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 overflow-visible"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight relative" style={{ lineHeight: '1.3', paddingBottom: '0.25em' }}>
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className="inline-block mr-4 md:mr-6 relative cinematic-text overflow-visible"
                  style={{ paddingBottom: '0.1em' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>
          
          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed py-1"
          >
            Industrial Engineering Solutions & Client Resources Portal
          </motion.p>
          
          <motion.div
            variants={buttonsVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="cinematic-button bg-slate-800/90 hover:bg-slate-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-glow active:scale-95"
            >
              <Link to="/resources">
                Access Resources
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="cinematic-button border-2 border-white/30 bg-white/10 hover:bg-white/25 hover:border-white/50 text-white hover:text-white px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-500 transform hover:scale-110 hover:shadow-glow-white active:scale-95"
            >
              <a 
                href="https://murban-eng.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Home;