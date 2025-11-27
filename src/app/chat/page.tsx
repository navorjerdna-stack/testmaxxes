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
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Chat with your AI Girlfriend
      </h1>
      <p style={{ fontSize: "1.5rem", opacity: 0.8 }}>
        Type something – she will answer immediately!
      </p>
      <div style={{ marginTop: "3rem" }}>
        <input type="text" placeholder="Your message..." style={{ padding: "1rem", width: "400px", borderRadius: "0.5rem", border: "none" }} />
        <button style={{
          marginLeft: "1rem",
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
