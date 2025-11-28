import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anime Runner",
  description: "Tap or press Space to jump. Avoid obstacles and get a high score!",
  icons: {
    icon: "/icon.png",
  },
  manifest: "/farcaster.json",
  other: {
    "fc:channel": "base",
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "/icon.png",
      button: {
        title: "Play Now",
        action: {
          type: "launch_miniapp",
          name: "Anime Runner",
          url: "https://anime-runner.vercel.app/",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}