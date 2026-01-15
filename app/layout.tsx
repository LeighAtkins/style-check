import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sofa Style Visualizer | See Your Sofa in Any Fabric",
  description:
    "Upload a photo of your sofa and instantly visualize how it would look with different fabric covers. Powered by AI.",
  keywords: [
    "sofa cover",
    "fabric visualizer",
    "interior design",
    "home decor",
    "AI visualization",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
