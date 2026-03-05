export default function Terms() {
  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      <div className="px-[7vw] py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-display text-[clamp(32px,5vw,56px)] text-white mb-8">
            TERMS OF SERVICE
          </h1>
          
          <div className="text-[#A6AAB4] space-y-8">
            <section>
              <h2 className="text-white text-xl font-semibold mb-4">1. ACCEPTANCE OF TERMS</h2>
              <p className="leading-relaxed">
                By accessing or using Rochester Car Rental's services, you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our services. 
                These terms apply to all users, including visitors, registered users, and customers.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">2. SERVICE DESCRIPTION</h2>
              <p className="leading-relaxed mb-4">
                Rochester Car Rental provides vehicle rental services with delivery to DTW Airport and 
                surrounding areas. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Short-term vehicle rentals (daily, weekly, monthly)</li>
                <li>Airport delivery and pickup services</li>
                <li>Vehicle selection from our fleet of 30+ vehicles</li>
                <li>24/7 roadside assistance during rental period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">3. RENTAL REQUIREMENTS</h2>
              <p className="leading-relaxed mb-4">To rent a vehicle from Rochester Car Rental, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 21 years of age</li>
                <li>Possess a valid driver's license</li>
                <li>Have a valid credit or debit card in your name</li>
                <li>Provide proof of insurance or purchase our coverage option</li>
                <li>Pass our verification process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">4. BOOKING AND PAYMENT</h2>
              <p className="leading-relaxed mb-4">
                All bookings must be made through our website or authorized booking platforms. Payment 
                is required at the time of booking. We accept major credit cards and debit cards.
              </p>
              <p className="leading-relaxed">
                Prices are quoted in USD and include applicable taxes. Additional fees may apply for 
                late returns, cleaning, fuel, or damage.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">5. CANCELLATION POLICY</h2>
              <p className="leading-relaxed">
                Cancellations made at least 24 hours before the scheduled pickup time will receive a 
                full refund. Cancellations made less than 24 hours in advance may be subject to a 
                cancellation fee equal to one day's rental charge. No-shows will be charged the full 
                rental amount.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">6. VEHICLE USE</h2>
              <p className="leading-relaxed mb-4">Rented vehicles may only be used for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal transportation</li>
                <li>Business travel</li>
                <li>Travel within the continental United States</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Prohibited uses include: commercial purposes, racing, off-road driving, towing, 
                and transporting hazardous materials.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">7. INSURANCE AND LIABILITY</h2>
              <p className="leading-relaxed">
                All rentals include basic liability coverage. Renters are responsible for any damage 
                not covered by insurance, including deductibles. We strongly recommend renters verify 
                their personal auto insurance coverage or purchase additional protection.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">8. FUEL POLICY</h2>
              <p className="leading-relaxed">
                Vehicles are provided with a full tank of fuel. Renters must return vehicles with a 
                full tank. If the vehicle is returned with less fuel, a refueling charge will apply 
                at current market rates plus a service fee.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">9. LATE RETURNS</h2>
              <p className="leading-relaxed">
                Vehicles returned after the agreed-upon return time will incur additional charges. 
                A grace period of 30 minutes is provided. After 30 minutes, hourly rates apply until 
                the daily rate is reached.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">10. CONTACT INFORMATION</h2>
              <p className="leading-relaxed">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:admin@rochester.rentals" className="text-gold hover:underline">
                  admin@rochester.rentals
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-4">11. CHANGES TO TERMS</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting to our website. Continued use of our services constitutes 
                acceptance of the modified terms.
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
