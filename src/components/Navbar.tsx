import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Go home">
          <img
            src="/lovable-uploads/006291be-d3c5-4c9f-bd0a-2330a1bae9ab.png"
            alt="Murban Engineering logo"
            className="h-8 w-8 rounded-full object-contain ring-1 ring-white/20 bg-white/10"
            loading="lazy"
          />
          <span className="font-semibold tracking-tight text-white">Murban Engineering</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            Home
          </Link>
          <a 
            href="https://murban-eng.com/contact-us/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
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
