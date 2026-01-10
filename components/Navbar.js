"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center gap-2 max-w-7xl">
        {/* Main Floating Pill */}
        <div className="bg-neutral-50/65 backdrop-blur-md  rounded-xl px-8 py-2 flex items-center gap-12 w-3xl justify-between h-12">
          
          {/* Brand */}
          <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 font-space-grotesk">
            CR Pix Photography
          </Link>

          {/* Center Logo */}
          <div className="relative w-8 h-8 md:w-8 md:h-8">
            <Image
              src="/logo.svg"
              alt="CR Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 font-spaceMono">
            <Link href="/" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
              Home
            </Link>
            <Link href="#gallery" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
              Gallery
            </Link>
            <Link href="#about" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Contact Button (Separate) */}
        <Link
          href="#contact"
          className="bg-[#FBC02D]/80 hover:bg-[#F9A825] text-neutral-900 font-bold px-6 py-4 rounded-xl shadow-md transition-colors text-md whitespace-nowrap hidden font-space-grotesk h-12 md:flex items-center justify-center" 
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
}
