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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-400 mb-3">
              <BookOpen className="w-5 h-5" />
              DMVPrep Pro
            </Link>
            <p className="text-sm leading-relaxed">
              Free DMV practice tests for all 50 states. Pass your permit test first try.
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
              <li><Link href="/refund" className="text-sm hover:text-blue-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Latest Articles</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/blog/florida-english-only-dmv-test-2026" className="text-sm hover:text-blue-400 transition-colors">Florida English-Only DMV Test</Link></li>
              <li><Link href="/blog/pass-dmv-test-english-non-native-speaker" className="text-sm hover:text-blue-400 transition-colors">Pass the DMV Test as a Non-Native Speaker</Link></li>
              <li><Link href="/blog/how-many-questions-dmv-test-by-state" className="text-sm hover:text-blue-400 transition-colors">How Many Questions on the DMV Test?</Link></li>
              <li><Link href="/blog/dmv-practice-test-cheat-sheet-2026" className="text-sm hover:text-blue-400 transition-colors">DMV Test Cheat Sheet 2026</Link></li>
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
