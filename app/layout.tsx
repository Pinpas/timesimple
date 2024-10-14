import type { Metadata } from "next";
import { Nunito } from 'next/font/google'
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
