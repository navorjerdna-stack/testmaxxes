import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Girlfriend - TestMaxxes",
  description: "Your perfect AI companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
