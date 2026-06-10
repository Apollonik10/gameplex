"use client";

import { useState, useEffect } from "react";
import { Search, Bell, User, Menu } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { searchQuery, setSearchQuery } = useGameStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-colors duration-300 md:px-16",
        isScrolled ? "bg-zinc-950 shadow-md" : "bg-gradient-to-b from-black/70 to-transparent"
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-red-600">
          GAMEPLEX
        </Link>
        
        <div className="hidden gap-5 text-sm font-medium text-zinc-300 md:flex">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <Link href="/my-list" className="hover:text-white transition">Minha Lista</Link>
          <Link href="/glossary" className="hover:text-white transition">Glossário</Link>
        </div>
      </div>

      <div className="flex items-center gap-5 text-white">
        <div className="relative hidden items-center md:flex">
          <Search className="absolute left-3 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Títulos, plataformas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded bg-zinc-900/50 border border-zinc-700 py-1.5 pl-10 pr-4 text-sm outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all w-64"
          />
        </div>
        
        <Bell className="cursor-pointer hover:text-zinc-400 transition" size={20} />
        <div className="h-8 w-8 overflow-hidden rounded bg-zinc-800">
          <User className="h-full w-full p-1" />
        </div>
        <Menu className="md:hidden cursor-pointer" size={24} />
      </div>
    </nav>
  );
}
