// src/components/layout/Header.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, BookOpen, LogOut, LayoutDashboard, User, BarChart2 } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  // Compute user initials from name or email
  const userName = session?.user?.name || session?.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

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
            <Link href="/lessons" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Learn</Link>
            <Link href="/practice" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Practice</Link>
            {session ? (
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Dashboard</Link>
            ) : (
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Pricing</Link>
            )}
            <Link href="/blog" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Blog</Link>

            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {initials}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/progress"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <BarChart2 className="w-4 h-4" />
                      My Progress
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Pricing
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3" role="navigation" aria-label="Mobile menu">
          <Link href="/lessons" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Learn</Link>
          <Link href="/practice" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Practice</Link>
          {session ? (
            <Link href="/dashboard" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          ) : (
            <Link href="/pricing" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          )}
          <Link href="/blog" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
          {session ? (
            <>
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Account</p>
                <Link href="/progress" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>My Progress</Link>
                <Link href="/pricing" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
                <button onClick={() => signOut()} className="block text-red-500 font-medium py-2 w-full text-left">Sign out</button>
              </div>
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
