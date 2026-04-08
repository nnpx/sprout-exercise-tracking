import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Sprout | Minty Wellness",
  description: "A personalized, NoSQL-powered health and activity logger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The antialiased class makes text look smoother, 
        and min-h-screen ensures our background color covers the whole page 
      */}
      <body className="min-h-screen flex flex-col antialiased bg-[var(--color-brand-cream)] bg-gradient-to-br from-[#FAF9F6] via-[#F0F4F1] to-[#E8F5E9] text-[var(--color-brand-teal)]">
        <Navbar />

        {/* Main Content Container - centers everything and limits maximum width */}
        <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

      </body>
    </html>
  );
}