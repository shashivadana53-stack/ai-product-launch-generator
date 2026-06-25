import { useState, useEffect } from "react";
import axios from "axios";

function ImagePrompt() {
  const [product, setProduct] = useState("");
  const [occasion, setOccasion] = useState("");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);

useEffect(() => {
  fetchHistory();
}, []);

const fetchHistory = async () => {

  try {

    const response = await axios.get(
      "http://127.0.0.1:5000/image-history"
    );

    setHistory(response.data);

  } catch (error) {

    console.log(error);

  }

};

  const generatePrompt = async () => {

  try {

    const response = await axios.post(
      "http://127.0.0.1:5000/generate-image-prompt",
      {
        productName: product,
        occasion: occasion
      }
    );

    setPrompt(response.data.prompt);

    fetchHistory();

  } catch (error) {

    console.log(error);
    alert(
      error.response?.data?.error ||
      error.message
    );

  }

};

  return (
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "25px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <h1>🖼 AI Image Prompt Generator</h1>

      <input
        type="text"
        placeholder="Product Name"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxSizing: "border-box"
        }}
      />

      <input
        type="text"
        placeholder="Occasion"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={generatePrompt}
        style={{
          marginTop: "20px",
          padding: "15px 35px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          background:
            "linear-gradient(135deg,#ff8a00,#7b2ff7)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          boxShadow: "0 8px 20px rgba(123,47,247,0.3)",
          transition: "0.3s"
        }}
      >
         🚀 Generate Prompt
      </button>

      {prompt && (
        <div
          style={{
            marginTop: "30px",
            background: "#f3f4f6",
            padding: "20px",
            borderRadius: "15px",
            whiteSpace: "pre-line",
          }}
        >
          {prompt}
        </div>
      )}
      <div
style={{
marginTop:"30px"
}}
>

<h2>
🕒 Prompt History
</h2>

{
history.map((item)=>(

<div
key={item.id}
style={{
background: "linear-gradient(135deg,#ff8a00,#7b2ff7)",
color: "white",
padding: "20px",
marginTop: "20px",
borderRadius: "18px",
boxShadow: "0 8px 20px rgba(123,47,247,0.3)",
border: "1px solid rgba(255,255,255,0.2)"
}}
>

<h3 style={{
fontSize: "22px",
fontWeight: "bold",
marginBottom: "10px"
}}>{item.product_name}</h3>

<p style={{
fontSize: "16px",
color: "#f3f3f3"
}}>
Occasion: {item.occasion}
</p>

<p
style={{
whiteSpace:"pre-line",
marginTop:"15px",
background:"white",
color:"#333",
padding:"15px",
borderRadius:"12px",
lineHeight:"1.7",
fontSize:"15px"
}}
>
{item.prompt}
</p>

</div>

))
}

</div>
    </div>
  );
}

export default ImagePrompt;