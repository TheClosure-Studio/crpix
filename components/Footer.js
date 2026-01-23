import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              CR Pix Photography
            </h3>
            <p className="md:text-sm text-xs text-neutral-500 max-w-xs">
              We're a team of the best photography in Tirupati, unveiling untold through art of
              photography.
            </p>
          </div>
          
          <div className="flex gap-8 text-xs font-spaceMono md:text-sm">
              <Link href="/" className=" font-bold text-neutral-900 hover:text-neutral-600 transition-colors">Home</Link>
              <Link href="#about" className=" font-bold text-neutral-900 hover:text-neutral-600 transition-colors">About Us</Link>
              <Link href="#contact" className=" font-bold text-neutral-900 hover:text-neutral-600 transition-colors">Contact Us</Link>
              <Link href="/admin" className=" font-bold text-neutral-200 hover:text-neutral-600 transition-colors">Admin</Link>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-300 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-900">
          <div className="flex w-full justify-between md:justify-center flex-col gap-10 md:gap-0 md:flex-row">
            <div className="flex w-full justify-between md:w-2/3">
            <p>©{new Date().getFullYear()} CR Pix Photography, <br className="md:hidden"/>All rights reserved.</p>
            <p>Tirupati, India</p>
            </div>
            <div className="w-full text-center md:text-right md:w-1/3">
            <p>Developed by <a href="https://theclosurestudio.vercel.app/" target="_blank" className="text-blue-500 hover:text-blue-800 transition-colors">The Closure Studio.</a></p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
