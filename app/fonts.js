import { Barrio, Space_Mono } from "next/font/google";

export const spaceGrotesk = Barrio({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
