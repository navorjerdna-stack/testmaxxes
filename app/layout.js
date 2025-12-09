import "./globals.css";

export const metadata = {
  title: "AI Companion",
  description: "Tvoj osebni AI prijatelj",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body>
        {children}
      </body>
    </html>
  );
}
