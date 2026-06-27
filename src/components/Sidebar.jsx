import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div className={`sidebar ${open ? "show" : ""}`}>
        <Link to="/" className="menu-item" onClick={() => setOpen(false)}>
          🏠 Home
        </Link>

        <Link to="/dashboard" className="menu-item" onClick={() => setOpen(false)}>
          📊 Dashboard
        </Link>

        <Link to="/history" className="menu-item" onClick={() => setOpen(false)}>
          🕒 History
        </Link>

        <Link to="/image-prompt" className="menu-item" onClick={() => setOpen(false)}>
          🖼 AI Image Prompt
        </Link>

        <Link to="/export-docx" className="menu-item" onClick={() => setOpen(false)}>
          📄 Download PDF Kit
        </Link>
      </div>
    </>
  );
}

export default Sidebar;