import { motion } from "framer-motion";
import "@/styles/official-button.css";
import "@/styles/home-loader.css";
import OfficialButton from "@/components/OfficialButton";

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
    <>
      {/* Dark translucent overlay to dim background image */}
      <div className="fixed inset-0 bg-black/60 pointer-events-none z-0" />

      {/* Floating Particles - also fixed to cover entire viewport */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <main
        className="relative min-h-screen flex items-center sm:items-start justify-center pt-16 sm:pt-24 sm:-mt-12"
      >
        {/* Decorative loader animation */}
        <div className="absolute bottom-8 right-8" aria-hidden="true">
          <div className="home-loader">
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
            <div className="home-loader-square"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 flex flex-col py-8">
          <div className="max-w-4xl mx-auto flex flex-col justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-4 sm:mb-6 overflow-visible"
            >
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight relative" style={{ lineHeight: '1.3', paddingBottom: '0.25em' }}>
                {titleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className={
                      "block sm:inline-block sm:mr-4 md:mr-6 relative cinematic-text overflow-visible" +
                      (index === 0 ? " text-white" : "")
                    }
                    style={{ paddingBottom: "0.1em" }}
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
              className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed py-1"
            >
              Industrial Engineering Solutions & Client Resources Portal
            </motion.p>
            
            <motion.div
              variants={buttonsVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center items-center"
            >
              <OfficialButton />
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
