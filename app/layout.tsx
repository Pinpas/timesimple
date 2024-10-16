import type { Metadata } from "next";
import { Nunito } from 'next/font/google'
import "./globals.css";
import Script from 'next/script'

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Time Simple | Simplicity in Every Second",
  description: "Time is simple and more than a clock.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Time Simple | Simplicity in Every Second',
    description: 'Time is simple and more than a clock.',
    images: [
      {
        url: '/images/timesimple-banner.jpg',
        width: 1920,
        height: 1440,
        alt: 'Site Banner',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          src="https://umami-ml6qjrvji-pinpas-projects.vercel.app/script.js"
          data-website-id="df8989af-dbac-427d-aed9-c534dd5d6ef7"
          strategy="afterInteractive"
        />
      </head>
      <body className={nunito.className}>
        {children}
        <Script
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "62b380f5f7894f1cba1ce496815139a6"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}