// src/components/layout/Footer.tsx
import Link from "next/link";
import { BookOpen } from "lucide-react";

const popularStates = [
  { code: "CA", name: "California" },
  { code: "TX", name: "Texas" },
  { code: "FL", name: "Florida" },
  { code: "NY", name: "New York" },
  { code: "IL", name: "Illinois" },
  { code: "PA", name: "Pennsylvania" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-400 mb-3">
              <BookOpen className="w-5 h-5" />
              DMVPrep Pro
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Free DMV practice tests for all 50 states. Simple explanations designed for
              first-time drivers and non-native speakers. Pass your permit test first try.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Popular States</h4>
            <ul className="space-y-2">
              {popularStates.map((s) => (
                <li key={s.code}>
                  <Link
                    href={`/state/${s.name.toLowerCase().replace(/\s+/g, "-")}/dmv-practice-test`}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {s.name} DMV Test
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="/states" className="text-sm hover:text-blue-400 transition-colors">All States</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center">
          © {new Date().getFullYear()} DMVPrep Pro. Not affiliated with any government DMV agency.
          Practice questions are for educational purposes only.
        </div>
      </div>
    </footer>
  );
}
