"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

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
    <div className="flex h-screen bg-neutral-100 font-sans">
      {/* Sidebar */}
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
        <div className="p-8 max-w-5xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
