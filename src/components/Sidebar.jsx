import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/" className="menu-item">
        🏠 Home
      </Link>

      <Link to="/dashboard" className="menu-item">
        📊 Dashboard
      </Link>

      <Link to="/history" className="menu-item">
        🕒 History
      </Link>

      <Link to="/image-prompt" className="menu-item">
        🖼 AI Image Prompt
      </Link>

      <Link to="/export-docx" className="menu-item">
        📄 Download PDF Kit
      </Link>

    </div>
  );
}

export default Sidebar;