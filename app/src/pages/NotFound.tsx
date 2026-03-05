import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12 flex items-center justify-center">
      <div className="px-[7vw] text-center max-w-2xl">
        {/* 404 */}
        <div className="mb-8">
          <span className="text-[clamp(100px,20vw,200px)] font-display font-bold text-gold/20 leading-none">
            404
          </span>
        </div>
        
        <h1 className="heading-display text-[clamp(24px,4vw,48px)] text-white mb-4">
          PAGE NOT FOUND
        </h1>
        
        <p className="text-[#A6AAB4] text-lg mb-8 max-w-md mx-auto">
          Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/fleet" className="btn-outline flex items-center gap-2">
            <Search size={18} />
            Browse Fleet
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-[#A6AAB4] text-sm mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/booking" className="text-gold hover:underline flex items-center gap-1">
              <ArrowLeft size={14} /> Book a Vehicle
            </Link>
            <Link to="/about" className="text-gold hover:underline">
              About Us
            </Link>
            <Link to="/contact" className="text-gold hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
