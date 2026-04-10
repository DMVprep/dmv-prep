// src/app/privacy/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - DMVPrep Pro",
  description: "Privacy Policy for DMVPrep Pro by International Travel Inc. How we collect, use, store, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 10, 2026</p>
        <div className="card p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>Welcome to DMVPrep Pro (&ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>,&rdquo; or &ldquo;<strong>our</strong>&rdquo;), an online DMV permit test preparation service operated by <strong>International Travel Inc.</strong>, a corporation registered in Lewes, Delaware, USA.</p>
            <p className="mt-3">This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our website at dmv-prep.com (the &ldquo;<strong>Service</strong>&rdquo;). It also describes the rights you have over your data and how to exercise them.</p>
            <p className="mt-3">By accessing or using the Service, you acknowledge that you have read, understood, and agree to this Privacy Policy. If you do not agree with our practices, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="font-semibold mb-1">2.1 Information you provide directly:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Account information:</strong> name, email address, and password (encrypted) when you register</li>
              <li><strong>Payment information:</strong> billing details processed securely by Stripe — we never see or store your full card number</li>
              <li><strong>Communications:</strong> any messages, feedback, or support requests you send us</li>
              <li><strong>Profile preferences:</strong> language, state of residence, and study goals if you choose to provide them</li>
            </ul>
            <p className="font-semibold mb-1">2.2 Information collected automatically:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Usage data:</strong> pages visited, practice tests taken, scores, time spent, features used</li>
              <li><strong>Device information:</strong> browser type and version, operating system, screen resolution, language</li>
              <li><strong>Network data:</strong> IP address, approximate geographic location (city/state level only), referring URL</li>
              <li><strong>Cookies and similar technologies:</strong> see Section 5 below for details</li>
            </ul>
            <p className="font-semibold mb-1">2.3 Information from third parties:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>If you sign in via Google or another OAuth provider, we receive your name, email, and profile picture from that service</li>
              <li>Stripe provides us with confirmation of successful payments and the last 4 digits of your card for receipts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, operate, and maintain the Service</li>
              <li>Create and manage your account</li>
              <li>Process payments and manage your subscription</li>
              <li>Personalize your study experience (track your progress, recommend lessons, calculate readiness scores)</li>
              <li>Send transactional emails (account confirmations, password resets, payment receipts, subscription notices)</li>
              <li>Send service updates and announcements (you can opt out at any time)</li>
              <li>Respond to your questions and support requests</li>
              <li>Analyze usage trends and improve our practice questions, lessons, and overall product</li>
              <li>Detect, prevent, and address fraud, abuse, security incidents, or violations of our Terms of Service</li>
              <li>Comply with legal obligations and respond to lawful requests from authorities</li>
            </ul>
            <p className="mt-3 font-semibold">We do not sell your personal information to third parties under any circumstances.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we rely on the following legal bases to process your data under the General Data Protection Regulation (GDPR):</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Contract:</strong> processing necessary to provide the Service you signed up for</li>
              <li><strong>Legitimate interests:</strong> improving the Service, security, fraud prevention, and analytics</li>
              <li><strong>Consent:</strong> for marketing communications and non-essential cookies (you can withdraw at any time)</li>
              <li><strong>Legal obligation:</strong> when required by law to retain or disclose information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies (such as local storage and pixels) to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Keep you signed in to your account (essential)</li>
              <li>Remember your preferences and language choice (essential)</li>
              <li>Measure how visitors use the site so we can improve it (analytics)</li>
              <li>Understand which marketing campaigns bring users to us (advertising)</li>
            </ul>
            <p className="mt-3">You can control or block cookies through your browser settings. However, disabling essential cookies will prevent you from signing in and using core features of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Services and Sub-Processors</h2>
            <p>We share limited data with the following trusted third parties to operate the Service:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Stripe</strong> — payment processing. Stripe receives your billing details directly from you through their secure forms. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com/privacy</a></li>
              <li><strong>Vercel</strong> — website hosting and content delivery. Vercel processes server logs including IP addresses. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com/legal/privacy-policy</a></li>
              <li><strong>Google Analytics 4</strong> — usage analytics in aggregate form. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">policies.google.com/privacy</a></li>
              <li><strong>Google Ads</strong> — advertising and conversion measurement (only if you arrived via an ad)</li>
              <li><strong>NextAuth.js / OAuth providers</strong> — authentication when you sign in with Google or similar</li>
            </ul>
            <p className="mt-3">We do not authorize these third parties to use your information for any purpose other than providing services to us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
            <p>We retain your personal information only as long as necessary to provide the Service and to comply with our legal obligations:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Account data:</strong> retained while your account is active</li>
              <li><strong>Payment records:</strong> retained for 7 years to comply with tax and accounting laws</li>
              <li><strong>Usage analytics:</strong> retained in aggregated form indefinitely; individual-level data deleted after 26 months</li>
              <li><strong>Deleted accounts:</strong> personal data deleted within 30 days of account deletion request, except where law requires longer retention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Security</h2>
            <p>We take the security of your personal data seriously and implement industry-standard safeguards:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>All data transmitted between you and the Service is encrypted using HTTPS/TLS</li>
              <li>Passwords are hashed using industry-standard algorithms (bcrypt)</li>
              <li>Payment information is handled exclusively by Stripe (PCI-DSS Level 1 certified) — we never store full card numbers</li>
              <li>Access to personal data is restricted to authorized personnel on a need-to-know basis</li>
              <li>Regular security audits and updates to our infrastructure</li>
            </ul>
            <p className="mt-3">No method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. International Data Transfers</h2>
            <p>International Travel Inc. is based in the United States, and our servers are located in the United States and the European Union (depending on your location). If you access the Service from outside the United States, your data will be transferred to and processed in the United States. We rely on Standard Contractual Clauses approved by the European Commission to ensure adequate protection for transfers from the EEA, UK, and Switzerland.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
            <p>The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from anyone under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at support@dmv-prep.com and we will delete it promptly.</p>
            <p className="mt-3">For users between the ages of 13 and 18, we recommend that a parent or guardian review this Privacy Policy and our Terms of Service before account creation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> request deletion of your personal data (also known as the &ldquo;right to be forgotten&rdquo;)</li>
              <li><strong>Restriction:</strong> request that we limit how we process your data</li>
              <li><strong>Portability:</strong> receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interests</li>
              <li><strong>Withdraw consent:</strong> where processing is based on consent, withdraw it at any time</li>
              <li><strong>Opt out of marketing:</strong> unsubscribe from marketing emails using the link in any message</li>
              <li><strong>Lodge a complaint:</strong> file a complaint with your local data protection authority</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <strong>support@dmv-prep.com</strong>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. California Privacy Rights (CCPA / CPRA)</h2>
            <p>If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with additional rights, including:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Right to know what personal information we collect, use, and disclose</li>
              <li>Right to delete personal information we collected from you</li>
              <li>Right to correct inaccurate personal information</li>
              <li>Right to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information (we do not sell or share your data in the meaning of these laws)</li>
              <li>Right to limit use of sensitive personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
            <p className="mt-3">To exercise these rights, email <strong>support@dmv-prep.com</strong> with the subject line &ldquo;California Privacy Request.&rdquo;</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make material changes, we will:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Update the &ldquo;Last updated&rdquo; date at the top of this page</li>
              <li>Notify registered users by email when changes are significant</li>
              <li>Post a notice on the Service homepage for at least 30 days</li>
            </ul>
            <p className="mt-3">Your continued use of the Service after changes become effective constitutes your acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Contact Us</h2>
            <p>If you have any questions, comments, or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">International Travel Inc.</p>
              <p>Operating DMVPrep Pro</p>
              <p>Lewes, Delaware, USA</p>
              <p className="mt-2">Email: <a href="mailto:support@dmv-prep.com" className="text-blue-600 hover:underline">support@dmv-prep.com</a></p>
            </div>
            <p className="mt-4 text-sm">See also: <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> · <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link></p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
