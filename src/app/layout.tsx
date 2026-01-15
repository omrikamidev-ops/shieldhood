import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getGlobalSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "Hoods Cleaning | Commercial Hood Cleaning",
    template: "%s | Hoods Cleaning",
  },
  description:
    "Commercial kitchen hood and exhaust cleaning for restaurants, hotels, and food service facilities.",
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
