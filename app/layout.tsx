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
    icon: '/favicon.ico', // Add a default favicon here
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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