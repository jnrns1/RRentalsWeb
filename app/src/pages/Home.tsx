import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  ChevronRight,
  Star,
  CheckCircle2,
  Award,
  Users
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Absolutely seamless experience! They met me right at the terminal with a spotless vehicle. No lines, no waiting - just grabbed my keys and drove off. Game changer for business travel.",
    author: "Sarah M.",
    role: "Verified Turo Guest",
    date: "January 2026"
  },
  {
    quote: "After years of dealing with rental car counters and hour-long waits, this service is a breath of fresh air. The car was delivered exactly when promised, clean and ready to go.",
    author: "Michael R.",
    role: "Verified Turo Guest",
    date: "December 2025"
  },
  {
    quote: "Family-run business that truly cares. Picked up at DTW terminal, no hassle whatsoever. The vehicle was immaculate and the service was personal. I'll never use a traditional rental again.",
    author: "Jennifer L.",
    role: "Verified Turo Guest",
    date: "January 2026"
  },
  {
    quote: "Five stars all the way! Saved me at least an hour at the airport. The direct delivery service is worth its weight in gold. Professional, friendly, and reliable.",
    author: "David K.",
    role: "Verified Turo Guest",
    date: "November 2025"
  }
];

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const fleetRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const coverageRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animation
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      heroTl
        .fromTo('.hero-bg', 
          { scale: 1, y: 0 }, 
          { scale: 1.06, y: '-3vh', ease: 'none' }, 
          0.7
        )
        .fromTo('.hero-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-18vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-subcontent', 
          { y: 0, opacity: 1 }, 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        );

      // Stats Section
      const statsTl = gsap.timeline({
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        }
      });

      statsTl
        .fromTo('.stats-headline', 
          { y: '-30vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.stat-item', 
          { y: '20vh', opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' }, 
          0.1
        )
        .to('.stats-headline', 
          { y: '-15vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.stat-item', 
          { y: '15vh', opacity: 0, stagger: 0.02, ease: 'power2.in' }, 
          0.7
        );

      // Experience Section
      const expTl = gsap.timeline({
        scrollTrigger: {
          trigger: experienceRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        }
      });

      expTl
        .fromTo('.exp-left', 
          { x: '-60vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.exp-right', 
          { x: '60vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.exp-bar-left', 
          { scaleX: 0 }, 
          { scaleX: 1, ease: 'power2.out' }, 
          0.05
        )
        .fromTo('.exp-bar-right', 
          { scaleX: 0 }, 
          { scaleX: 1, ease: 'power2.out' }, 
          0.05
        )
        .fromTo('.exp-content', 
          { y: '18vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'power2.out' }, 
          0.1
        )
        .to('.exp-left', 
          { x: '-18vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.exp-right', 
          { x: '18vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.exp-content', 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        );

      // How It Works Section (Flowing)
      gsap.fromTo('.howit-title',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.howit-step',
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.howit-steps',
            start: 'top 75%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );

      // Fleet Section
      const fleetTl = gsap.timeline({
        scrollTrigger: {
          trigger: fleetRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      fleetTl
        .fromTo('.fleet-headline', 
          { y: '-40vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.fleet-strip', 
          { x: '60vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .to('.fleet-headline', 
          { y: '-18vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.fleet-strip', 
          { x: '-40vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        );

      // Testimonials Section (Flowing)
      gsap.fromTo('.test-top',
        { x: -80, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.test-bottom',
        { x: 80, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 70%',
            end: 'top 45%',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.test-card',
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 65%',
            end: 'top 40%',
            scrub: true,
          }
        }
      );

      // Coverage Section
      const covTl = gsap.timeline({
        scrollTrigger: {
          trigger: coverageRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        }
      });

      covTl
        .fromTo('.cov-top', 
          { y: '-35vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.cov-bottom', 
          { y: '35vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'power2.out' }, 
          0
        )
        .fromTo('.cov-map', 
          { scale: 0.65, opacity: 0, rotate: -8 }, 
          { scale: 1, opacity: 1, rotate: 0, ease: 'power2.out' }, 
          0
        )
        .to('.cov-top', 
          { y: '-12vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.cov-bottom', 
          { y: '12vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .to('.cov-map', 
          { scale: 0.85, opacity: 0, ease: 'power2.in' }, 
          0.7
        );

      // Contact Section (Flowing)
      gsap.fromTo('.contact-top',
        { y: -30, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.contact-bottom',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );

      gsap.fromTo('.contact-block',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 70%',
            end: 'top 45%',
            scrub: true,
          }
        }
      );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Hero load animation
  useEffect(() => {
    const loadTl = gsap.timeline();
    
    loadTl
      .fromTo('.hero-bg',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      )
      .fromTo('.hero-badge',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.8'
      )
      .fromTo('.hero-headline span',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.hero-subcontent',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Section 1: Hero */}
      <section ref={heroRef} className="section-pinned z-10">
        <div className="hero-bg absolute inset-0">
          <img 
            src="/hero_city_bg.jpg" 
            alt="Night city" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center px-[7vw]">
          <div className="hero-badge flex items-center gap-2 mb-6">
            <Award size={16} className="text-gold" />
            <span className="text-gold text-sm font-semibold">Power Host • 5.0 Rating</span>
          </div>
          
          <div className="hero-headline">
            <h1 className="heading-display text-[clamp(40px,7vw,100px)] text-white">
              <span className="block">THE RELIEF</span>
              <span className="block">YOUR TRAVEL</span>
              <span className="block text-gold">DESERVES</span>
            </h1>
          </div>
          
          <div className="hero-subcontent mt-8 max-w-xl">
            <p className="text-[#A6AAB4] text-lg leading-relaxed">
              Skip the rental car counter and avoid waiting hours for a subpar vehicle. Have your perfect vehicle delivered directly to your terminal at DTW. With 30+ vehicles and over 22,000 days booked, we make your journey smooth and worry-free.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/booking" className="btn-primary">Book Your Vehicle</Link>
              <Link to="/fleet" className="btn-outline">View Fleet</Link>
            </div>
            <p className="text-xs text-[#A6AAB4] mt-4 micro-label">
              Serving Rochester Hills • DTW Airport • Metro Detroit
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Stats */}
      <section ref={statsRef} className="section-pinned z-20">
        <div className="absolute inset-0">
          <img 
            src="/experience_bg.jpg" 
            alt="Night road" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-[7vw]">
          <h2 className="stats-headline heading-display text-[clamp(28px,4vw,56px)] text-white mb-16 text-center">
            OVER 5 YEARS OF EXCELLENCE
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {[
              { num: '22,000+', label: 'Days Booked' },
              { num: '1,277', label: 'Happy Customers' },
              { num: '5.0', label: 'Perfect Rating' },
              { num: '30+', label: 'Vehicles' },
            ].map(({ num, label }) => (
              <div key={label} className="stat-item text-center">
                <div className="text-[clamp(36px,5vw,64px)] font-display font-bold text-gold">{num}</div>
                <div className="text-[#A6AAB4] text-sm mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Experience */}
      <section ref={experienceRef} className="section-pinned z-30">
        <div className="absolute inset-0">
          <img 
            src="/coverage_bg.jpg" 
            alt="Night city" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 h-full px-[7vw] py-[18vh]">
          <div className="flex justify-between items-start">
            <div className="exp-left">
              <h2 className="heading-display text-[clamp(36px,7vw,100px)] text-white">
                YOUR RELIEF
              </h2>
              <h2 className="heading-display text-[clamp(36px,7vw,100px)] text-gold">
                DURING
              </h2>
              <div className="exp-bar-left w-[28vw] h-[3px] bg-gold mt-4 origin-left" />
            </div>
            <div className="exp-right text-right">
              <h2 className="heading-display text-[clamp(36px,7vw,100px)] text-white">
                STRESSFUL
              </h2>
              <h2 className="heading-display text-[clamp(36px,7vw,100px)] text-gold">
                TIMES
              </h2>
              <div className="exp-bar-right w-[28vw] h-[3px] bg-gold mt-4 ml-auto origin-right" />
            </div>
          </div>
          
          <div className="exp-content mt-16 max-w-3xl mx-auto text-center">
            <p className="text-[#A6AAB4] text-lg leading-relaxed mb-12">
              We understand that travel can be overwhelming. That's why we've built a family business dedicated to taking the stress out of car rentals for DTW travelers.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, title: 'Family-Owned Care', desc: 'We treat every customer like family, providing personalized service that makes you feel at home.' },
                { icon: Award, title: 'Trusted & Reliable', desc: 'Power Host status with a perfect 5.0 rating earned through 5 years of exceptional service.' },
                { icon: Clock, title: 'Always Available', desc: "Flexible pickup and drop-off times to match your travel schedule, because we know flights don't wait." },
                { icon: CheckCircle2, title: 'Hassle-Free Experience', desc: 'Simple booking, clean vehicles, and transparent pricing. Travel should be easy, not stressful.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <Icon size={28} className="text-gold mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                  <p className="text-[#A6AAB4] text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section ref={howItWorksRef} id="how-it-works" className="relative z-[5] bg-charcoal py-24 px-[7vw]">
        <div className="text-center mb-16">
          <h2 className="howit-title heading-display text-[clamp(32px,5vw,64px)] text-white mb-4">
            READY TO BOOK?
          </h2>
          <p className="text-[#A6AAB4] text-lg">Three simple steps to your perfect rental</p>
        </div>
        
        <div className="howit-steps grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { num: '01', title: 'Browse Our Fleet', desc: 'Check out our 30+ vehicles and find the perfect match for your trip' },
            { num: '02', title: 'Book Instantly', desc: 'Secure booking with instant confirmation and flexible pickup times' },
            { num: '03', title: 'Travel Stress-Free', desc: 'Pick up your clean, well-maintained vehicle and enjoy your trip' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="howit-step text-center p-8 card-glass">
              <span className="text-gold font-display font-bold text-4xl block mb-4">{num}</span>
              <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
              <p className="text-[#A6AAB4] text-sm">{desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gold">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-semibold">5.0 Rating • Power Host</span>
          </div>
        </div>
      </section>

      {/* Section 5: Fleet */}
      <section ref={fleetRef} id="fleet" className="section-pinned z-50">
        <div className="absolute inset-0">
          <img 
            src="/footer_bg.jpg" 
            alt="Night city" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <h2 className="fleet-headline heading-display text-[clamp(28px,4vw,56px)] text-white mb-4 text-center">
            OUR GROWING FLEET
          </h2>
          <p className="text-[#A6AAB4] text-center max-w-2xl mb-12 px-4">
            With 30+ well-maintained vehicles, we have the perfect ride for every traveler and occasion.
          </p>
          
          <div className="fleet-strip flex gap-6 overflow-hidden px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[34vw] h-[22vh] overflow-hidden border border-white/10"
              >
                <img 
                  src={`/marquee_car_0${i}.jpg`} 
                  alt={`Car ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: 'Economy & Compact', desc: 'Perfect for solo travelers' },
              { title: 'SUVs & Minivans', desc: 'Ideal for families' },
              { title: 'Luxury Vehicles', desc: 'Arrive in style' },
              { title: 'Electric & Hybrid', desc: 'Eco-friendly options' },
            ].map(({ title, desc }) => (
              <div key={title} className="text-center">
                <h4 className="text-white font-semibold text-sm">{title}</h4>
                <p className="text-[#A6AAB4] text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
          
          <Link to="/fleet" className="mt-12 text-gold text-sm uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
            View All Vehicles <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section ref={testimonialsRef} className="relative z-[5] bg-charcoal py-24 px-[7vw]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <Award size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">All-Star Host</span>
          </div>
          <h2 className="test-top heading-display text-[clamp(28px,4vw,48px)] text-white mb-4">
            DON'T TAKE OUR WORD FOR IT
          </h2>
          <p className="text-[#A6AAB4] max-w-2xl mx-auto">
            Over <span className="text-gold font-semibold">1,277 verified 5-star reviews</span> from real travelers. See what our customers are saying about their vehicle rentals and service experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map(({ quote, author, role, date }) => (
            <div key={author} className="test-card card-glass p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold" fill="currentColor" />
                ))}
              </div>
              <p className="text-white text-sm leading-relaxed mb-6 italic">"{quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{author}</p>
                  <p className="text-[#A6AAB4] text-xs">{role}</p>
                </div>
                <span className="text-[#A6AAB4] text-xs">{date}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="test-bottom text-center mt-12">
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">1,277</div>
              <div className="text-[#A6AAB4] text-xs">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">5.0</div>
              <div className="text-[#A6AAB4] text-xs">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">5</div>
              <div className="text-[#A6AAB4] text-xs">Years on Turo</div>
            </div>
          </div>
          <p className="text-[#A6AAB4] text-xs mt-6">
            Every review is verified through Turo's platform, ensuring authentic feedback from real travelers.
          </p>
        </div>
      </section>

      {/* Section 7: Coverage Map */}
      <section ref={coverageRef} id="service-areas" className="section-pinned z-[70]">
        <div className="absolute inset-0">
          <img 
            src="/hero_city_bg.jpg" 
            alt="Night city" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between px-[7vw] py-[16vh]">
          <h2 className="cov-top heading-display text-[clamp(28px,5vw,64px)] text-white">
            WE COME TO YOU
          </h2>
          
          <div className="cov-map absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34vw] h-[34vw]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#B88A53" strokeWidth="1" opacity="0.3" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="#B88A53" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="#B88A53" strokeWidth="1" opacity="0.7" />
              <circle cx="100" cy="100" r="8" fill="#B88A53" className="animate-pulse-gold" />
            </svg>
          </div>
          
          <div className="text-right">
            <h2 className="cov-bottom heading-display text-[clamp(28px,5vw,64px)] text-white">
              FLEXIBLE SERVICE
            </h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg ml-auto">
              {[
                { area: 'DTW Airport', desc: 'Vehicle delivered directly to your terminal' },
                { area: 'Rochester Hills', desc: 'Proudly serving our home community' },
                { area: 'Metro Detroit', desc: 'Full coverage across the greater area' },
                { area: 'Troy', desc: 'Surrounding communities' },
                { area: 'Auburn Hills', desc: 'Nearby service area' },
                { area: 'Sterling Heights', desc: 'And nearby communities' },
              ].map(({ area, desc }) => (
                <div key={area} className="text-right">
                  <h4 className="text-gold font-semibold text-sm">{area}</h4>
                  <p className="text-[#A6AAB4] text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Contact / Footer */}
      <section ref={contactRef} id="contact" className="relative z-[5] min-h-screen">
        <div className="absolute inset-0">
          <img 
            src="/footer_bg.jpg" 
            alt="Night city" 
            className="w-full h-full object-cover"
          />
          <div className="vignette-overlay absolute inset-0" />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-[7vw] py-24">
          <h2 className="contact-top heading-display text-[clamp(28px,5vw,64px)] text-white absolute top-[16vh] left-[7vw]">
            FLYING INTO DTW?
          </h2>
          <h2 className="contact-bottom heading-display text-[clamp(28px,5vw,64px)] text-gold absolute bottom-[16vh] right-[7vw]">
            BOOK AHEAD
          </h2>
          
          <div className="contact-block text-center max-w-2xl">
            <p className="text-[#A6AAB4] text-lg mb-8">
              Book ahead and we'll have your vehicle ready for pickup when you land. Start your trip stress-free with Rochester Car Rental.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/booking" className="btn-primary">Reserve Your Vehicle Now</Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h4 className="text-gold font-semibold text-sm mb-2 flex items-center gap-2">
                  <Mail size={14} /> Message on Turo
                </h4>
                <p className="text-[#A6AAB4] text-xs">The fastest way to reach us with booking questions</p>
              </div>
              <div>
                <h4 className="text-gold font-semibold text-sm mb-2 flex items-center gap-2">
                  <Phone size={14} /> Call Us
                </h4>
                <p className="text-[#A6AAB4] text-xs">Prefer to talk? We're here to answer your questions</p>
              </div>
              <div>
                <h4 className="text-gold font-semibold text-sm mb-2 flex items-center gap-2">
                  <MapPin size={14} /> Location
                </h4>
                <p className="text-[#A6AAB4] text-xs">Rochester Hills, MI - Serving Metro Detroit</p>
              </div>
            </div>
          </div>
          
          <footer className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-xs text-[#A6AAB4] micro-label mb-2">
              © 2026 ROCHESTER CAR RENTAL. ALL RIGHTS RESERVED.
            </p>
            <p className="text-xs text-gold/60">
              Power Host • 5.0 Rating • 1,277 Trips • 22,000+ Days Booked
            </p>
            <p className="text-xs text-[#A6AAB4]/60 mt-2">
              Contact: <a href="mailto:admin@rochester.rentals" className="text-gold hover:underline">admin@rochester.rentals</a>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
