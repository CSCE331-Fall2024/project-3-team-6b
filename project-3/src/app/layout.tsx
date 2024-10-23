import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panda Express POS System",
  description: "Created by Team 6B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
