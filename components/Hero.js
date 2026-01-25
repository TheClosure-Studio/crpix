import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-end pb-24 md:pb-18 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <Image
          src="/assets/hero.svg"
          alt="Cinematic background"
          fill  
          className="object-cover"
          priority
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full px-7 lg:px-18 text-white ">
        <div className="max-w-3xl ">
          <h1 className="text-2xl lg:text-3xl font-semibold leading-tight mb-6 font-space-grotesk">
            We’re a team of the best photography in Tirupati,
            <span className="lg:block opacity-90"> unveiling untold through art of photography.</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:text-base text-sm">
            <a
              href="#contact"
              className="px-8 py-3 bg-[#D4CDBA] hover:bg-[#cca20b] text-neutral-900 font-semibold rounded shadow-md transition-colors text-center flex items-center justify-center gap-2"
            >
              Book Your Session Now
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
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
      </div>
    </section>
  );
}
