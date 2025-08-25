import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-500"
      style={{
        backgroundColor: "#304259",
        fontSize: "90%", // Navbar font reduced for less crowding
      }}
    >
      <nav className="container mx-auto flex h-18 items-center justify-between px-6"> {/* Increased height from h-16 to h-18, added px-6 padding */}
        <Link to="/" className="flex items-center gap-4 hover:scale-105 transition-transform duration-300" aria-label="Go home"> {/* Increased gap from gap-2 to gap-4 */}
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-11 w-11 object-contain" {/* Slightly increased logo size from h-10 w-10 to h-11 w-11 */}
            style={{ background: "transparent", mixBlendMode: "screen", filter: "brightness(1.1)" }}
            loading="lazy"
          />
          <span className="font-display font-semibold text-xl tracking-tight text-white drop-shadow-sm"> {/* Increased from text-lg to text-xl */}
            Murban Engineering
          </span>
        </Link>
        <div className="flex items-center gap-5"> {/* Increased gap from gap-3 to gap-5 */}
          <Link
            to="/"
            className={cn(
              "px-6 py-3 text-base rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform", // Increased padding from px-4 py-2 to px-6 py-3, font from text-sm to text-base
              location.pathname === "/" && "ring-2 ring-white/50"
            )}
          >
            Home
          </Link>
          <a
            href="https://murban-eng.com/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-base rounded-lg border border-white/20 bg-white/10 text-white/90 hover:text-white hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 backdrop-blur-sm transform" // Increased padding from px-4 py-2 to px-6 py-3, font from text-sm to text-base
          >
            Contact Us
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
