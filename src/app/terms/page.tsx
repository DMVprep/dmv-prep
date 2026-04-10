// src/app/terms/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - DMVPrep Pro",
  description: "Terms of Service for DMVPrep Pro by International Travel Inc. The legal agreement governing your use of the Service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: April 10, 2026</p>
        <div className="card p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;) are a legally binding agreement between you (&ldquo;<strong>you</strong>,&rdquo; &ldquo;<strong>your</strong>,&rdquo; or &ldquo;<strong>user</strong>&rdquo;) and <strong>International Travel Inc.</strong>, a corporation registered in Lewes, Delaware, USA (&ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>,&rdquo; &ldquo;<strong>our</strong>,&rdquo; or &ldquo;<strong>Company</strong>&rdquo;), operating the website dmv-prep.com and related services (collectively, the &ldquo;<strong>Service</strong>&rdquo;).</p>
            <p className="mt-3">By accessing, browsing, registering an account, or otherwise using the Service, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. If you do not agree, you must not use the Service.</p>
            <p className="mt-3">If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
            <p>To use the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Be at least 13 years old (or the minimum age in your jurisdiction)</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be barred from using the Service under applicable laws</li>
              <li>Provide accurate and complete information when creating an account</li>
            </ul>
            <p className="mt-3">If you are under 18, you must have permission from a parent or legal guardian before creating an account or making any purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Description of Service</h2>
            <p>DMVPrep Pro provides online educational materials to help users prepare for the written DMV permit test in the United States. The Service includes:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Practice questions based on official state DMV handbooks</li>
              <li>Road sign tests and visual reference materials</li>
              <li>State-specific study guides covering all 50 states</li>
              <li>Plain-English lessons designed for first-time drivers and non-native English speakers</li>
              <li>Multilingual content (English, Spanish, and additional languages on premium plans)</li>
              <li>Progress tracking and readiness scoring (premium plans)</li>
            </ul>
            <p className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
              <strong>Important Disclaimer:</strong> DMVPrep Pro is an independent educational service. We are <strong>not affiliated with, endorsed by, or authorized by</strong> any government agency, state Department of Motor Vehicles, the United States Department of Transportation, or any official licensing authority. Our practice questions are for educational purposes only and do not guarantee that you will pass any official DMV examination. Test content varies by state and may change at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. User Accounts</h2>
            <p>To access certain features, you must create an account. By creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password confidential and secure</li>
              <li>Accept full responsibility for all activities that occur under your account</li>
              <li>Notify us immediately at support@dmv-prep.com of any unauthorized use of your account or any other breach of security</li>
              <li>Not share your account with others or allow others to use your credentials</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate any account that violates these Terms or that we suspect of fraudulent or unauthorized use, with or without notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Subscriptions, Pricing, and Payments</h2>
            <p>The Service offers a free tier and several paid plans:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Free:</strong> limited access to one state with 10 questions per test, no account required to start</li>
              <li><strong>One State ($9.99 one-time):</strong> full access to one US state, 400+ practice questions, all test modes, plain-English explanations, no recurring charges</li>
              <li><strong>Premium Monthly ($7/month):</strong> access to all 50 US states, all features, multilingual content, billed monthly, cancel anytime</li>
              <li><strong>Premium Annual ($39 one-time):</strong> 12 months of full access at a discount, single payment, no auto-renewal</li>
            </ul>
            <p className="mt-3">By purchasing any paid plan, you authorize us (through our payment processor Stripe) to charge the payment method you provide. Payments are processed in US dollars. Prices are exclusive of any applicable taxes, which will be added at checkout where required by law.</p>
            <p className="mt-3"><strong>Premium Monthly subscriptions auto-renew</strong> at the end of each billing cycle until you cancel. You can cancel at any time from your account settings; cancellation takes effect at the end of the current billing period and you will retain access until then.</p>
            <p className="mt-3"><strong>One State and Premium Annual purchases are one-time charges</strong> and do not auto-renew.</p>
            <p className="mt-3">We reserve the right to change pricing at any time. Price changes will not affect existing subscriptions until the next billing cycle, and we will notify subscribers in advance.</p>
            <p className="mt-3">For our refund policy, please see <Link href="/refund" className="text-blue-600 hover:underline">our Refund Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p>When using the Service, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Violate any applicable law, regulation, or third-party right</li>
              <li>Share, resell, redistribute, republish, or otherwise commercialize our content, practice questions, lessons, or study materials</li>
              <li>Use automated tools, bots, scrapers, or crawlers to access, copy, or extract content from the Service (except for public-facing search engine indexing)</li>
              <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or our systems</li>
              <li>Interfere with, disrupt, or place an unreasonable load on the Service&apos;s infrastructure</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with anyone</li>
              <li>Upload or transmit viruses, malware, or other harmful code</li>
              <li>Use the Service for any fraudulent, illegal, or harmful purpose</li>
              <li>Harass, abuse, or harm other users or our staff</li>
            </ul>
            <p className="mt-3">Violation of these acceptable use rules may result in immediate suspension or termination of your account without refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>The Service and all content within it — including but not limited to practice questions, lessons, study guides, road sign images, illustrations, logos, software, and design elements — are owned by International Travel Inc. or its licensors and are protected by United States and international copyright, trademark, and other intellectual property laws.</p>
            <p className="mt-3">Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your <strong>personal, non-commercial study purposes only</strong>.</p>
            <p className="mt-3">You may not, without our express written permission:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Copy, modify, distribute, sell, or lease any part of the Service or its content</li>
              <li>Create derivative works based on the Service</li>
              <li>Use our trademarks, logos, or brand elements without prior written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. User-Generated Content</h2>
            <p>If you submit feedback, suggestions, comments, or other content to us through the Service or via email, you grant us a worldwide, royalty-free, perpetual, irrevocable, non-exclusive license to use, reproduce, modify, adapt, and distribute that content in connection with operating and improving the Service. You confirm that you own or have the right to grant this license.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p className="uppercase text-sm font-bold">The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis, without warranties of any kind, either express or implied.</p>
            <p className="mt-3">To the maximum extent permitted by applicable law, we disclaim all warranties, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Any warranty that the Service will be uninterrupted, secure, or error-free</li>
              <li>Any warranty regarding the accuracy, reliability, or completeness of the content</li>
              <li>Any warranty that practice questions will appear on or match any official DMV exam</li>
              <li>Any warranty that you will pass an official DMV exam by using the Service</li>
            </ul>
            <p className="mt-3">DMV test content, format, and requirements are determined solely by each state&apos;s licensing authority and may change at any time. You are responsible for verifying current requirements with your state DMV.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="uppercase text-sm font-bold">To the maximum extent permitted by law, in no event shall International Travel Inc., its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Your access to or use of, or inability to access or use, the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Failing or passing any official DMV examination</li>
            </ul>
            <p className="mt-3">Our total cumulative liability to you for any and all claims arising from or related to the Service shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) US$50.</p>
            <p className="mt-3">Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities, so some of the above may not apply to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless International Travel Inc., its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising from or related to: (a) your use of the Service, (b) your violation of these Terms, (c) your violation of any third-party right, including intellectual property or privacy rights, or (d) any content you submit to the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Termination</h2>
            <p>We reserve the right to suspend or terminate your account and access to the Service, with or without notice, for any reason, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Violation of these Terms</li>
              <li>Suspected fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of subscription fees</li>
              <li>Extended periods of inactivity</li>
              <li>Discontinuation of the Service</li>
            </ul>
            <p className="mt-3">You may terminate your account at any time by contacting support@dmv-prep.com. Termination will not entitle you to any refund except as specified in our <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link>.</p>
            <p className="mt-3">Upon termination, your right to use the Service ends immediately. Sections that by their nature should survive termination (including Sections 7, 9, 10, 11, and 13) will survive.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law and Dispute Resolution</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the <strong>State of Delaware, United States</strong>, without regard to its conflict-of-laws rules.</p>
            <p className="mt-3">Any dispute, claim, or controversy arising out of or relating to these Terms or the Service shall be resolved as follows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Informal resolution first:</strong> before filing any legal action, you agree to contact us at support@dmv-prep.com and attempt to resolve the matter informally for at least 30 days.</li>
              <li><strong>Jurisdiction:</strong> if informal resolution fails, you agree that any legal action shall be brought exclusively in the state or federal courts located in <strong>Sussex County, Delaware, USA</strong>, and you consent to the personal jurisdiction of those courts.</li>
              <li><strong>No class actions:</strong> you agree to resolve disputes with us only on an individual basis and waive any right to participate in a class action, class arbitration, or representative proceeding.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Changes to These Terms</h2>
            <p>We may modify these Terms at any time at our discretion. When we make material changes, we will:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Update the &ldquo;Last updated&rdquo; date at the top of this page</li>
              <li>Notify registered users by email when changes are significant</li>
              <li>Where possible, post a notice on the Service for at least 30 days</li>
            </ul>
            <p className="mt-3">Your continued use of the Service after the effective date of the changes constitutes your acceptance of the revised Terms. If you do not agree to the changes, you must stop using the Service and may close your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">15. Miscellaneous</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Entire agreement:</strong> these Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and us regarding the Service.</li>
              <li><strong>Severability:</strong> if any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.</li>
              <li><strong>Waiver:</strong> our failure to enforce any right or provision is not a waiver of that right.</li>
              <li><strong>Assignment:</strong> you may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations freely.</li>
              <li><strong>Force majeure:</strong> we are not liable for failure to perform due to causes beyond our reasonable control (natural disasters, wars, internet outages, government actions, etc.).</li>
              <li><strong>Notices:</strong> we may give notices to you by email to the address associated with your account, by posting on the Service, or by any other reasonable means.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">16. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">International Travel Inc.</p>
              <p>Operating DMVPrep Pro</p>
              <p>Lewes, Delaware, USA</p>
              <p className="mt-2">Email: <a href="mailto:support@dmv-prep.com" className="text-blue-600 hover:underline">support@dmv-prep.com</a></p>
            </div>
            <p className="mt-4 text-sm">See also: <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> · <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link></p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
