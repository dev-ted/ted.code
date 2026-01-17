import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Toaster } from "@/components/ui/toaster"
import { SplashCursor } from "@/components/splash-cursor"
import { ConvexClientProvider } from "./ConvexClientProvider"
import "./globals.css"

import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue, IBM_Plex_Sans as V0_Font_IBM_Plex_Sans, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _ibmPlexSans = V0_Font_IBM_Plex_Sans({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"] })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

export const metadata: Metadata = {
  title: "TED.CODE — Software Developer",
  description:
    "A Software developer who crafts beautiful, responsive, and engaging digital experiences.",

  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        <ConvexClientProvider>
          <div className="noise-overlay" aria-hidden="true" />
          <SplashCursor />
          <SmoothScroll>{children}</SmoothScroll>
          <Toaster />
          <Analytics />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
