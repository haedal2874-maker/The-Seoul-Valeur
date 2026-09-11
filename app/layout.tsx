import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { indexingEnabled, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Seoul Valeur | Seoul Beauty & Travel Journal",
    template: "%s | The Seoul Valeur"
  },
  description:
    "A Seoul K-beauty and travel magazine for global beauty seekers planning beauty trips, clinic questions, skincare shopping, and calm Seoul itineraries.",
  openGraph: {
    title: "The Seoul Valeur",
    description: "Seoul beauty and travel guidance for global K-beauty seekers.",
    siteName: "The Seoul Valeur",
    locale: "en_US",
    type: "website"
  },
  robots: indexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
