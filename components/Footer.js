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
            <p className="text-sm text-neutral-500 max-w-xs">
              We're a team of the best photography in Tirupati, unveiling untold through art of
              photography.
            </p>
          </div>
          
          <div className="flex gap-8">
              <Link href="/" className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">Home</Link>
              <Link href="#about" className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">About Us</Link>
              <Link href="#contact" className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">Contact Us</Link>
              <Link href="/admin" className="text-sm font-bold text-neutral-200 hover:text-neutral-600 transition-colors">Admin</Link>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-300 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-neutral-900">
          <div className="flex w-full justify-between">
            <p>©{new Date().getFullYear()} CR Pix Photography, All rights reserved.</p>
            <p>Tirupati, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
