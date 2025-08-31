import { Link } from "react-router-dom";

const OfficialButton = () => (
  <div className="main">
    <div className="up">
      <Link to="/resources" className="card1">
        <span className="card-label">Portal</span>
      </Link>
      <a
        href="https://murban-eng.com"
        target="_blank"
        rel="noopener noreferrer"
        className="card2"
      >
        <span className="card-label">Official Website</span>
      </a>
    </div>
    <div className="down">
      <a
        href="https://www.linkedin.com/company/murban-engineering/"
        target="_blank"
        rel="noopener noreferrer"
        className="card3"
      >
        <span className="card-label">LinkedIn</span>
      </a>
      <Link to="/contact" className="card4">
        <span className="card-label">Contact Us</span>
      </Link>
    </div>
  </div>
);

export default OfficialButton;
