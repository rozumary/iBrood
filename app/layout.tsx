import type React from "react"

import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/lib/translation-context"
import FontSizeInitializer from "@/components/font-size-initializer"
import LayoutComponent from "@/components/layout-component";

const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })
const _spaceGroteskBody = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" })

export const metadata: Metadata = {
  title: "iBrood - Queen Cell & Brood Pattern Analysis",
  description: "Intelligent system for monitoring hive health through queen cell and brood pattern analysis",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/IMG_3630.png",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "iBrood",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FFA500",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ margin: 0, padding: 0, height: '100%', width: '100%' }}>
      <head>
        <link rel="icon" href="/IMG_3630.png" type="image/png" />
        <link rel="icon" href="/IMG_3630.png" sizes="any" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="iBrood" />
        <link rel="apple-touch-icon" href="/IMG_3630.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/IMG_3630.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/IMG_3630.png" />
      </head>
      <body className={`${_spaceGrotesk.variable} ${_spaceGroteskBody.variable} font-body bg-background text-foreground`} style={{ margin: 0, padding: 0, minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <FontSizeInitializer />
            <div className="flex min-h-screen h-screen w-screen overflow-hidden">
              <LayoutComponent>{children}</LayoutComponent>
            </div>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
