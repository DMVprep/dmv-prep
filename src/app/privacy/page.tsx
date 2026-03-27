// src/app/privacy/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy - DMVPrep Pro",
  description: "Privacy Policy for DMVPrep Pro by International Travel Inc.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 1, 2025</p>
        <div className="card p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>Welcome to DMVPrep Pro, operated by <strong>International Travel Inc.</strong> We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information when you use our website and related services.</p>
            <p className="mt-3">By using our Service, you agree to the collection and use of information in accordance with this policy.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="font-semibold mb-1">Information you provide directly:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Name and email address when you create an account</li>
              <li>Payment information when you subscribe to a premium plan (processed securely by Stripe)</li>
              <li>Any messages or feedback you send us</li>
            </ul>
            <p className="font-semibold mb-1">Information collected automatically:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usage data such as pages visited, test scores, and features used</li>
              <li>Device information including browser type, operating system, and IP address</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, operate, and improve the Service</li>
              <li>Process payments and manage your subscription</li>
              <li>Send account-related emails and service updates</li>
              <li>Respond to your questions and support requests</li>
              <li>Analyze usage trends to improve our practice test content</li>
              <li>Prevent fraud and ensure the security of our Service</li>
            </ul>
            <p className="mt-3">We do not sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our Service and retain certain information. You can instruct your browser to refuse all cookies, however some portions of our Service may not function properly without them.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Stripe</strong> - for payment processing (stripe.com/privacy)</li>
              <li><strong>Vercel</strong> - for hosting and analytics</li>
              <li><strong>NextAuth.js</strong> - for authentication</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where required by law.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
            <p>Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. Contact us if you believe a child has provided us their information and we will delete it promptly.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of changes by posting the new policy on this page and updating the date at the top.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">International Travel Inc.</p>
              <p>Operating DMVPrep Pro</p>
              <p className="mt-1">Email: privacy@dmvpreppro.com</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
