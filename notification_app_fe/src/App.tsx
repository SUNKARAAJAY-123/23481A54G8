import { useState } from "react";
import { Log } from "../../logging_middleware/log";

function App() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    try {
      await Log("frontend", "info", "component", `Notification sent: ${title} - ${message}`);
      setStatus("success");
      setTitle("");
      setMessage("");
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    color: "#333",
    marginBottom: "30px",
    fontSize: "2.5rem",
    fontWeight: "300",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "15px 20px",
    marginBottom: "20px",
    border: "2px solid #e1e5e9",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
    outline: "none",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: "120px",
    resize: "vertical",
    marginBottom: "30px",
  };

  const buttonStyle: React.CSSProperties = {
    background: isLoading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "15px 40px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  };

  const statusStyle: React.CSSProperties = {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "20px",
    fontWeight: "500",
    fontSize: "14px",
    opacity: status === "idle" ? 0 : 1,
    transition: "opacity 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>📢 Notification Center</h1>

        <input
          type="text"
          placeholder="Enter notification title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            ...inputStyle,
            borderColor: title ? "#667eea" : "#e1e5e9",
          }}
          disabled={isLoading}
        />

        <textarea
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            ...textareaStyle,
            borderColor: message ? "#667eea" : "#e1e5e9",
          }}
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          style={buttonStyle}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
          }}
        >
          {isLoading ? "🚀 Sending..." : "📤 Send Notification"}
        </button>

        {status === "success" && (
          <div style={{ ...statusStyle, backgroundColor: "#d4edda", color: "#155724" }}>
            ✅ Notification sent successfully!
          </div>
        )}

        {status === "error" && (
          <div style={{ ...statusStyle, backgroundColor: "#f8d7da", color: "#721c24" }}>
            ❌ Please fill in both title and message.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;