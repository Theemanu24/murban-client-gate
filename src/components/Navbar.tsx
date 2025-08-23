import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.header 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-500 border-b border-primary/20"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.7), hsl(var(--primary) / 0.1))'
      }}
    >
      {/* Holographic overlay */}
      <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />
      
      <nav className="container mx-auto flex h-16 items-center justify-between relative">
        <motion.div variants={logoVariants}>
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="Go home"
          >
            <div className="relative">
              <img
                src="/lovable-uploads/12e6503e-b4c6-423a-98cc-2c4b6a8efe38.png"
                alt="Murban Engineering logo"
                className="h-12 w-12 object-contain transition-all duration-500 group-hover:animate-glow-pulse"
                style={{ 
                  filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5))' 
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight neon-text group-hover:cyber-text transition-all duration-500">
              Murban Engineering
            </span>
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className="relative px-6 py-2 text-sm font-medium rounded-xl border border-primary/30 bg-card/50 text-primary hover:text-primary-foreground hover:bg-primary/90 hover:border-primary hover:scale-105 transition-all duration-500 backdrop-blur-sm transform cinematic-button group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <a 
              href="https://murban-eng.com/contact-us/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative px-6 py-2 text-sm font-medium rounded-xl border border-secondary/30 bg-card/50 text-secondary hover:text-secondary-foreground hover:bg-secondary/90 hover:border-secondary hover:scale-105 transition-all duration-500 backdrop-blur-sm transform cinematic-button group"
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
            </a>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
