import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SearchProvider } from './context/SearchContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exchange",
  description: "Cryptocurrency Exchange Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D0E12] flex flex-col min-h-screen`}>
        <SearchProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
