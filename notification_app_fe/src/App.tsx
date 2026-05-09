import { useState } from "react";
import { Log } from "../../logging_middleware/log";

function App() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    alert("Notification Sent Successfully");

    await Log("frontend", "info", "component", `Notification sent: ${title} - ${message}`);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Notification App</h1>

      <br />

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <textarea
        placeholder="Enter Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "300px",
          height: "100px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Send Notification
      </button>
    </div>
  );
}

export default App;