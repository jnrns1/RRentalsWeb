export default function Privacy() {
  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      <div className="px-[7vw] py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-display text-[clamp(32px,5vw,56px)] text-white mb-8">
            PRIVACY POLICY
          </h1>
          
          <div className="text-[#A6AAB4] space-y-8">
            <section>
              <h2 className="text-white text-xl font-semibold mb-4">1. INTRODUCTION</h2>
              <p className="leading-relaxed">
                Rochester Car Rental ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our website and services. By using our services, you consent to the practices 
                described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">2. INFORMATION WE COLLECT</h2>
              <p className="leading-relaxed mb-4">We may collect the following types of information:</p>
              <h3 className="text-white font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Name, email address, phone number</li>
                <li>Driver's license information</li>
                <li>Payment information (credit/debit card details)</li>
                <li>Billing address</li>
                <li>Date of birth</li>
              </ul>
              <h3 className="text-white font-semibold mb-2">Rental Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Rental history and preferences</li>
                <li>Vehicle selection and usage data</li>
                <li>Pickup and return locations</li>
                <li>Feedback and reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">3. HOW WE USE YOUR INFORMATION</h2>
              <p className="leading-relaxed mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and confirm your bookings</li>
                <li>Communicate with you about your rentals</li>
                <li>Verify your identity and eligibility</li>
                <li>Process payments and refunds</li>
                <li>Provide customer support</li>
                <li>Improve our services and website</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">4. INFORMATION SHARING</h2>
              <p className="leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment processors to complete transactions</li>
                <li>Insurance providers for coverage verification</li>
                <li>Law enforcement when required by law</li>
                <li>Service providers who assist our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">5. DATA SECURITY</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This 
                includes encryption, secure servers, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">6. COOKIES AND TRACKING</h2>
              <p className="leading-relaxed">
                Our website uses cookies and similar technologies to enhance your browsing experience, 
                analyze site traffic, and personalize content. You can control cookie preferences through 
                your browser settings. Disabling cookies may affect some website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">7. YOUR RIGHTS</h2>
              <p className="leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">8. DATA RETENTION</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes 
                outlined in this policy, unless a longer retention period is required by law. Rental 
                records are typically retained for 7 years for tax and legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">9. THIRD-PARTY LINKS</h2>
              <p className="leading-relaxed">
                Our website may contain links to third-party websites, including Turo. We are not 
                responsible for the privacy practices of these external sites. We encourage you to 
                review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">10. CHILDREN'S PRIVACY</h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly 
                collect personal information from children. If we become aware of such collection, we 
                will take immediate steps to delete the information.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">11. CHANGES TO THIS POLICY</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page 
                with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">12. CONTACT US</h2>
              <p className="leading-relaxed">
                If you have questions or concerns about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <p className="mt-4">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:admin@rochester.rentals" className="text-gold hover:underline">
                  admin@rochester.rentals
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-white">Address:</strong>{' '}
                Rochester Hills, MI - Serving Metro Detroit
              </p>
            </section>

            <p className="text-sm text-[#A6AAB4] pt-8 border-t border-white/10">
              Last Updated: February 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
