
import type { Metadata } from "next";
import "../globals.css"; // Import from src/


export const metadata: Metadata = {
  title: "StreamCalendar",
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
