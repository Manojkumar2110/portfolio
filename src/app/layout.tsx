import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manoj Kumar — Developer & Designer",
  description: "Premium portfolio of Manoj Kumar — Full Stack Developer, UI/UX Designer, and Creative Technologist.",
  keywords: ["developer", "designer", "portfolio", "full stack", "react", "next.js"],
  openGraph: {
    title: "Manoj Kumar — Developer & Designer",
    description: "Premium portfolio of Manoj Kumar — Full Stack Developer, UI/UX Designer, and Creative Technologist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} noise antialiased`} suppressHydrationWarning>
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
