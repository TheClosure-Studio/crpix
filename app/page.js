"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  return (
    <>
      {/* Global Loading Screen */}
      <div 
        className={`fixed inset-0 z-150 bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isHeroLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h1 className="text-white text-3xl md:text-5xl font-barrio tracking-wide animate-pulse">
            CR Pix Photography
        </h1>
      </div>

      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero onImageLoad={() => setIsHeroLoaded(true)} />
        <div className="space-y-0">
          <Gallery />
          <About />
          <Contact />
        </div>
        <Footer />
      </main>
    </>
  );
}

