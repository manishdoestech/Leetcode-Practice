import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProblemFilterProvider } from "@/context/ProblemFilterContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetCode Practice",
  description: "A collection of LeetCode problems and their solutions",
  icons: {
    icon: "/leetcode.ico",
    shortcut: "/leetcode.ico",
    apple: "/leetcode.ico",
  },
  openGraph: {
    title: "LeetCode Practice",
    description: "A collection of LeetCode problems and their solutions",
    url: "https://dsa.buildwithmanish.com",
    siteName: "LeetCode Practice",
    images: [
      {
        url: "https://dsa.buildwithmanish.com/Arch.png",
        width: 1200,
        height: 630,
        alt: "LeetCode Practice - Problem solving tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetCode Practice",
    description: "A collection of LeetCode problems and their solutions",
    images: ["https://dsa.buildwithmanish.com/Arch.png"],
  },
  metadataBase: new URL("https://dsa.buildwithmanish.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ProblemFilterProvider>
            <Navbar />
            <div className="pt-20 px-4 sm:px-6 lg:px-8">{children}</div>
            <Footer />
          </ProblemFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
