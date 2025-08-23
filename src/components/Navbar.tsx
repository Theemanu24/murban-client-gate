import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/80 backdrop-blur-md transition-all duration-500">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Go home">
          <img
            src="/lovable-uploads/3c3b97c6-0fc2-4361-ba81-914763d240fd.png"
            alt="Murban Engineering logo"
            className="h-8 w-8 object-contain"
            loading="lazy"
          />
          <span className="font-semibold tracking-tight text-white">Murban Engineering</span>
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
