import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/useTranslation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExplorerProvider } from "@/context/ExplorerContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "রিপার্টরি এআই - কৃত্রিম বুদ্ধিমত্তা-চালিত হোমিওপ্যাথিক রেপার্টরি",
  description:
    "কেন্টের রেপার্টরি ভিত্তিক বুদ্ধিমান লক্ষণ বিশ্লেষণ এবং ওষুধের পরামর্শ। লক্ষণ অনুসন্ধান করুন, ওষুধ খুঁজুন এবং কৃত্রিম বুদ্ধিমত্তা-চালিত হোমিওপ্যাথিক নির্দেশনা পান।",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "রিপার্টরি এআই",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body
        className={`${inter.variable} ${notoBengali.variable} font-sans bg-background text-foreground`}
      >
        <ThemeProvider>
          <I18nProvider>
            <ExplorerProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ExplorerProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
