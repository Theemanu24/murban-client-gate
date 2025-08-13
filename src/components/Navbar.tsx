import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

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
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
