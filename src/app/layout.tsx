import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import { ShapeDefs, Toaster, TooltipProvider } from "@/components/ui";
import { SITE } from "@/lib/site";
import { fontVariables } from "@/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: free, private browser tools`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: "akdoescodes", url: "https://github.com/akdoescodes" }],
  creator: "akdoescodes",
  category: "multimedia",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: "/",
    title: `${SITE.name}: free, private browser tools`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: free, private browser tools`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "9utkPqfyxABf3rYfEAIfrGz4gdyLQZHNin2WKKq11SQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff8f6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-plain">
        <ShapeDefs />
        <TooltipProvider>
          <div className="app-root flex min-h-full flex-1 flex-col">
            <AppShell>{children}</AppShell>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
