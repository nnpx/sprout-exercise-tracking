import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Sprout | Activity Dashboard",
  description: "Professional health and activity logging system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-[var(--color-bg-main)] text-[var(--color-text-main)]">
        <Navbar />
        <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}