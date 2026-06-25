import {
Document,
Packer,
Paragraph,
HeadingLevel,
} from "docx";

import { saveAs } from "file-saver";

function ExportDOCX({ content, formData }) {

const exportWord = async () => {


if (!content) {
  alert("Generate content first");
  return;
}

const emailContent =
  typeof content.email === "object"
    ? `


${content.email.subject || ""}

${content.email.greeting || ""}

${content.email.paragraphs?.join("\n\n") || ""}

${content.email.closing || ""}
`
: content.email || "";


const doc = new Document({
  sections: [
    {
      children: [

        new Paragraph({
          text: "AI Product Launch Report",
          heading: HeadingLevel.TITLE,
        }),

        new Paragraph({
          text: `Product: ${formData.productName}`,
        }),

        new Paragraph({
          text: `Occasion: ${formData.occasion}`,
        }),

        new Paragraph({
          text: `Price Range: ${formData.priceRange}`,
        }),

        new Paragraph({
          text: `Urgency Level: ${formData.urgencyLevel}`,
        }),

        new Paragraph({
          text: "",
        }),

        new Paragraph({
          text: "Instagram Caption",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(
          content.instagram || ""
        ),

        new Paragraph({
          text: "WhatsApp Message",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(
          content.whatsapp || ""
        ),

        new Paragraph({
          text: "Email Content",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(
          emailContent
        ),

        new Paragraph({
          text: "LinkedIn Post",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(
          content.linkedin || ""
        ),

        new Paragraph({
          text: "Facebook Post",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(
          content.facebook || ""
        ),
      ],
    },
  ],
});

const blob =
  await Packer.toBlob(doc);

saveAs(
  blob,
  "Marketing-Report.docx"
);


};

return (
<button
onClick={exportWord}
style={{
background: "#2563eb",
color: "white",
padding: "12px 18px",
border: "none",
borderRadius: "10px",
cursor: "pointer",
marginTop: "10px",
marginLeft: "10px",
}}
>
📄 Export DOCX </button>
);
}

export default ExportDOCX;
