"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="flex items-center gap-2 max-w-7xl w-full md:w-auto">
          {/* Main Floating Pill */}
          <div className="bg-neutral-50/65 backdrop-blur-md rounded-xl px-6 md:px-8 py-2 flex items-center gap-12 w-full md:w-3xl justify-between h-12 relative z-50">
            
            {/* Brand */}
            <Link href="/" className="text-md md:text-xl font-extrabold tracking-tight text-neutral-900 font-barrio z-50 relative">
              CR Pix Photography
            </Link>

            {/* Default Center Logo (Desktop) */}
            <div className="hidden lg:block relative w-8 h-8 md:w-8 md:h-8">
              <Image
                src="/logo.svg"
                alt="CR Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6 font-spaceMono">
              <Link href="/" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
                Home
              </Link>
              <a href="#gallery" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
                Gallery
              </a>
              <a href="#about" className="text-md font-semibold text-neutral-900 hover:text-yellow-800 transition-colors">
                About
              </a>
            </div>

            {/* Mobile Hamburger (Two Lines) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex flex-col items-end justify-center gap-1.5 w-8 h-8 z-50 relative group"
            >
              <span className={`h-0.5 bg-neutral-900 rounded-full transition-all duration-300 ease-out ${isOpen ? 'w-6 rotate-45 translate-y-2 relative bottom-1' : 'w-6'}`} />
              <span className={`h-0.5 bg-neutral-900 rounded-full transition-all duration-300 ease-out ${isOpen ? 'w-6 -rotate-45 relative bottom-1' : 'w-4 group-hover:w-6'}`} />
            </button>
          </div>

          {/* Contact Button (Desktop Only) */}
          <a
            href="#contact"
            className="hidden lg:flex bg-[#FBC02D]/80 hover:bg-[#F9A825] text-neutral-900 font-bold px-6 py-4 rounded-xl shadow-md transition-colors text-md whitespace-nowrap font-space-grotesk h-12 items-center justify-center" 
          >
            Contact Us
          </a>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      <div className={` px-10 fixed inset-0 z-40 bg-[#F4F1EA] transition-transform duration-500 ease-in-out lg:hidden flex flex-col items-start justify-center ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        
        {/* Mobile Menu Links */}
        <div className="flex flex-col items-start gap-6 font-spaceMono text-3xl z-50">
          <Link 
            href="/" 
            className="text-neutral-900 hover:text-yellow-600 transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <a 
            href="#gallery" 
            className="text-neutral-900 hover:text-yellow-600 transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            Gallery
          </a>
          <a 
            href="#about" 
            className="text-neutral-900 hover:text-yellow-600 transition-colors font-bold"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
        </div>

        {/* Separator */}
        <div className="w-16 h-1 bg-neutral-200 rounded-full my-8 z-50" />

        {/* Social Links & Contact */}
        <div className="flex flex-col items-center gap-8 z-50">
          
          {/* Social Icons Row */}
          <div className="flex items-center gap-8">
            {/* Instagram */}
            <a href="#" className="text-neutral-900 hover:text-[#E1306C] transition-colors transform hover:scale-110 duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="#" className="text-neutral-900 hover:text-[#25D366] transition-colors transform hover:scale-110 duration-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="text-neutral-900 hover:text-[#FF0000] transition-colors transform hover:scale-110 duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>

             {/* Location */}
             <a href="#" className="text-neutral-900 hover:text-blue-600 transition-colors transform hover:scale-110 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </a>
          </div>

          {/* Contact Us Button */}
          <a
            href="#contact"
            className="flex bg-[#FBC02D]/80 hover:bg-[#F9A825] text-neutral-900 font-bold px-8 py-4 rounded-xl transition-colors whitespace-nowrap font-space-grotesk items-center justify-center mt-4 w-full text-2xl" 
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </a>
        </div>


        {/* Big Logo in Menu Background */}
        <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.03] w-[80vw] h-[80vw] pointer-events-none">
           <Image
              src="/logo.svg"
              alt="CR Logo"
              fill
              className="object-contain"
            />
        </div>
      </div>
    </>
  );
}
