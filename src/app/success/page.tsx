import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — DMVPrep Pro",
  description: "Your DMVPrep Pro account has been upgraded.",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your account has been upgraded. You now have full access to all premium features.</p>
          <div className="space-y-3">
            <Link href="/practice" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
              Start Practicing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/progress" className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-blue-400 transition-colors">
              View My Progress
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
