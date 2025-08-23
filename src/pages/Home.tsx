import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Home = () => {
  const titleWords = ["Murban", "Engineering"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.5,
        delayChildren: 1.2
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      filter: "blur(20px)",
      y: 50,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      y: 0,
      rotateY: 0,
      transition: { 
        duration: 2.5, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, x: -100, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 2, 
        delay: 6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 2.2, 
        delay: 8,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        damping: 25,
        stiffness: 80
      }
    }
  };

  const particleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 2
      }
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Holographic Grid Overlay */}
      <div className="grid-overlay" />
      
      {/* Enhanced Particle Field */}
      <motion.div 
        variants={particleVariants}
        initial="hidden"
        animate="visible"
        className="particle-field"
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${180 + Math.random() * 180} 100% ${50 + Math.random() * 30}%)`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              boxShadow: `0 0 ${5 + Math.random() * 10}px currentColor`
            }}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { 
                opacity: 0.6, 
                scale: 1,
                transition: { 
                  delay: Math.random() * 2,
                  duration: 1
                }
              }
            }}
          />
        ))}
      </motion.div>

      {/* Neon Data Streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px animate-pulse"
            style={{
              width: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(90deg, transparent, hsl(${180 + i * 30} 100% 50%), transparent)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Title */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl opacity-50" />
              
              <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter">
                {titleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className="inline-block mr-6 md:mr-8 neon-text cinematic-text"
                    style={{
                      textShadow: `
                        0 0 10px hsl(var(--primary)),
                        0 0 20px hsl(var(--primary) / 0.8),
                        0 0 40px hsl(var(--primary) / 0.6),
                        0 0 80px hsl(var(--primary) / 0.4)
                      `
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>
          </motion.div>
          
          {/* Subtitle */}
          <motion.div
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="relative mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            <p className="relative text-2xl md:text-3xl lg:text-4xl font-light text-foreground/90 max-w-4xl mx-auto leading-relaxed cyber-text">
              Industrial Engineering Solutions & Client Resources Portal
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            variants={buttonsVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="group relative px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground border border-primary/50 shadow-2xl transition-all duration-700 transform hover:scale-110 hover:rotate-1 cinematic-button"
              style={{
                boxShadow: `
                  0 0 30px hsl(var(--primary) / 0.5),
                  0 10px 50px hsl(var(--primary) / 0.3),
                  inset 0 1px 0 hsl(var(--primary) / 0.2)
                `
              }}
            >
              <Link to="/resources" className="relative z-10">
                <span className="block transition-transform group-hover:scale-110">
                  Access Resources
                </span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="group relative px-12 py-6 text-xl font-bold rounded-2xl border-2 border-accent bg-card/20 hover:bg-accent/20 text-accent hover:text-accent-foreground backdrop-blur-md transition-all duration-700 transform hover:scale-110 hover:-rotate-1 cinematic-button"
              style={{
                boxShadow: `
                  0 0 30px hsl(var(--accent) / 0.3),
                  0 10px 50px hsl(var(--accent) / 0.2),
                  inset 0 1px 0 hsl(var(--accent) / 0.1)
                `
              }}
            >
              <a 
                href="https://murban-eng.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-10"
              >
                <span className="block transition-transform group-hover:scale-110">
                  Visit Website
                </span>
              </a>
            </Button>
          </motion.div>

          {/* Floating Tech Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 10, duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 border border-primary/20 rounded-lg backdrop-blur-sm"
                style={{
                  left: `${10 + (i * 15)}%`,
                  top: `${20 + Math.sin(i) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 180, 360],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </main>
  );
};

export default Home;