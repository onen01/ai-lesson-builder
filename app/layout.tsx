import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AI Lesson Builder",
  description: "Transform any PDF into an interactive AI-powered lesson",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
