import { Link } from "react-router-dom";

const OfficialButton = () => (
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <Link to="/resources" className="learn-more">
      <span className="circle" aria-hidden="true">
        <span className="icon arrow"></span>
      </span>
      <span className="button-text">Portal</span>
    </Link>
    <a
      href="https://murban-eng.com"
      target="_blank"
      rel="noopener noreferrer"
      className="learn-more"
    >
      <span className="circle" aria-hidden="true">
        <span className="icon arrow"></span>
      </span>
      <span className="button-text official-website">Official Website</span>
    </a>
  </div>
);

export default OfficialButton;

