import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase or email service
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Hero */}
      <div className="px-[7vw] py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-display text-[clamp(36px,6vw,72px)] text-white mb-4">
            GET IN TOUCH
          </h1>
          <p className="text-[#A6AAB4] text-lg">
            Have questions? Need a custom arrangement? We're a family business that loves to help.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="px-[7vw] py-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="card-glass p-6 text-center">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-gold" />
            </div>
            <h3 className="text-white font-semibold mb-2">Email Us</h3>
            <p className="text-[#A6AAB4] text-sm mb-4">For general inquiries and support</p>
            <a 
              href="mailto:admin@rochester.rentals" 
              className="text-gold hover:underline text-sm"
            >
              admin@rochester.rentals
            </a>
          </div>

          {/* Phone */}
          <div className="card-glass p-6 text-center">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-gold" />
            </div>
            <h3 className="text-white font-semibold mb-2">Call Us</h3>
            <p className="text-[#A6AAB4] text-sm mb-4">Prefer to talk? We're here to help</p>
            <a 
              href="tel:+15855550137" 
              className="text-gold hover:underline text-sm"
            >
              (585) 555-0137
            </a>
          </div>

          {/* Turo */}
          <div className="card-glass p-6 text-center">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gold" />
            </div>
            <h3 className="text-white font-semibold mb-2">Message on Turo</h3>
            <p className="text-[#A6AAB4] text-sm mb-4">Fastest way for booking questions</p>
            <a 
              href="https://turo.com/us/en/drivers/22192281" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline text-sm inline-flex items-center gap-1"
            >
              Send Message <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[7vw] py-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-glass p-8">
            <h2 className="text-white font-semibold text-xl mb-6">Send Us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-[#A6AAB4]">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[#A6AAB4] text-sm mb-2 block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-[#A6AAB4] text-sm mb-2 block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-[#A6AAB4] text-sm mb-2 block">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="fleet">Fleet Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A6AAB4] text-sm mb-2 block">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-8">
            {/* Business Hours */}
            <div className="card-glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-gold" />
                <h3 className="text-white font-semibold">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A6AAB4]">Monday - Friday</span>
                  <span className="text-white">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6AAB4]">Saturday - Sunday</span>
                  <span className="text-white">7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-gold">24/7 Pickup & Return</span>
                  <span className="text-white">Available</span>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="card-glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-gold" />
                <h3 className="text-white font-semibold">Service Areas</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['DTW Airport', 'Rochester Hills', 'Troy', 'Auburn Hills', 'Sterling Heights', 'Metro Detroit'].map(area => (
                  <div key={area} className="flex items-center gap-2 text-[#A6AAB4]">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="card-glass p-6">
              <h3 className="text-white font-semibold mb-3">Quick Response Guarantee</h3>
              <p className="text-[#A6AAB4] text-sm leading-relaxed">
                We pride ourselves on fast communication. Whether you email, call, or message us on Turo, 
                you can expect a response within 24 hours—often much sooner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="px-[7vw] py-8">
        <div className="max-w-5xl mx-auto">
          <div className="card-glass p-8 text-center">
            <MapPin size={48} className="text-gold mx-auto mb-4" />
            <h3 className="text-white font-semibold text-xl mb-2">Rochester Hills, Michigan</h3>
            <p className="text-[#A6AAB4] mb-4">
              Serving DTW Airport and the entire Metro Detroit area
            </p>
            <a 
              href="https://maps.google.com/?q=Rochester+Hills+MI" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline text-sm inline-flex items-center gap-1"
            >
              View on Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
