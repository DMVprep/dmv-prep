// src/components/layout/Header.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, BookOpen, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="w-6 h-6" />
            <span>DMV<span className="text-gray-800">Prep</span> Pro</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/states" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">
              All States
            </Link>
            <Link href="/progress" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">My Progress</Link>
            <Link href="/lessons" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Lessons</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">
              Pricing
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Start Free
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/states" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>All States</Link>
          <Link href="/lessons" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Lessons</Link>
          <Link href="/pricing" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/progress" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>My Progress</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut()} className="block text-red-500 font-medium py-2 w-full text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/register" className="btn-primary block text-center" onClick={() => setMenuOpen(false)}>Start Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
