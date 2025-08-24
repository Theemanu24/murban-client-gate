import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-500" style={{backgroundColor: '#304259'}}>
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo Section - Extreme Left */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 flex-shrink-0" aria-label="Go home">
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-10 w-10 object-contain"
            style={{ background: 'transparent', mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
            loading="lazy"
          />
          <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-white drop-shadow-sm transform translate-y-[-2px]">
            Murban Engineering
          </span>
        </Link>
        
        {/* Navigation Buttons - Top Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/" 
            className="px-3 py-2 text-sm sm:text-base rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform whitespace-nowrap"
          >
            Home
          </Link>
          <a 
            href="https://murban-eng.com/contact-us/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm sm:text-base rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform whitespace-nowrap"
          >
            Contact Us
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
