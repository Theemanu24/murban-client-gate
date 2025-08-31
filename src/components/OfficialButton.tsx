import { Link } from "react-router-dom";

const OfficialButton = () => (
  <div className="flex flex-col sm:flex-row gap-4">
    <Link to="/resources" className="button" data-text="Portal">
      <span className="actual-text">&nbsp;Portal&nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;Portal&nbsp;</span>
    </Link>
    <a
      href="https://murban-eng.com"
      target="_blank"
      rel="noopener noreferrer"
      className="button"
      data-text="Official Website"
    >
      <span className="actual-text">&nbsp;Official Website&nbsp;</span>
      <span aria-hidden="true" className="hover-text">
        &nbsp;Official Website&nbsp;
      </span>
    </a>
  </div>
);

export default OfficialButton;

