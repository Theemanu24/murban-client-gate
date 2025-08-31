import React from "react";
import "@/styles/official-website-button.css";

const OfficialWebsiteButton: React.FC = () => (
  <div className="w-full sm:w-auto">
    <a
      href="https://murban-eng.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="official-button type--C"
    >
      <div className="official-button__line"></div>
      <div className="official-button__line"></div>
      <span className="official-button__text">Visit Website</span>
      <div className="official-button__drow1"></div>
      <div className="official-button__drow2"></div>
    </a>
  </div>
);

export default OfficialWebsiteButton;
