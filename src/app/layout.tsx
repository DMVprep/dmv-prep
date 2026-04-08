// src/app/layout.tsx
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { WebSiteSchema, OrganizationSchema } from "@/components/seo/JsonLd";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "600", "800"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "DMV Practice Test 2026 — Pass Your Permit Test First Try",
    template: "%s | DMV Prep Pro",
  },
  description:
    "Free DMV practice tests for all 50 states. Plain-English explanations, road sign tests, and exam simulators. Designed for first-time drivers and non-native speakers.",
  keywords: ["DMV practice test", "permit test", "driving test", "road signs", "DMV handbook"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dmv-prep.com",
    siteName: "DMVPrep Pro",
    images: [
      {
        url: "https://dmv-prep.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DMVPrep Pro - Free DMV Practice Tests for All 50 States",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-26SVW89XHN" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-26SVW89XHN");
          `}
        </Script>
        <Providers>
          <WebSiteSchema />
          <OrganizationSchema />
          {children}
          <Toaster position="top-right" />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
