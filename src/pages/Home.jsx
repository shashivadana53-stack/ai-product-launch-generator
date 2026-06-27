import GeneratorForm from "../components/GeneratorForm";

function Home() {
  return (
    <>
      <div
        style={{
          background: "linear-gradient(90deg,#ff7a18,#7b2ff7)",
          color: "white",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "bold",
          marginBottom: "25px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        🤖 AI Seasonal Product Launch Announcement Generator
      </div>

      <GeneratorForm />
    </>
  );
}

export default Home;