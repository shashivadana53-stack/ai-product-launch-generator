import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import OutputCard from "./OutputCard";
import "../styles/Form.css";


function GeneratorForm() {
  const [formData, setFormData] = useState({
    productName: "",
    keyFeatures: "",
    occasion: "",
    priceRange: "",
    urgencyLevel: "",
  });

  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("campaignHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/generate",
        formData
      );

      setGeneratedContent(response.data);
      setActiveTab("");

      const newHistory = [
        {
          product: formData.productName,
          occasion: formData.occasion,
          date: new Date().toLocaleString(),
        },
        ...history,
      ];
      console.log(response.data);

      setHistory(newHistory);

      localStorage.setItem(
        "campaignHistory",
        JSON.stringify(newHistory)
      );

    } catch (error) {

        console.log(error);

        let message = "Something went wrong";

        if (error.response) {

          message =
            error.response.data.error ||
              "Server Error";

        }

        else if (error.request) {

          message =
            "Cannot connect to backend server";

        }

        else {

          message = error.message;

        }

        alert(message);

} finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (platform) => {
    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/regenerate",
        {
          platform,
          product: formData.productName,
        }
      );

if (platform === "email") {

  setGeneratedContent((prev) => ({
    ...prev,
    email_subject: response.data.subject,
    email_body: response.data.content,
  }));

}
else {

  setGeneratedContent((prev) => ({
    ...prev,
    [platform]: response.data.content,
  }));

}

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.error ||
        error.message
      );
    }
  };

  const getEmailContent = () => {

  if (!generatedContent) return "";

  return `
${generatedContent.email_subject || ""}

${generatedContent.email_body || ""}
`;

};

  const downloadFullPDF = () => {

    if (!generatedContent) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Product Launch Content Kit", 20, y);

    y += 20;

    const sections = [
      ["Instagram Caption", generatedContent.instagram],
      ["WhatsApp Message", generatedContent.whatsapp],
      ["Email Content", getEmailContent()],
      ["LinkedIn Post", generatedContent.linkedin],
      ["Facebook Post", generatedContent.facebook],
    ];

    sections.forEach(([title, content]) => {

      doc.setFontSize(14);
      doc.text(title, 20, y);

      y += 10;

      doc.setFontSize(11);

      const lines = doc.splitTextToSize(
        content || "",
        170
      );

      doc.text(lines, 20, y);

      y += lines.length * 6 + 12;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("Marketing-Kit.pdf");
  };

  return (
    <div className="form-container">

      <input
        type="text"
        name="productName"
        placeholder="Product Name"
        onChange={handleChange}
      />

      <textarea
        name="keyFeatures"
        placeholder="Key Features (One Per Line)"
        rows="4"
        onChange={handleChange}
      />

      <input
        type="text"
        name="occasion"
        placeholder="Target Occasion"
        onChange={handleChange}
      />

      <select
        name="priceRange"
        onChange={handleChange}
      >
        <option value="">Price Range</option>
        <option value="Budget">Budget</option>
        <option value="Mid Range">Mid Range</option>
        <option value="Premium">Premium</option>
        <option value="Luxury">Luxury</option>
      </select>

      <select
        name="urgencyLevel"
        onChange={handleChange}
      >
        <option value="">Urgency Level</option>
        <option value="Available Now">
          Available Now
        </option>
        <option value="Pre Order">
          Pre Order
        </option>
        <option value="Limited Stock">
          Limited Stock
        </option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? "Generating..."
          : "Generate Launch Content"}
      </button>

      {loading && (
        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          ⏳ Generating AI Content...
        </h2>
      )}

      

      {generatedContent && !loading && (
      <>
      <div className="tabs">

      <button
        className={activeTab==="instagram" ? "tab-active" : "tab-btn"}
        onClick={() => setActiveTab("instagram")}
      >
        Instagram
      </button>

      <button
        className={activeTab==="whatsapp" ? "tab-active" : "tab-btn"}
        onClick={() => setActiveTab("whatsapp")}
      >
        WhatsApp
      </button>

      <button
        className={activeTab==="email" ? "tab-active" : "tab-btn"}
        onClick={() => setActiveTab("email")}
      >
        Email
      </button>

      <button
        className={activeTab==="linkedin" ? "tab-active" : "tab-btn"}
        onClick={() => setActiveTab("linkedin")}
      >
      LinkedIn
      </button>

      <button
        className={activeTab==="facebook" ? "tab-active" : "tab-btn"}
        onClick={() => setActiveTab("facebook")}
      >
        Facebook
      </button>

      </div>

      {activeTab==="instagram" &&
      (
      <>
      <p style={{fontWeight:"bold"}}>
      Characters: {generatedContent.instagram?.length || 0}
      </p>

      <OutputCard
      title="Instagram Caption"
      content={generatedContent.instagram}
      onRegenerate={() => handleRegenerate("instagram")}
      />
      </>
      )}

      {activeTab==="whatsapp" &&
      (
      
      <>
      <p style={{fontWeight:"bold"}}>
      Characters: {generatedContent.watsapp?.length || 0}
      </p>
      <OutputCard
      title="WhatsApp Message"
      content={generatedContent.whatsapp}
      onRegenerate={() => handleRegenerate("whatsapp")}
      />
      </>
      )}

      {activeTab==="email" &&
      (
      <>
      <p style={{fontWeight:"bold"}}>
      Characters: {getEmailContent().length}
      </p>
      <OutputCard
      title="Email Content"
      content={getEmailContent()}
      onRegenerate={() => handleRegenerate("email")}
      />
      </>
      )}

      {activeTab==="linkedin" &&
      (

      <>
      <p style={{fontWeight:"bold"}}>
      Characters: {generatedContent.linkedin?.length || 0}
      </p>
      <OutputCard
      title="LinkedIn Post"
      content={generatedContent.linkedin}
      onRegenerate={() => handleRegenerate("linkedin")}
      />
      </>
      )}

      {activeTab==="facebook" &&
      (

      <>
      <p style={{fontWeight:"bold"}}>
      Characters: {generatedContent.facebook?.length || 0}
      </p>
      <OutputCard
      title="Facebook Post"
      content={generatedContent.facebook}
      onRegenerate={() => handleRegenerate("facebook")}
      />
      </>
      )}

      </>
      )}

      <div
        style={{
          marginTop: "30px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>📜 Generation History</h2>

        {history.length === 0 ? (
          <p>No history available</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <strong>{item.product}</strong>

              <br />

              <small>{item.occasion}</small>

              <br />

              <small>{item.date}</small>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default GeneratorForm;