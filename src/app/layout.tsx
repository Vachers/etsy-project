import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PROJEKTİF PRO - Dijital Proje & Satış Takip Sistemi",
  description: "Enterprise seviyede dijital proje ve satış takip sistemi. Notion tarzı veri girişi, gelişmiş analytics ve multi-platform satış tracking.",
  keywords: ["proje yönetimi", "satış takibi", "analytics", "dashboard", "etsy", "e-ticaret"],
  authors: [{ name: "PROJEKTİF PRO" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
