import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Panda Express POS System",
  description: "Created by Team 6B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
