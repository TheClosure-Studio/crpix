"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === "cr-pix-007" && password === "Koushik07") {
        setIsLoading(true);
      // Set cookie for middleware
      document.cookie = "admin_authenticated=true; path=/; max-age=86400"; // 1 day expiration
      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center font-space-grotesk">Admin Access</h1>
        <p className="text-neutral-500 text-center mb-8 font-spaceMono text-sm">Sign in to manage your portfolio</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 font-spaceMono">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 font-spaceMono">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold font-space-grotesk hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entering..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
