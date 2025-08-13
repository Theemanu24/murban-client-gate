import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 bg-gradient-to-b from-primary/15 to-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Go home">
          <img
            src="/lovable-uploads/006291be-d3c5-4c9f-bd0a-2330a1bae9ab.png"
            alt="Murban Engineering logo"
            className="h-8 w-8 rounded-full object-contain ring-1 ring-border bg-background"
            loading="lazy"
          />
          <span className="font-semibold tracking-tight">Murban Engineering</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            Home
          </Link>
          <Link 
            to="/admin" 
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background/80 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            Admin
          </Link>
          {/* Theme toggle removed - light mode only */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
