import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@/styles/glass-radio.css";

const Navbar = () => {
  const [active, setActive] = useState<"portal" | "home" | "contact">("home");
  const navigate = useNavigate();
  const location = useLocation();
  const isClientPage = location.pathname.startsWith("/c/");

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
      className={`fixed top-0 z-50 w-full backdrop-blur-sm shadow-lg transition-all duration-500 ${
        isClientPage ? "bg-black md:bg-transparent" : "bg-transparent"
      }`}
      style={{
        fontSize: "90%", // Navbar font reduced for less crowding
      }}
    >
      <nav className="container mx-auto flex h-12 sm:h-16 items-center pl-4 pr-2 sm:px-4 relative">
        <Link
          to="/"
          className="flex items-center gap-1 sm:gap-3 hover:scale-105 transition-transform duration-300"
          aria-label="Go home"
        >
          <img
            src="/murban_logo_final-removebg-preview.png"
            alt="Murban Engineering logo"
            className="h-8 w-8 object-contain"
            style={{ background: "transparent", mixBlendMode: "screen", filter: "brightness(1.1)" }}
            loading="lazy"
          />
          <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold text-white leading-tight sm:whitespace-nowrap">
            <span className="block sm:inline">Murban</span>
            <span className="block sm:inline sm:ml-1">Engineering</span>
          </div>
        </Link>
        <div className="ml-auto glass-radio-group">
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
