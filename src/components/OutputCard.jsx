import "../styles/OutputCard.css";

function OutputCard({
  title,
  content,
  onRegenerate,
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert(`${title} copied successfully!`);
  };

  return (
    <div className="output-card">

      <div className="card-header">

        <h3>{title}</h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            className="copy-btn"
            onClick={handleCopy}
          >
            Copy
          </button>

          {onRegenerate && (
            <button
              className="regen-btn"
              onClick={onRegenerate}
            >
              🔄 Regenerate
            </button>
          )}

        </div>

      </div>

      <p>{content}</p>

    </div>
  );
}

export default OutputCard;