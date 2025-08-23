import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-500" style={{backgroundColor: '#304259'}}>
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Go home">
          <img
            src="/lovable-uploads/dd007f0e-e440-4bf0-a8a5-ee5dade1ccc7.png"
            alt="Murban Engineering logo"
            className="h-10 w-10 object-contain drop-shadow-sm"
            loading="lazy"
          />
          <span className="font-display font-semibold text-lg tracking-tight text-white drop-shadow-sm">Murban Engineering</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform"
          >
            Home
          </Link>
          <a 
            href="https://murban-eng.com/contact-us/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform"
          >
            Contact Us
          </a>
          {/* Theme toggle removed - light mode only */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
