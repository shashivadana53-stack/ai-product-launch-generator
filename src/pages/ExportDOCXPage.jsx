import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function ExportDOCXPage() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestCampaign();
  }, []);

  const fetchLatestCampaign = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/latest-campaign"
      );

      if (
        response.data &&
        !response.data.error &&
        response.data.product_name
      ) {
        setCampaign(response.data);
      } else {
        setCampaign(null);
      }
    } catch (error) {
      console.log(error);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!campaign) {
      alert("No campaign generated yet.");
      return;
    }

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Product Launch Content Kit", 20, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(
      `Product: ${campaign.product_name || ""}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Occasion: ${campaign.occasion || ""}`,
      20,
      y
    );

    y += 15;

    const sections = [
      ["Instagram", campaign.instagram || ""],

      ["WhatsApp", campaign.whatsapp || ""],

      [
        "Email",
        `Subject: ${campaign.email_subject || ""}

${campaign.email_body || ""}`
      ],

      ["LinkedIn", campaign.linkedin || ""],

      ["Facebook", campaign.facebook || ""]
    ];

    sections.forEach(([title, content]) => {
      doc.setFontSize(14);
      doc.text(title, 20, y);

      y += 8;

      doc.setFontSize(11);

      const lines = doc.splitTextToSize(
        content,
        170
      );

      doc.text(lines, 20, y);

      y += lines.length * 6 + 12;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(
      `${campaign.product_name}-Marketing-Kit.pdf`
    );
  };

  return (
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
      }}
    >
      <h1>📄 Download PDF Kit</h1>

      {loading ? (
        <p>Loading latest campaign...</p>
      ) : !campaign ? (
        <>
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            No campaign generated yet.
          </p>

          <p>
            Please generate content from Home page first.
          </p>
        </>
      ) : (
        <>
          <h2>{campaign.product_name}</h2>

          <p>
            <strong>Occasion:</strong>{" "}
            {campaign.occasion}
          </p>

          <button
            onClick={downloadPDF}
            style={{
              marginTop: "20px",
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📥 Download PDF Kit
          </button>
        </>
      )}
    </div>
  );
}

export default ExportDOCXPage;