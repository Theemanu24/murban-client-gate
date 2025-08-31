import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@/styles/glass-radio.css";

const Navbar = () => {
  const [active, setActive] = useState<"home" | "contact">("home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/contact") {
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
      <nav className="container mx-auto flex h-16 items-center px-4">
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          aria-label="Go home"
        >
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-10 w-10 object-contain"
            style={{ background: "transparent", mixBlendMode: "screen", filter: "brightness(1.1)" }}
            loading="lazy"
          />
          <span className="font-display font-semibold text-lg tracking-tight text-white drop-shadow-sm">
            Murban Engineering
          </span>
        </Link>
        <div className="glass-radio-group ml-auto">
          <input
            type="radio"
            name="nav"
            id="glass-silver"
            checked={active === "home"}
            onChange={() => {
              setActive("home");
              navigate("/");
            }}
          />
          <label htmlFor="glass-silver">Home Page</label>

          <input
            type="radio"
            name="nav"
            id="glass-gold"
            checked={active === "contact"}
            onChange={() => {
              setActive("contact");
              navigate("/contact");
            }}
          />
          <label htmlFor="glass-gold">Contact Us</label>

          <div className="glass-glider"></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
