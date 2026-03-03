"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([
    "/assets/hero.svg", // Default fallback image
  ]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data, error } = await supabase
        .from('hero_backgrounds')
        .select('image_url')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setHeroImages(data.map(bg => bg.image_url));
      }
    };
    
    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]); // Re-run if image count changes

  return (
    <section className="relative w-full h-screen flex items-end pb-24 md:pb-18 overflow-hidden">
      {/* Background Images Carousel */}
      {heroImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          } bg-gray-900`}
        >
          <Image
            src={src}
            alt={`Cinematic background ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-[5]" />

      <div className="relative z-10 w-full px-7 lg:px-18 text-white ">
        <div className="max-w-3xl ">
          <h1 className="text-2xl lg:text-3xl font-semibold leading-tight mb-6 font-space-grotesk">
            We’re a team of the best photography in Tirupati,
            <span className="lg:block opacity-90">
              {" "}
              unveiling untold through art of photography.
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:text-base text-sm">
            <a
              href="#contact"
              className="px-8 py-3 bg-[#D4CDBA] hover:bg-[#cca20b] text-neutral-900 font-semibold rounded shadow-md transition-colors text-center flex items-center justify-center gap-2"
            >
              Book Your Session Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
            <a
              href="#gallery"
              className="px-8 py-3 bg-[#D4CDBA] hover:bg-[#cca20b] text-neutral-900 font-semibold rounded shadow-md transition-colors text-center flex items-center justify-center gap-2"
            >
              Explore Gallery
            </a>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute hidden lg:-bottom-8 lg:right-8 lg:flex gap-1">
          {heroImages.length > 1 && heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentImageIndex 
                  ? "bg-white/60 scale-110 " 
                  : "bg-white/20 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
