import { Barrio, Space_Grotesk, Space_Mono } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
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
export const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-barrio",
  display: "swap",
});