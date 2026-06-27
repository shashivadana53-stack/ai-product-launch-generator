import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ImagePrompt from "./pages/ImagePrompt";
import "./App.css";
import ExportDOCXPage from "./pages/ExportDOCXPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            marginLeft: "280px",
            width: "calc(100% - 280px)",
            minHeight: "100vh",
            padding: "20px",
            background: "linear-gradient(135deg,#ff8a00,#ff5f6d,#8b5cf6)",
            boxSizing: "border-box",
            overflowX: "hidden",
            flex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/image-prompt"
              element={<ImagePrompt />}
            />
            <Route
              path="/export-docx"
              element={<ExportDOCXPage />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;