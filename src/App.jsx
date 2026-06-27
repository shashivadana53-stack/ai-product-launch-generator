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
      <div className="app">

        <Sidebar />

        <div className="main-content">
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