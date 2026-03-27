// src/app/driving-rules/4-way-stop/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "4-Way Stop Rules — Who Goes First? (2026 DMV Guide)",
  description: "Clear visual guide to 4-way stop rules. Learn who goes first, what to do when two cars arrive at the same time, and how to avoid common mistakes on the DMV test.",
  alternates: { canonical: "https://dmv-prep.com/driving-rules/4-way-stop" },
};

export default function FourWayStopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">4-Way Stop Rules</h1>
          <p className="text-lg text-gray-500">Who goes first? A clear visual guide for the DMV test and real driving.</p>
        </div>

        {/* Diagram */}
        <div className="card p-4 mb-8">
          <svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="520" fill="#3a7d2c"/>
            <rect x="0" y="190" width="680" height="160" fill="#6b6b6b"/>
            <rect x="260" y="0" width="160" height="520" fill="#6b6b6b"/>
            <rect x="260" y="190" width="160" height="160" fill="#6b6b6b"/>
            <line x1="340" y1="0" x2="340" y2="188" stroke="#f5c518" strokeWidth="3" strokeDasharray="18,12"/>
            <line x1="340" y1="352" x2="340" y2="520" stroke="#f5c518" strokeWidth="3" strokeDasharray="18,12"/>
            <line x1="0" y1="270" x2="258" y2="270" stroke="#f5c518" strokeWidth="3" strokeDasharray="18,12"/>
            <line x1="422" y1="270" x2="680" y2="270" stroke="#f5c518" strokeWidth="3" strokeDasharray="18,12"/>
            <line x1="340" y1="190" x2="420" y2="190" stroke="white" strokeWidth="5"/>
            <line x1="260" y1="350" x2="340" y2="350" stroke="white" strokeWidth="5"/>
            <line x1="422" y1="270" x2="422" y2="350" stroke="white" strokeWidth="5"/>
            <line x1="258" y1="190" x2="258" y2="270" stroke="white" strokeWidth="5"/>

            {/* CAR 1 — teal, top, right lane going down */}
            <g>
              <ellipse cx="380" cy="154" rx="20" ry="5" fill="#00000035"/>
              <rect x="362" y="74" width="36" height="72" rx="7" fill="#00b8c8"/>
              <rect x="366" y="86" width="28" height="34" rx="4" fill="#009aaa"/>
              <rect x="368" y="88" width="24" height="14" rx="2" fill="#c8eef5" opacity="0.85"/>
              <rect x="368" y="104" width="24" height="12" rx="2" fill="#c8eef5" opacity="0.55"/>
              <rect x="364" y="76" width="9" height="5" rx="1" fill="#ffe88a"/>
              <rect x="387" y="76" width="9" height="5" rx="1" fill="#ffe88a"/>
              <rect x="364" y="137" width="9" height="5" rx="1" fill="#ff4444"/>
              <rect x="387" y="137" width="9" height="5" rx="1" fill="#ff4444"/>
              <rect x="360" y="83" width="6" height="14" rx="2" fill="#111"/>
              <rect x="394" y="83" width="6" height="14" rx="2" fill="#111"/>
              <rect x="360" y="121" width="6" height="14" rx="2" fill="#111"/>
              <rect x="394" y="121" width="6" height="14" rx="2" fill="#111"/>
              <circle cx="380" cy="110" r="10" fill="white" opacity="0.92"/>
              <text x="380" y="114" textAnchor="middle" fill="#009aaa" fontSize="12" fontWeight="bold" fontFamily="sans-serif">1</text>
            </g>

            {/* CAR 2 — orange, right arm, bottom lane going left */}
            <g>
              <ellipse cx="498" cy="302" rx="6" ry="18" fill="#00000035"/>
              <rect x="462" y="288" width="72" height="36" rx="7" fill="#f59e0b"/>
              <rect x="474" y="292" width="34" height="28" rx="4" fill="#d97706"/>
              <rect x="476" y="294" width="14" height="22" rx="2" fill="#fef3c7" opacity="0.85"/>
              <rect x="492" y="294" width="12" height="22" rx="2" fill="#fef3c7" opacity="0.55"/>
              <rect x="528" y="292" width="5" height="9" rx="1" fill="#ffe88a"/>
              <rect x="528" y="307" width="5" height="9" rx="1" fill="#ffe88a"/>
              <rect x="462" y="292" width="5" height="9" rx="1" fill="#ff4444"/>
              <rect x="462" y="307" width="5" height="9" rx="1" fill="#ff4444"/>
              <rect x="470" y="284" width="14" height="5" rx="2" fill="#111"/>
              <rect x="508" y="284" width="14" height="5" rx="2" fill="#111"/>
              <rect x="470" y="323" width="14" height="5" rx="2" fill="#111"/>
              <rect x="508" y="323" width="14" height="5" rx="2" fill="#111"/>
              <circle cx="498" cy="306" r="10" fill="white" opacity="0.92"/>
              <text x="498" y="310" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold" fontFamily="sans-serif">2</text>
            </g>

            {/* CAR 3 — purple, left arm, top lane going right */}
            <g>
              <ellipse cx="182" cy="216" rx="6" ry="18" fill="#00000035"/>
              <rect x="146" y="202" width="72" height="36" rx="7" fill="#7c3aed"/>
              <rect x="158" y="206" width="34" height="28" rx="4" fill="#6d28d9"/>
              <rect x="160" y="208" width="14" height="22" rx="2" fill="#ddd6fe" opacity="0.85"/>
              <rect x="176" y="208" width="12" height="22" rx="2" fill="#ddd6fe" opacity="0.55"/>
              <rect x="146" y="206" width="5" height="9" rx="1" fill="#ffe88a"/>
              <rect x="146" y="221" width="5" height="9" rx="1" fill="#ffe88a"/>
              <rect x="212" y="206" width="5" height="9" rx="1" fill="#ff4444"/>
              <rect x="212" y="221" width="5" height="9" rx="1" fill="#ff4444"/>
              <rect x="154" y="198" width="14" height="5" rx="2" fill="#111"/>
              <rect x="192" y="198" width="14" height="5" rx="2" fill="#111"/>
              <rect x="154" y="237" width="14" height="5" rx="2" fill="#111"/>
              <rect x="192" y="237" width="14" height="5" rx="2" fill="#111"/>
              <circle cx="182" cy="220" r="10" fill="white" opacity="0.92"/>
              <text x="182" y="224" textAnchor="middle" fill="#6d28d9" fontSize="12" fontWeight="bold" fontFamily="sans-serif">3</text>
            </g>

            {/* CAR 4 — green, bottom arm, left lane going up */}
            <g>
              <ellipse cx="300" cy="434" rx="20" ry="5" fill="#00000035"/>
              <rect x="282" y="364" width="36" height="72" rx="7" fill="#16a34a"/>
              <rect x="286" y="376" width="28" height="34" rx="4" fill="#15803d"/>
              <rect x="288" y="393" width="24" height="14" rx="2" fill="#bbf7d0" opacity="0.85"/>
              <rect x="288" y="378" width="24" height="12" rx="2" fill="#bbf7d0" opacity="0.55"/>
              <rect x="284" y="427" width="9" height="5" rx="1" fill="#ffe88a"/>
              <rect x="307" y="427" width="9" height="5" rx="1" fill="#ffe88a"/>
              <rect x="284" y="366" width="9" height="5" rx="1" fill="#ff4444"/>
              <rect x="307" y="366" width="9" height="5" rx="1" fill="#ff4444"/>
              <rect x="280" y="373" width="6" height="14" rx="2" fill="#111"/>
              <rect x="314" y="373" width="6" height="14" rx="2" fill="#111"/>
              <rect x="280" y="411" width="6" height="14" rx="2" fill="#111"/>
              <rect x="314" y="411" width="6" height="14" rx="2" fill="#111"/>
              <circle cx="300" cy="400" r="10" fill="white" opacity="0.92"/>
              <text x="300" y="404" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="bold" fontFamily="sans-serif">4</text>
            </g>

            {/* Stop signs */}
            <line x1="425" y1="178" x2="425" y2="193" stroke="#777" strokeWidth="2.5"/>
            <polygon points="425,162 433,166 436,174 433,182 425,185 417,182 414,174 417,166" fill="#dc2626"/>
            <text x="425" y="175" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">STOP</text>
            <text x="425" y="182" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="sans-serif">ALL WAY</text>

            <line x1="255" y1="343" x2="255" y2="358" stroke="#777" strokeWidth="2.5"/>
            <polygon points="255,327 263,331 266,339 263,347 255,350 247,347 244,339 247,331" fill="#dc2626"/>
            <text x="255" y="340" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">STOP</text>
            <text x="255" y="347" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="sans-serif">ALL WAY</text>

            <line x1="432" y1="353" x2="432" y2="368" stroke="#777" strokeWidth="2.5"/>
            <polygon points="432,337 440,341 443,349 440,357 432,360 424,357 421,349 424,341" fill="#dc2626"/>
            <text x="432" y="350" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">STOP</text>
            <text x="432" y="357" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="sans-serif">ALL WAY</text>

            <line x1="250" y1="178" x2="250" y2="193" stroke="#777" strokeWidth="2.5"/>
            <polygon points="250,162 258,166 261,174 258,182 250,185 242,182 239,174 242,166" fill="#dc2626"/>
            <text x="250" y="175" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">STOP</text>
            <text x="250" y="182" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="sans-serif">ALL WAY</text>


          </svg>
        </div>

        {/* Rules */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">The 4-Way Stop Rules</h2>
          <div className="card p-5 border-l-4 border-teal-500">
            <h3 className="font-bold text-gray-900 mb-1">Rule 1 — First to arrive, first to go</h3>
            <p className="text-sm text-gray-600">The first car to come to a complete stop at the intersection goes first. If you arrived before the other drivers, you have the right of way.</p>
          </div>
          <div className="card p-5 border-l-4 border-yellow-500">
            <h3 className="font-bold text-gray-900 mb-1">Rule 2 — Tie? Yield to the right</h3>
            <p className="text-sm text-gray-600">If two cars arrive at the same time, the car on the right goes first. Look to your right — if there is a car there, yield to them.</p>
          </div>
          <div className="card p-5 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-1">Rule 3 — Facing each other? Straight or right goes before left turn</h3>
            <p className="text-sm text-gray-600">If two cars arrive at the same time and are facing each other, the car going straight or turning right goes before the car turning left.</p>
          </div>
          <div className="card p-5 border-l-4 border-red-500">
            <h3 className="font-bold text-gray-900 mb-1">Rule 4 — Always come to a complete stop</h3>
            <p className="text-sm text-gray-600">You must stop completely before the stop line. Rolling stops are illegal and are a common reason for failing the road test. Your wheels must stop moving.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is a 4-way stop?", a: "A 4-way stop (also called an all-way stop) is an intersection where all four directions have a stop sign. Every driver must stop before entering the intersection." },
              { q: "What if all 4 cars arrive at the same time?", a: "This is rare but if it happens, make eye contact with other drivers and use hand gestures to agree on who goes first. Proceed cautiously." },
              { q: "Do pedestrians have the right of way at a 4-way stop?", a: "Yes. Pedestrians crossing in a crosswalk always have the right of way. You must wait for them to fully cross before you proceed." },
              { q: "What is the difference between a 4-way stop and a roundabout?", a: "At a 4-way stop every car stops. In a roundabout, traffic already in the circle has the right of way and you yield when entering." },
              { q: "Does this come up on the DMV written test?", a: "Yes. 4-way stop and right-of-way questions appear on almost every state DMV written test. It is one of the most commonly tested topics." },
            ].map((faq, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div className="card p-5 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Guides</h2>
          <div className="space-y-2">
            {[
              { href: "/dmv-faq", text: "DMV Test FAQ" },
              { href: "/how-many-questions-on-dmv-test", text: "How many questions are on the DMV test?" },
              { href: "/dmv-test-passing-score-by-state", text: "DMV passing score by state" },
              { href: "/states", text: "Practice tests for all 50 states" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <span className="text-sm text-gray-700 group-hover:text-blue-700">{l.text}</span>
                <span className="text-gray-400 group-hover:text-blue-500">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Practice right-of-way questions</h2>
          <p className="text-blue-100 mb-6">Free DMV practice tests for all 50 states. No signup needed.</p>
          <Link href="/states" className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">Choose Your State</Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
