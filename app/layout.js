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
  keywords: [
    "CR Pix", 
    "CR Pix Photography", 
    "Best Photography in Tirupati", 
    "Wedding Photography Tirupati", 
    "Event Photography", 
    "Portrait Photography", 
    "Candid Photography", 
    "Cinematic Wedding Films", 
    "Pre-wedding Shoots", 
    "Birthday Photography", 
    "Corporate Events"
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CR Pix Photography',
              alternateName: 'CR Pix',
              url: 'https://crpix.in',
              logo: 'https://crpix.in/logo.svg',
              image: 'https://crpix.in/logo.svg',
              description: 'Capturing moments that carve a forever space in your heart. Premier photography studio in Tirupati offering wedding, portrait, and event photography.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tirupati',
                addressRegion: 'Andhra Pradesh',
                addressCountry: 'IN'
              }
            }),
          }}
        />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}