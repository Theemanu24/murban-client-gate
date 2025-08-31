import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/glass-radio.css";

const Navbar = () => {
  const [active, setActive] = useState<"portal" | "home" | "contact">("portal");
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm transition-all duration-500"
      style={{
        fontSize: "90%",
      }}
    >
      <nav className="container mx-auto flex h-16 items-center justify-center px-4">
        <div className="glass-radio-group">
          <input
            type="radio"
            name="nav"
            id="glass-silver"
            checked={active === "portal"}
            onChange={() => {
              setActive("portal");
              navigate("/");
            }}
          />
          <label htmlFor="glass-silver">Murban Client Portal</label>

          <input
            type="radio"
            name="nav"
            id="glass-gold"
            checked={active === "home"}
            onChange={() => {
              setActive("home");
              window.open("https://murban-eng.com/", "_blank", "noopener,noreferrer");
            }}
          />
          <label htmlFor="glass-gold">Home Page</label>

          <input
            type="radio"
            name="nav"
            id="glass-platinum"
            checked={active === "contact"}
            onChange={() => {
              setActive("contact");
              window.open(
                "https://murban-eng.com/contact-us/",
                "_blank",
                "noopener,noreferrer",
              );
            }}
          />
          <label htmlFor="glass-platinum">Contact Information</label>

          <div className="glass-glider"></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
