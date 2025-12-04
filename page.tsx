export default function ChatPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#111827",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Chat with your AI Girlfriend
      </h1>
      <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
        Type something below to start chatting! (OpenAI key is loaded)
      </p>
      <div style={{ marginTop: "2rem" }}>
        <input 
          type="text" 
          placeholder="Your message..." 
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "none",
            width: "300px",
            marginRight: "1rem"
          }} 
        />
        <button style={{
          padding: "1rem 2rem",
          background: "#ec4899",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontWeight: "bold"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}