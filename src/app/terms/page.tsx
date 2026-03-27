// src/app/terms/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service - DMVPrep Pro",
  description: "Terms of Service for DMVPrep Pro by International Travel Inc.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 1, 2025</p>
        <div className="card p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>These Terms of Service govern your use of DMVPrep Pro, operated by <strong>International Travel Inc.</strong> By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, do not use our Service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>DMVPrep Pro provides online DMV permit test practice materials including practice questions, road sign tests, state-specific study guides, and DMV handbook summaries for educational purposes. Our Service is available in free and premium subscription tiers.</p>
            <p className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
              <strong>Important:</strong> DMVPrep Pro is not affiliated with any government agency, state DMV, or official licensing authority. Practice questions are for educational purposes only and do not guarantee passage of any official exam.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activity that occurs under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>Payments are processed securely by Stripe</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>You can cancel at any time from your account settings</li>
              <li>We do not offer refunds for partial subscription periods unless required by law</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate any applicable law or regulation</li>
              <li>Share, resell, or redistribute our content or practice questions</li>
              <li>Use automated tools or scrapers to access our content</li>
              <li>Attempt to gain unauthorized access to any part of our Service</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p>All content on DMVPrep Pro is owned by International Travel Inc. or its licensors and protected by copyright law. You may not copy, reproduce, or distribute our content without express written permission. You are granted a limited, non-exclusive license for personal, non-commercial study use only.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" basis without warranties of any kind. We do not warrant that practice questions will exactly match questions on any official DMV exam.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, International Travel Inc. shall not be liable for any indirect, incidental, or consequential damages resulting from your use of or inability to use the Service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p>These Terms shall be governed by the laws of the United States. Any disputes shall be subject to the exclusive jurisdiction of U.S. courts.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">International Travel Inc.</p>
              <p>Operating DMVPrep Pro</p>
              <p className="mt-1">Email: legal@dmvpreppro.com</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
