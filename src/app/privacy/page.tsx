import Link from 'next/link';
import BrandingFooter from '@/components/BrandingFooter';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>

          <div className="prose prose-sm max-w-none text-foreground space-y-6">
            <p className="text-muted-foreground">Last Updated: December 11, 2025</p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
              <p className="text-foreground leading-relaxed">
                This Privacy Policy describes how actualsize.digital ("we", "us", or "our") collects, uses, and protects your information when you use our Figma prototype hosting service. We are committed to protecting your privacy and handling your data with transparency and care.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.1 Information You Provide</h3>
              <p className="text-foreground leading-relaxed mb-4">We collect information you directly provide when using the Service:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Project Information:</strong> Project names, slugs, and descriptions you create</li>
                <li><strong>Figma URLs:</strong> Links to your Figma prototypes</li>
                <li><strong>Client Labels:</strong> Custom categories and organizational labels</li>
                <li><strong>Authentication Data:</strong> When you sign in with Google OAuth, we collect your name, email address (@actualsize.com domain only), and profile picture from your Google account</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-foreground leading-relaxed mb-4">We automatically collect certain information when you use the Service:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Usage Data:</strong> Project creation dates, deletion dates, and modification timestamps</li>
                <li><strong>Share Link Activity:</strong> Share link creation and expiration information</li>
                <li><strong>Technical Data:</strong> Browser type, device information, and IP addresses for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground leading-relaxed mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Service Provision:</strong> To operate and maintain the Service, including storing and displaying your projects</li>
                <li><strong>Share Link Management:</strong> To generate and manage public share links for your projects</li>
                <li><strong>Data Organization:</strong> To categorize projects by client labels and maintain your organizational structure</li>
                <li><strong>Service Improvement:</strong> To understand usage patterns and improve the Service</li>
                <li><strong>Security:</strong> To protect against unauthorized access and maintain system integrity</li>
                <li><strong>Communication:</strong> To respond to your inquiries and provide support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Storage and Security</h2>
              <p className="text-foreground leading-relaxed mb-4">
                We store your data in secure PostgreSQL databases with appropriate access controls. We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Secure database access controls</li>
                <li>Regular security updates and monitoring</li>
                <li>Backup systems for data integrity</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Data Sharing and Disclosure</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.1 Sharing via Share Links</h3>
              <p className="text-foreground leading-relaxed">
                When you create a share link, you explicitly authorize public access to the associated projects. Anyone with the share link can view the shared content until the link expires or is deleted.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.2 Third-Party Services</h3>
              <p className="text-foreground leading-relaxed mb-4">
                We integrate with the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Google OAuth:</strong> For user authentication and sign-in (subject to Google's privacy policy). We only access your basic profile information (name, email, profile picture) and do not store your Google password</li>
                <li><strong>Figma:</strong> For embedding and displaying prototypes (subject to Figma's privacy policy)</li>
                <li><strong>Vercel:</strong> For hosting and infrastructure services</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.3 Legal Requirements</h3>
              <p className="text-foreground leading-relaxed">
                We may disclose your information if required by law, court order, or governmental request, or to protect our rights and the safety of others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Data Retention</h2>
              <p className="text-foreground leading-relaxed mb-4">We retain your data as follows:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Active Projects:</strong> Retained indefinitely while you use the Service</li>
                <li><strong>Soft-Deleted Projects:</strong> Retained for a reasonable period to allow restoration, then permanently deleted</li>
                <li><strong>Share Links:</strong> Retained until expired or manually deleted</li>
                <li><strong>Authentication Data:</strong> Your profile information (name, email, profile picture) is retained while you have an active account. Session data is automatically cleared upon logout</li>
                <li><strong>Account Data:</strong> Retained while your account is active</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Your Rights and Choices</h2>
              <p className="text-foreground leading-relaxed mb-4">You have the following rights regarding your data:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Access:</strong> View and manage your projects and data through the Service interface</li>
                <li><strong>Modification:</strong> Edit project names, labels, and organizational structure</li>
                <li><strong>Deletion:</strong> Delete projects (soft delete with restoration option or permanent delete)</li>
                <li><strong>Share Link Control:</strong> Create, modify, and delete share links at any time</li>
                <li><strong>Data Export:</strong> Request a copy of your data by contacting us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Cookies and Tracking</h2>
              <p className="text-foreground leading-relaxed">
                We may use cookies and similar tracking technologies to maintain your session and improve your experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Children's Privacy</h2>
              <p className="text-foreground leading-relaxed">
                The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. International Data Transfers</h2>
              <p className="text-foreground leading-relaxed">
                Your data may be stored and processed in various locations where our service providers operate. By using the Service, you consent to the transfer of your data to these locations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">12. Contact Us</h2>
              <p className="text-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us through <a href="https://www.actualsize.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">actualsize.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">13. Additional Rights for EU/UK Users</h2>
              <p className="text-foreground leading-relaxed mb-4">
                If you are located in the European Union or United Kingdom, you have additional rights under GDPR, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us through the contact information provided above.
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
  title: 'Privacy Policy | actualsize.digital',
  description: 'Privacy Policy for actualsize.digital Figma prototype hosting platform',
};
