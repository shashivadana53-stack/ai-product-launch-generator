import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ImagePrompt from "./pages/ImagePrompt";
import ExportDOCXPage from "./pages/ExportDOCXPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            marginLeft: "260px",
            flex: 1,
            overflowX: "hidden",
            minHeight: "100vh",
            width: "calc(100% - 300px)",
            overflowX: "hidden",
            background:
              "linear-gradient(135deg,#ff8a00,#ff5f6d,#8b5cf6)",
            padding: "20px",
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