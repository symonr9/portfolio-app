import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  defaultDescription,
  defaultTitle,
  getSiteUrl,
  siteName,
} from "@/lib/site";
import { SiteShell } from "./_components/site-shell";
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
  metadataBase: getSiteUrl(),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
