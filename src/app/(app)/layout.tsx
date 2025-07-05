import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";
import "../globals.css"; // Import from src/
import { Inter, Geist_Mono } from "next/font/google"; // Use Inter

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "StreamCalander",
  description: "Schedule your youtube playlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        
        <main className="relative over ">
        {children}
        </main>
       

      </body>
    </html>
  );
}
