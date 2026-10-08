import type { Metadata, Viewport } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { StoreProvider } from "@/lib/store";
import { SITE_URL, withBase } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Slow Stack: motion snacks for your workday";
const DESCRIPTION =
  "Desk exercises and micro workouts at work, one small move at a time. Slow Stack serves exercise snacks that fit between meetings: bare minimum, next exercise, or feeling spunky. Free, no account, works offline.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Slow Stack",
  keywords: [
    "desk exercises",
    "micro workouts at work",
    "exercise snacks",
    "motion snacks",
    "office stretches",
    "workday movement",
  ],
  alternates: { canonical: `${SITE_URL}/` },
  icons: {
    icon: [
      { url: withBase("/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: withBase("/apple-touch-icon.png"), sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Slow Stack",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  other: {
    // Older iOS Safari still keys standalone mode off this legacy tag.
    "apple-mobile-web-app-capable": "yes",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Slow Stack",
    title: TITLE,
    description:
      "Exercise snacks for your workday. Desk exercises and micro workouts at work, one small move at a time.",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "Slow Stack: motion snacks for your workday",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Exercise snacks for your workday. Desk exercises and micro workouts at work, one small move at a time.",
    images: [`${SITE_URL}/og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f0",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Slow Stack",
  url: `${SITE_URL}/`,
  description: DESCRIPTION,
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "USD",
      name: "Slow Stack Pro (one-time)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Slow Stack: motion snacks for your workday</h1>
            <p>
              Desk exercises, micro workouts at work, and exercise snacks. Turn
              on JavaScript to use the app.
            </p>
          </div>
        </noscript>
        <ServiceWorkerRegister />
        <StoreProvider>
          <main className="flex-1">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
