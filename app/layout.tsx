import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website-IA — Chat",
  description: "Une interface de chat IA inspirée de Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
