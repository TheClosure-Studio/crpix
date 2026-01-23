import { spaceGrotesk, spaceMono, barrio } from "./fonts";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CR Pix Photography",
  description: "Capturing moments that carve a forever space in your heart.",
  icons: {
    icon: '/logo.svg',
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