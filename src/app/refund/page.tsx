// src/app/refund/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy - DMVPrep Pro",
  description: "Refund Policy for DMVPrep Pro by International Travel Inc. 7-day no-questions-asked refund on all paid plans.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 10, 2026</p>
        <div className="card p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Our Refund Promise</h2>
            <p>We want every user to be confident when purchasing DMVPrep Pro. That&apos;s why we offer a <strong>7-day no-questions-asked refund</strong> on every paid plan we sell.</p>
            <p className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <strong>If for any reason you are not satisfied with your purchase, contact us within 7 days of the original transaction and we will issue a full refund — no questions asked, no forms to fill out.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Plans Covered</h2>
            <p>The 7-day refund window applies to all paid plans:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>One State ($9.99):</strong> full refund within 7 days of purchase</li>
              <li><strong>Premium Monthly ($7/month):</strong> full refund within 7 days of the most recent charge (initial purchase or any subsequent renewal)</li>
              <li><strong>Premium Annual ($39):</strong> full refund within 7 days of purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How to Request a Refund</h2>
            <p>The process is simple:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              <li>Send an email to <a href="mailto:support@dmv-prep.com" className="text-blue-600 hover:underline font-semibold">support@dmv-prep.com</a></li>
              <li>Include the email address associated with your DMVPrep Pro account</li>
              <li>Mention which plan you purchased and the approximate date of purchase (a Stripe receipt also works)</li>
              <li>You do not need to explain why — but we welcome any feedback that helps us improve</li>
            </ol>
            <p className="mt-3">We aim to respond to refund requests within <strong>1 business day</strong>. Once approved, your refund will be processed back to the original payment method.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Refund Processing Times</h2>
            <p>After we approve your refund:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Credit and debit cards:</strong> typically 5-10 business days for the refund to appear on your statement (depends on your card issuer)</li>
              <li><strong>Apple Pay / Google Pay:</strong> typically 3-7 business days</li>
              <li><strong>Bank transfers (where applicable):</strong> typically 7-14 business days</li>
            </ul>
            <p className="mt-3">Refunds are issued in the same currency as the original purchase. We are not responsible for any exchange-rate differences if your bank converted the original charge.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. After the 7-Day Window</h2>
            <p>Once 7 days have passed since the original transaction:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>One State and Premium Annual</strong> purchases are non-refundable, as they are one-time payments granting long-term or permanent access.</li>
              <li><strong>Premium Monthly</strong> can still be cancelled at any time from your account settings. Cancellation stops future renewals immediately, and you keep access until the end of the current billing period. We do not pro-rate refunds for partial months after the 7-day window.</li>
            </ul>
            <p className="mt-3">If you believe an exception should apply to your situation (e.g., you were charged for a renewal you intended to cancel), please contact us at support@dmv-prep.com — we review every request individually and try to be reasonable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cancelling a Subscription</h2>
            <p>Cancelling and refunding are two different actions:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Cancellation</strong> stops future renewals on Premium Monthly. You retain access until the end of the period you already paid for. Cancel any time from your account settings or by emailing support@dmv-prep.com.</li>
              <li><strong>Refund</strong> reverses a specific charge and is subject to the 7-day window above.</li>
            </ul>
            <p className="mt-3">If you want both — i.e., a refund of your most recent charge AND cancellation of future renewals — just say so in your refund request and we will handle both at the same time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Exceptions and Fraud Prevention</h2>
            <p>While our refund policy is generous, we reserve the right to deny refunds in cases of:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Suspected fraudulent activity, chargebacks, or stolen payment methods</li>
              <li>Repeated abuse of the refund policy (e.g., purchasing, requesting a refund, then re-purchasing on a new account)</li>
              <li>Account terminations resulting from violations of our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>, including content scraping, sharing accounts, or unauthorized commercial use</li>
              <li>Charges that are more than 90 days old (regardless of when the original purchase occurred)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Chargebacks</h2>
            <p>If you have a problem with a charge, please contact us first at support@dmv-prep.com — we&apos;d much rather resolve it directly than through your bank. Filing a chargeback or payment dispute without first contacting us may result in immediate account termination and could affect your ability to use the Service in the future.</p>
            <p className="mt-3">In most cases, we can issue a refund faster and more reliably than a chargeback can.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Statutory Rights</h2>
            <p>This Refund Policy is provided <em>in addition to</em>, not in place of, any rights you may have under consumer protection laws in your country or state. Nothing in this policy limits or excludes any rights that cannot legally be limited or excluded.</p>
            <p className="mt-3">For users in the European Union, the United Kingdom, and similar jurisdictions: by purchasing a digital product and accessing it immediately, you acknowledge that you may be waiving your statutory right of withdrawal (typically 14 days). However, our voluntary 7-day refund policy still applies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Refund Policy from time to time. Changes apply only to purchases made <em>after</em> the updated policy takes effect — the policy in force at the time of your purchase governs that purchase. We will update the &ldquo;Last updated&rdquo; date at the top of this page when we make changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p>For all refund requests and billing questions:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">International Travel Inc.</p>
              <p>Operating DMVPrep Pro</p>
              <p>Lewes, Delaware, USA</p>
              <p className="mt-2">Email: <a href="mailto:support@dmv-prep.com" className="text-blue-600 hover:underline">support@dmv-prep.com</a></p>
              <p className="mt-1 text-sm text-gray-500">Response time: typically within 1 business day</p>
            </div>
            <p className="mt-4 text-sm">See also: <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> · <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link></p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
