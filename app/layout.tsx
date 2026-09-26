import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Health AI Sandbox",
  description: "A private workspace for synthetic health AI evaluation and governed evidence workflows.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
