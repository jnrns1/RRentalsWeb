import { Award, Users, Calendar, MapPin, Star, Clock, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Hero Section */}
      <div className="px-[7vw] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-gold mb-6">
            <Award size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Power Host • 5.0 Rating</span>
          </div>
          <h1 className="heading-display text-[clamp(36px,6vw,72px)] text-white mb-6">
            ABOUT ROCHESTER CAR RENTAL
          </h1>
          <p className="text-[#A6AAB4] text-lg leading-relaxed max-w-2xl mx-auto">
            We're a family-owned business dedicated to taking the stress out of car rentals 
            for DTW travelers. Since 2019, we've been delivering exceptional service and 
            spotless vehicles directly to your terminal.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-[7vw] py-12 bg-charcoal-light">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { num: '22,000+', label: 'Days Booked', icon: Calendar },
            { num: '1,277', label: 'Happy Customers', icon: Users },
            { num: '5.0', label: 'Perfect Rating', icon: Star },
            { num: '30+', label: 'Vehicles', icon: CheckCircle2 },
          ].map(({ num, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={24} className="text-gold mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-white">{num}</div>
              <div className="text-[#A6AAB4] text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="px-[7vw] py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-display text-3xl text-white mb-8 text-center">OUR STORY</h2>
          <div className="space-y-6 text-[#A6AAB4] leading-relaxed">
            <p>
              Rochester Car Rental started as a small family operation in 2019. We saw a gap in the 
              market—travelers were tired of waiting in long lines at rental car counters, dealing with 
              upsells, and receiving vehicles that didn't match their expectations.
            </p>
            <p>
              We decided to do things differently. Our mission was simple: provide clean, reliable 
              vehicles delivered directly to travelers at DTW Airport. No lines. No waiting. Just 
              grab your keys and go.
            </p>
            <p>
              What started with just a few vehicles has grown into a fleet of 30+ well-maintained cars, 
              SUVs, and luxury vehicles. Through it all, we've maintained our commitment to personalized 
              service and customer satisfaction.
            </p>
            <p>
              Today, we're proud to be a Turo Power Host with a perfect 5.0 rating and over 1,277 
              successful trips. But more than the numbers, we're proud of the relationships we've built 
              with our customers—many of whom return to us trip after trip.
            </p>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="px-[7vw] py-16 bg-charcoal-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-display text-3xl text-white mb-12 text-center">WHAT SETS US APART</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                title: 'Family-Owned Care', 
                desc: 'We treat every customer like family, providing personalized service that makes you feel at home.' 
              },
              { 
                icon: Award, 
                title: 'Trusted & Reliable', 
                desc: 'Power Host status with a perfect 5.0 rating earned through 5 years of exceptional service.' 
              },
              { 
                icon: Clock, 
                title: 'Always Available', 
                desc: "Flexible pickup and drop-off times to match your travel schedule, because we know flights don't wait." 
              },
              { 
                icon: CheckCircle2, 
                title: 'Hassle-Free Experience', 
                desc: 'Simple booking, clean vehicles, and transparent pricing. Travel should be easy, not stressful.' 
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-[#A6AAB4] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="px-[7vw] py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-display text-3xl text-white mb-8 text-center">WHERE WE SERVE</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { area: 'DTW Airport', desc: 'Vehicle delivered directly to your terminal. Skip the counter, skip the wait.' },
              { area: 'Rochester Hills', desc: 'Proudly serving our home community and surrounding areas.' },
              { area: 'Metro Detroit', desc: 'Full coverage across the greater Detroit metropolitan area.' },
              { area: 'Troy', desc: 'Surrounding communities served with flexible delivery options.' },
              { area: 'Auburn Hills', desc: 'Nearby service area with quick response times.' },
              { area: 'Sterling Heights', desc: 'And all nearby communities within our service radius.' },
            ].map(({ area, desc }) => (
              <div key={area} className="card-glass p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={18} className="text-gold" />
                  <h3 className="text-white font-semibold">{area}</h3>
                </div>
                <p className="text-[#A6AAB4] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-[7vw] py-16 bg-charcoal-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-display text-2xl text-white mb-4">READY TO EXPERIENCE THE DIFFERENCE?</h2>
          <p className="text-[#A6AAB4] mb-8">
            Join thousands of satisfied travelers who've discovered a better way to rent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/booking" className="btn-primary">Book Your Vehicle</a>
            <a href="/fleet" className="btn-outline">View Our Fleet</a>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-[7vw] py-8 text-center">
        <p className="text-[#A6AAB4] text-sm">
          Questions? Reach us at{' '}
          <a href="mailto:admin@rochester.rentals" className="text-gold hover:underline">
            admin@rochester.rentals
          </a>
        </p>
      </div>
    </div>
  );
}
