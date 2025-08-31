const OfficialButton = () => (
  <a href="https://murban-eng.com" target="_blank" rel="noopener noreferrer">
    <button className="official-button">
      Official Website
      <div className="icon-1">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L16 12H8z" />
        </svg>
      </div>
      <div className="icon-2">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="6" />
        </svg>
      </div>
      <div className="icon-3">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" />
        </svg>
      </div>
    </button>
  </a>
);

export default OfficialButton;
