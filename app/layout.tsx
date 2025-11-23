import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"

const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })
const _spaceGroteskBody = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" })

export const metadata: Metadata = {
  title: "iBrood - Queen Cell & Brood Pattern Analysis",
  description: "Intelligent system for monitoring hive health through queen cell and brood pattern analysis",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="iBrood" />
      </head>
      <body className={`${_spaceGrotesk.variable} ${_spaceGroteskBody.variable} font-body bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
