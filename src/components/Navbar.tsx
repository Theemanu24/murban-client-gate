import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@/styles/glass-radio.css";
import TextRotate from "@/components/TextRotate";

const Navbar = () => {
  const [active, setActive] = useState<"portal" | "home" | "contact">("home");
  const navigate = useNavigate();
  const location = useLocation();
  const isClientPage = location.pathname.startsWith("/c/");
  const isPortalPage = location.pathname === "/resources";

  useEffect(() => {
    if (location.pathname === "/resources" || location.pathname.startsWith("/c/")) {
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
        isClientPage || isPortalPage ? "bg-black md:bg-transparent" : "bg-transparent"
      }`}
      style={{
        fontSize: "90%", // Navbar font reduced for less crowding
      }}
    >
       <nav className="container mx-auto flex h-14 sm:h-16 items-center px-4 relative">
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
          <div className="leading-tight sm:whitespace-nowrap">
            <TextRotate />
          </div>
        </Link>
        <div className="ml-auto glass-radio-group">
          <input
            type="radio"
            name="nav"
            id="glass-gold"
            checked={active === "home"}
            readOnly
            onClick={() => {
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
            readOnly
            onClick={() => {
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
            readOnly
            onClick={() => {
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
