import Link from 'next/link';
import BrandingFooter from '@/components/BrandingFooter';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Figma Concierge
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>

          <div className="prose prose-sm max-w-none text-foreground space-y-6">
            <p className="text-muted-foreground">Last Updated: December 9, 2025</p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-foreground leading-relaxed">
                By accessing and using actualsize.digital ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
              <p className="text-foreground leading-relaxed">
                actualsize.digital provides a platform for hosting, managing, and sharing Figma prototype projects. The Service allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Upload and organize Figma prototype links</li>
                <li>Create and manage client categories</li>
                <li>Generate shareable links with optional expiration dates</li>
                <li>Manage project lifecycles including soft deletion and restoration</li>
                <li>View embedded Figma prototypes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Responsibilities</h2>
              <p className="text-foreground leading-relaxed mb-4">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Provide accurate and complete information when using the Service</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Respect intellectual property rights of others</li>
                <li>Not attempt to gain unauthorized access to the Service or related systems</li>
                <li>Not use the Service to transmit harmful, offensive, or illegal content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Content Ownership and Rights</h2>
              <p className="text-foreground leading-relaxed mb-4">
                You retain all rights to the content you upload to the Service, including Figma prototype links and project information. By using the Service, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Store and display your content as necessary to provide the Service</li>
                <li>Share your content via share links you create</li>
                <li>Make backup copies for data integrity purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Share Links</h2>
              <p className="text-foreground leading-relaxed">
                Share links generated through the Service allow public access to specified projects. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Managing access to share links you create</li>
                <li>Setting appropriate expiration dates when needed</li>
                <li>Ensuring shared content is appropriate and authorized</li>
                <li>Revoking access by deleting share links when necessary</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Data Retention and Deletion</h2>
              <p className="text-foreground leading-relaxed">
                The Service implements soft deletion for projects and clients, allowing restoration within a reasonable period. Permanently deleted content cannot be recovered. We reserve the right to permanently delete soft-deleted content after a retention period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Service Availability</h2>
              <p className="text-foreground leading-relaxed">
                While we strive to maintain high availability, the Service is provided "as is" without guarantees of uptime. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Modify or discontinue the Service at any time</li>
                <li>Perform maintenance that may temporarily interrupt service</li>
                <li>Implement usage limits or restrictions as needed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-foreground leading-relaxed">
                To the fullest extent permitted by law, actualsize.digital and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service, including but not limited to loss of data, profits, or business opportunities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Indemnification</h2>
              <p className="text-foreground leading-relaxed">
                You agree to indemnify and hold harmless actualsize.digital, its operators, and affiliates from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Third-Party Services</h2>
              <p className="text-foreground leading-relaxed">
                The Service integrates with Figma and may rely on third-party services. We are not responsible for the availability, content, or practices of third-party services. Your use of Figma and related services is subject to their respective terms and policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Termination</h2>
              <p className="text-foreground leading-relaxed">
                We reserve the right to suspend or terminate your access to the Service at our discretion, including for violations of these Terms, fraudulent activity, or other harmful behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">12. Changes to Terms</h2>
              <p className="text-foreground leading-relaxed">
                We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">13. Governing Law</h2>
              <p className="text-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Actual Size operates, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">14. Contact Information</h2>
              <p className="text-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us through <a href="https://www.actualsize.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">actualsize.com</a>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}

export const metadata = {
  title: 'Terms of Service | actualsize.digital',
  description: 'Terms of Service for actualsize.digital Figma prototype hosting platform',
};
