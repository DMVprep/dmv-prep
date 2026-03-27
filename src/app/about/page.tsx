// src/app/about/page.tsx
import { BookOpen, Shield, Users, Globe, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "About DMVPrep Pro - Free DMV Practice Tests for All 50 States",
  description: "Learn about DMVPrep Pro, the trusted platform helping first-time drivers and non-native speakers pass their DMV permit test on the first try.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">About DMVPrep Pro</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We help people pass their DMV permit test on the first try with free, state-specific practice tests and plain-English explanations.
          </p>
        </div>
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Getting a driver license is one of the most important steps toward independence in the United States. For first-time drivers and non-native speakers, the DMV knowledge test can feel intimidating. Complex legal language, unfamiliar road signs, and state-by-state differences make preparation difficult.
          </p>
          <p className="text-gray-600 leading-relaxed">
            DMVPrep Pro was built to change that. We offer free, accurate, and easy-to-understand practice tests for all 50 states, so anyone can prepare with confidence regardless of their background or experience level.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Accurate Questions</h3>
            <p className="text-sm text-gray-600">All questions are based on official DMV handbooks and updated regularly to match current exams.</p>
          </div>
          <div className="card p-6 text-center">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Multilingual Support</h3>
            <p className="text-sm text-gray-600">Premium users can translate any question into Spanish, Chinese, Portuguese, French, and more.</p>
          </div>
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Built for Everyone</h3>
            <p className="text-sm text-gray-600">Designed for first-time drivers, non-native speakers, teens, and anyone retaking their test after a failure.</p>
          </div>
        </div>
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why DMVPrep Pro</h2>
          <ul className="space-y-4">
            {[
              "Practice tests for all 50 U.S. states",
              "Three test modes: Quick Test, Road Signs, and Full Exam",
              "Plain-English explanations for every answer",
              "State-specific DMV handbook summaries",
              "No sign-up required to start practicing",
              "Premium multilingual translation for non-English speakers",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Company</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            DMVPrep Pro is a product of <strong>International Travel Inc.</strong>, a company dedicated to helping people navigate life in the United States. From travel to licensing, we build tools that make essential processes more accessible for everyone.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We are not affiliated with any government agency or official DMV office. Our practice questions are for educational purposes only. Always refer to your state official DMV handbook for the most current information.
          </p>
        </div>
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <Award className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Ready to pass your test?</h2>
          <p className="text-blue-100 mb-6">Join thousands of drivers who passed their DMV test with DMVPrep Pro.</p>
          <Link href="/practice" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Start Practicing Free
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
