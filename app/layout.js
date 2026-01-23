import { spaceGrotesk, spaceMono, barrio } from "./fonts";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL('https://crpix.in'),
  title: {
    default: "CR Pix Photography | Best Photography in Tirupati",
    template: "%s | CR Pix Photography"
  },
  description: "Capturing moments that carve a forever space in your heart. Premier photography studio in Tirupati offering wedding, portrait, and event photography.",
  keywords: ["Photography", "Tirupati", "Wedding Photography", "Event Photography", "Portrait", "CR Pix"],
  authors: [{ name: "CR Pix Photography" }],
  creator: "CR Pix Photography",
  publisher: "CR Pix Photography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: "CR Pix Photography",
    description: "Capturing moments that carve a forever space in your heart.",
    url: 'https://crpix.in',
    siteName: 'CR Pix Photography',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CR Pix Photography",
    description: "Capturing moments that carve a forever space in your heart.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_VERIFICATION_CODE', // Replace with your actual code from Google Search Console
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${barrio.variable}  ${spaceMono.variable} font-space-grotesk font-spaceMono `}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}