import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/layout/floating-nav";
import { MobileDock } from "@/components/layout/mobile-dock";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KisanMitr AI - Smart Agriculture Companion",
  description: "AI advisory, IoT insights, and farmer marketplace for smart agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-sand text-brown font-sans flex overflow-x-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          <main className="flex-1 min-w-0 pb-32 md:pb-12 md:pt-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
            {children}
          </main>
          
          {/* Right Context Panel (Desktop Only) */}
          <RightPanel />
        </div>

        {/* Mobile/Tablet Nav Overlays */}
        <div className="md:hidden">
          <MobileDock />
        </div>
      </body>
    </html>
  );
}
