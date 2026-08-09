import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/components/persona-store";
import ShineLayer from "@/components/shine";
import { themeScript } from "@/components/theme";
import { cohort, faqs } from "@/lib/challenge";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const SITE = "https://dhruv-vicodathon-abtalks.vercel.app";
const TITLE = "ABTalks — 60 days of proof, not promises";
const DESC =
  "A free 60-day coding challenge for Indian college students. Build one small thing every night, ship a GitHub commit and a LinkedIn post, and turn consistency into a public track record recruiters can find.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s · ABTalks" },
  description: DESC,
  applicationName: "ABTalks",
  keywords: [
    "60 day coding challenge",
    "coding challenge for Indian college students",
    "build in public",
    "daily coding streak",
    "student developer portfolio",
    "GitHub commit streak",
    "placement preparation",
  ],
  authors: [{ name: "ABTalks" }],
  creator: "ABTalks",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE,
    siteName: "ABTalks",
    title: TITLE,
    description: DESC,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c22" },
    { media: "(prefers-color-scheme: light)", color: "#faf8ff" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ABTalks",
      url: SITE,
      description: DESC,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      url: SITE,
      name: "ABTalks",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "en-IN",
    },
    {
      "@type": "Course",
      name: `ABTalks 60-Day ${cohort.track} Challenge`,
      description: DESC,
      provider: { "@id": `${SITE}/#org` },
      isAccessibleForFree: true,
      inLanguage: "en-IN",
      educationalLevel: "Undergraduate",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT1H",
        name: cohort.name,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <div className="aurora" aria-hidden="true">
          <span />
          <span />
          <span />
          <em />
          <em />
          <em />
          <em />
          <em />
          <em />
          <i />
          <i />
          <i />
        </div>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ShineLayer />
        <PersonaProvider>{children}</PersonaProvider>
      </body>
    </html>
  );
}
