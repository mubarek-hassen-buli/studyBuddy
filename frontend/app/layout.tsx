import { Plus_Jakarta_Sans, Newsreader, Caveat, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Folio — Turn your materials into knowledge",
  description: "AI-powered study companion: generate flashcards, quizzes, and chat with your materials.",
};

import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${newsreader.variable} ${caveat.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[#F8FAF6] text-slate-800 selection:bg-emerald-100 selection:text-[#0D382B]">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
