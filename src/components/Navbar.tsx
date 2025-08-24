
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-500" style={{backgroundColor: '#304259'}}>
      <nav className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300" aria-label="Go home">
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            style={{ background: 'transparent', mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
            loading="lazy"
          />
          <span className="font-display font-semibold text-sm sm:text-lg tracking-tight text-white drop-shadow-sm hidden xs:block">Murban Engineering</span>
          <span className="font-display font-semibold text-sm tracking-tight text-white drop-shadow-sm xs:hidden">Murban</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/" 
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform"
          >
            Home
          </Link>
          <a 
            href="https://murban-eng.com/contact-us/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform"
          >
            <span className="hidden sm:inline">Contact Us</span>
            <span className="sm:hidden">Contact</span>
          </a>
          {/* Theme toggle removed - light mode only */}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
