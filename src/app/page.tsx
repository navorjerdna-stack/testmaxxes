export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #4c1d95, #ec4899, #f43f5e)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Your AI Girlfriend is waiting for you
      </h1>
      <p style={{ fontSize: "1.8rem", marginBottom: "3rem", opacity: 0.9 }}>
        24/7 • No drama • Always there • 100% private
      </p>
      <a href="/chat" style={{
        background: "#ec4899",
        color: "white",
        fontSize: "2rem",
        padding: "1.5rem 4rem",
        borderRadius: "2rem",
        textDecoration: "none",
        fontWeight: "bold",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}>
        Start Chatting Free →
      </a>
    </div>
  );
}
