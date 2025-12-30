import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getGlobalSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "Shield Hood Services | Commercial Hood Cleaning",
    template: "%s | Shield Hood Services",
  },
  description:
    "Local SEO-ready service pages for Shield Hood Services with fast, mobile-first layouts and schema markup.",
  metadataBase: new URL("https://hoodscleaning.net"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html lang="en">
      <body className="antialiased">
        <SiteHeader settings={settings} />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
