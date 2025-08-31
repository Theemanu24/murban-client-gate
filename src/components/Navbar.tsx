import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@/styles/glass-radio.css";

const Navbar = () => {
  const [active, setActive] = useState<"portal" | "home" | "contact">("home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/resources") {
      setActive("portal");
    } else if (location.pathname === "/contact") {
      setActive("contact");
    } else {
      setActive("home");
    }
  }, [location.pathname]);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm transition-all duration-500"
      style={{
        fontSize: "90%", // Navbar font reduced for less crowding
      }}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <Link
          to="/"
          className="flex items-center gap-1 sm:gap-3 hover:scale-105 transition-transform duration-300"
          aria-label="Go home"
        >
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-10 w-10 object-contain"
            style={{ background: "transparent", mixBlendMode: "screen", filter: "brightness(1.1)" }}
            loading="lazy"
          />
          <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold text-white whitespace-nowrap">
            Murban Engineering
          </span>
        </Link>
        <div className="glass-radio-group">
          <input
            type="radio"
            name="nav"
            id="glass-gold"
            checked={active === "home"}
            onChange={() => {
              setActive("home");
              navigate("/");
            }}
          />
          <label htmlFor="glass-gold">Home</label>

          <input
            type="radio"
            name="nav"
            id="glass-silver"
            checked={active === "portal"}
            onChange={() => {
              setActive("portal");
              navigate("/resources");
            }}
          />
          <label htmlFor="glass-silver">Portal</label>

          <input
            type="radio"
            name="nav"
            id="glass-platinum"
            checked={active === "contact"}
            onChange={() => {
              setActive("contact");
              navigate("/contact");
            }}
          />
          <label htmlFor="glass-platinum">Contact Us</label>

          <div className="glass-glider"></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
