import { useEffect, useState } from "react";
import axios from "axios";

function History() {

const [history, setHistory] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedCampaign, setSelectedCampaign] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [selectedOccasion, setSelectedOccasion] = useState("All");
useEffect(() => {


fetchHistory();


}, []);

const fetchHistory = async () => {


try {

  const response = await axios.get(
    "https://ai-product-launch-generator.onrender.com/history"
  );
  setHistory(response.data);

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}


};
const fetchDetails = async (id) => {

  try {

    const response = await axios.get(
      `https://ai-product-launch-generator.onrender.com/history/${id}`
    );

    setSelectedCampaign(response.data);

  } catch (error) {

    console.log(error);

  }

};

const deleteCampaign = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete this campaign permanently?"
    );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `https://ai-product-launch-generator.onrender.com/delete-campaign/${id}`
    );

    fetchHistory();

    alert("Campaign deleted successfully");

  } catch (error) {

    console.log(error);

  }

};

const filteredHistory = history.filter((item) => {

  const matchesSearch =
    item.product_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesOccasion =
    selectedOccasion === "All"
      ? true
      : item.occasion === selectedOccasion;

  return matchesSearch && matchesOccasion;

});

return (
<div
style={{
background: "white",
padding: "30px",
borderRadius: "15px",
}}
> <h1>🕒 Campaign History</h1>
<button
onClick={async () => {

const confirmClear =
window.confirm(
"Delete ALL campaigns?"
);

if(!confirmClear) return;

try{

await axios.delete(
"https://ai-product-launch-generator.onrender.com/clear-history"
);

fetchHistory();

alert("History cleared");

}catch(error){

console.log(error);

}

}}
style={{
background:"red",
color:"white",
border:"none",
padding:"10px 15px",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"20px"
}}
>
🗑 Clear History
</button>
<input
  type="text"
  placeholder="🔍 Search Product..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  }}
/>
<select
  value={selectedOccasion}
  onChange={(e) =>
    setSelectedOccasion(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  }}
>
  <option value="All">
    All Occasions
  </option>

  {[...new Set(history.map(item => item.occasion))]
    .map((occasion) => (
      <option
        key={occasion}
        value={occasion}
      >
        {occasion}
      </option>
    ))
  }

</select>


  {loading ? (

    <p>Loading history...</p>

  ) : history.length === 0 ? (

    <p>No campaigns generated yet.</p>

  ) : filteredHistory.length === 0 ? (

<p>No matching campaigns found.</p>

) :
  
  (

    filteredHistory.map((item) => (

      <div
        key={item.id}
        style={{
          padding: "15px",
          marginTop: "10px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h3>{item.product_name}</h3>

        <p>
          <strong>Occasion:</strong>{" "}
          {item.occasion}
        </p>

        <p>
          <strong>Price Range:</strong>{" "}
          {item.price_range}
        </p>

        <p>
          <strong>Urgency:</strong>{" "}
          {item.urgency_level}
        </p>

        <p>
          <strong>Campaign ID:</strong>{" "}
          {item.id}
        </p>

        <p>
          <strong>Created:</strong>{" "}
            {new Date(item.created_at).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata"
            })}
        </p>
        <button
          onClick={() => fetchDetails(item.id)}
          style={{
            background: "#7b2ff7",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          View Details
        </button>

        <button
          onClick={() => deleteCampaign(item.id)}
          style={{
            background:"red",
            color:"white",
            border:"none",
            padding:"10px 15px",
            borderRadius:"8px",
            cursor:"pointer",
            marginLeft:"10px"
          }}
        >
          Delete
        </button>

      </div>

    ))

  )}

  {selectedCampaign && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.6)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}
>

<div
style={{
background:"white",
width:"80%",
maxHeight:"80vh",
overflowY:"auto",
padding:"25px",
borderRadius:"15px"
}}
>

<h2>{selectedCampaign.product_name}</h2>

<p>
<strong>Occasion:</strong>
{" "}
{selectedCampaign.occasion}
</p>

<hr />

<h3>Instagram</h3>
<p>{selectedCampaign.instagram}</p>

<h3>WhatsApp</h3>
<p>{selectedCampaign.whatsapp}</p>

<h3>Email Subject</h3>
<p>{selectedCampaign.email_subject}</p>

<h3>Email Body</h3>
<p>{selectedCampaign.email_body}</p>

<h3>LinkedIn</h3>
<p>{selectedCampaign.linkedin}</p>

<h3>Facebook</h3>
<p>{selectedCampaign.facebook}</p>

<button
onClick={() => setSelectedCampaign(null)}
style={{
background:"red",
color:"white",
border:"none",
padding:"10px 15px",
borderRadius:"8px",
cursor:"pointer"
}}
>
Close
</button>

</div>

</div>

)}
</div>


);
}

export default History;
