"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If we're on the login page, don't show the admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const NAV_ITEMS = [
    { label: "Upload Images", href: "/admin",  },
    { label: "Upload Video", href: "/admin/videos/upload",  },
    { label: "Categories", href: "/admin/categories", },
    { label: "Manage Media", href: "/admin/images", },
    { label: "Manage Videos", href: "/admin/videos", },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 font-sans relative">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col p-6">
        <div className="mb-12">
          <h1 className="text-2xl font-bold font-space-grotesk tracking-tight">CR Pix Admin</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium font-space-grotesk ${
                  isActive 
                    ? "bg-white text-black shadow-md" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-neutral-900">
          <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-spaceMono">
             ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-5xl mx-auto pb-32 md:pb-8">
           {children}
        </div>
      </main>

      {/* Mobile FAB Menu Overlay (Click outside to close) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Pop-up Menu */}
      <div className={`fixed bottom-24 right-8 z-50 bg-white shadow-2xl rounded-2xl p-4 w-64 md:hidden transition-all duration-300 origin-bottom-right transform ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <nav className="flex flex-col space-y-1">
             {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium font-space-grotesk ${
                    isActive 
                      ? "bg-neutral-900 text-white shadow-sm" 
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
             <div className="pt-3 mt-2 border-t border-neutral-200">
                <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors text-sm font-spaceMono px-4 py-2">
                  ← Back to Site
                </Link>
             </div>
          </nav>
      </div>

      {/* Mobile FAB Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-black text-white rounded-full shadow-lg flex items-center justify-center md:hidden hover:scale-105 transition-transform active:scale-95"
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : 'rotate-0'}`}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
