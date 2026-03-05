import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Calendar, Users, DollarSign, Car, ArrowRight, CreditCard, Lock } from 'lucide-react';
import { getVehicleById, getRecommendedVehicles, categoryLabels, type Vehicle } from '../data/vehicles';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import StripePayment from '../components/StripePayment';

interface BookingFormData {
  budget: string;
  category: string;
  passengers: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const preselectedVehicle = searchParams.get('vehicle');
  const preselectedStart = searchParams.get('start');
  const preselectedEnd = searchParams.get('end');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    budget: '',
    category: 'all',
    passengers: '1-2',
    startDate: preselectedStart || '',
    endDate: preselectedEnd || '',
    pickupLocation: 'dtw',
  });
  const [recommendedVehicles, setRecommendedVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    preselectedVehicle ? (getVehicleById(preselectedVehicle) || null) : null
  );

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const findMatches = () => {
    const budget = parseInt(formData.budget) || 500;
    const matches = getRecommendedVehicles(budget, formData.category);
    setRecommendedVehicles(matches);
    setStep(3);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setStep(4);
  };

  const handlePaymentSuccess = () => {
    setStep(5);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  // Calculate total price
  const days = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;
  const totalPrice = selectedVehicle ? days * selectedVehicle.pricePerDay : 0;

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Header */}
      <div className="px-[7vw] mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#A6AAB4] hover:text-gold transition-colors mb-6"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Back to Home</span>
        </Link>
        
        <h1 className="heading-display text-[clamp(32px,5vw,64px)] text-white mb-2">
          BOOK YOUR VEHICLE
        </h1>
        <p className="text-[#A6AAB4]">
          Tell us what you're looking for and we'll find your perfect match
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step >= s ? 'bg-gold text-charcoal' : 'bg-charcoal-light text-[#A6AAB4] border border-white/10'}
              `}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 5 && (
                <div className={`w-12 h-0.5 ${step > s ? 'bg-gold' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-[7vw] max-w-4xl">
        {step === 1 && (
          <StepOnePreferences 
            formData={formData} 
            onChange={handleInputChange} 
            onNext={() => setStep(2)} 
          />
        )}
        
        {step === 2 && (
          <StepTwoDates 
            formData={formData} 
            onChange={handleInputChange} 
            onBack={() => setStep(1)}
            onNext={findMatches}
          />
        )}
        
        {step === 3 && (
          <StepThreeMatches 
            vehicles={recommendedVehicles}
            formData={formData}
            onBack={() => setStep(2)}
            onSelect={handleVehicleSelect}
          />
        )}
        
        {step === 4 && selectedVehicle && (
          <StepFourReview 
            vehicle={selectedVehicle}
            formData={formData}
            days={days}
            totalPrice={totalPrice}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
            isAuthenticated={isAuthenticated}
            user={user}
          />
        )}

        {step === 5 && selectedVehicle && (
          <StepFivePayment
            vehicle={selectedVehicle}
            formData={formData}
            days={days}
            totalPrice={totalPrice}
            onBack={() => setStep(4)}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        )}
      </div>
    </div>
  );
}

// Step 1: Preferences
function StepOnePreferences({ 
  formData, 
  onChange, 
  onNext 
}: { 
  formData: BookingFormData; 
  onChange: (field: keyof BookingFormData, value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="card-glass p-8">
      <h2 className="text-white font-semibold text-xl mb-6">What are you looking for?</h2>
      
      <div className="space-y-6">
        {/* Budget */}
        <div>
          <label className="text-[#A6AAB4] text-sm mb-3 block">Daily Budget</label>
          <div className="grid grid-cols-4 gap-3">
            {['45', '65', '85', '120'].map((price) => (
              <button
                key={price}
                onClick={() => onChange('budget', price)}
                className={`
                  p-4 rounded-lg border transition-all text-center
                  ${formData.budget === price
                    ? 'bg-gold border-gold text-charcoal'
                    : 'bg-charcoal border-white/10 text-white hover:border-gold'
                  }
                `}
              >
                <DollarSign size={18} className="mx-auto mb-1" />
                <div className="font-semibold">${price}</div>
                <div className="text-xs opacity-70">per day</div>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Category */}
        <div>
          <label className="text-[#A6AAB4] text-sm mb-3 block">Vehicle Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'all', label: 'Any Type', icon: Car },
              { id: 'economy', label: 'Economy', icon: Car },
              { id: 'suv', label: 'SUV/Van', icon: Users },
              { id: 'luxury', label: 'Luxury', icon: Car },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChange('category', id)}
                className={`
                  p-4 rounded-lg border transition-all text-center
                  ${formData.category === id
                    ? 'bg-gold border-gold text-charcoal'
                    : 'bg-charcoal border-white/10 text-white hover:border-gold'
                  }
                `}
              >
                <Icon size={18} className="mx-auto mb-1" />
                <div className="text-sm">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="text-[#A6AAB4] text-sm mb-3 block">Number of Passengers</label>
          <div className="grid grid-cols-4 gap-3">
            {['1-2', '3-4', '5-6', '7+'].map((count) => (
              <button
                key={count}
                onClick={() => onChange('passengers', count)}
                className={`
                  p-4 rounded-lg border transition-all text-center
                  ${formData.passengers === count
                    ? 'bg-gold border-gold text-charcoal'
                    : 'bg-charcoal border-white/10 text-white hover:border-gold'
                  }
                `}
              >
                <Users size={18} className="mx-auto mb-1" />
                <div className="text-sm">{count}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!formData.budget}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight size={18} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}

// Step 2: Dates & Location
function StepTwoDates({ 
  formData, 
  onChange, 
  onBack,
  onNext 
}: { 
  formData: BookingFormData; 
  onChange: (field: keyof BookingFormData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="card-glass p-8">
      <h2 className="text-white font-semibold text-xl mb-6">When do you need it?</h2>
      
      <div className="space-y-6">
        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-[#A6AAB4] text-sm mb-2 block">Pickup Date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white focus:border-gold focus:outline-none rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-[#A6AAB4] text-sm mb-2 block">Return Date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
                className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white focus:border-gold focus:outline-none rounded"
              />
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label className="text-[#A6AAB4] text-sm mb-3 block">Pickup Location</label>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { id: 'dtw', label: 'DTW Airport', desc: 'Terminal pickup' },
              { id: 'rochester', label: 'Rochester Hills', desc: 'Local pickup' },
              { id: 'delivery', label: 'Custom Delivery', desc: "We'll come to you" },
            ].map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => onChange('pickupLocation', id)}
                className={`
                  p-4 rounded-lg border transition-all text-left
                  ${formData.pickupLocation === id
                    ? 'bg-gold border-gold text-charcoal'
                    : 'bg-charcoal border-white/10 text-white hover:border-gold'
                  }
                `}
              >
                <div className="font-semibold">{label}</div>
                <div className={`text-xs ${formData.pickupLocation === id ? 'text-charcoal/70' : 'text-[#A6AAB4]'}`}>
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="btn-outline flex-1"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!formData.startDate || !formData.endDate}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Matches <ArrowRight size={18} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 3: Matches
function StepThreeMatches({ 
  vehicles,
  formData,
  onBack,
  onSelect 
}: { 
  vehicles: Vehicle[];
  formData: BookingFormData;
  onBack: () => void;
  onSelect: (vehicle: Vehicle) => void;
}) {
  const days = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-xl">Recommended for You</h2>
          <p className="text-[#A6AAB4] text-sm">
            {vehicles.length} vehicles match your criteria • {days} days rental
          </p>
        </div>
        <button onClick={onBack} className="btn-outline text-sm py-2 px-4">
          Modify Search
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="card-glass p-8 text-center">
          <p className="text-[#A6AAB4] mb-4">No vehicles match your exact criteria.</p>
          <button onClick={onBack} className="text-gold hover:underline">
            Try adjusting your preferences
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card-glass p-4 flex gap-4 hover:border-gold/30 transition-all">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-32 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-gold text-xs">{categoryLabels[vehicle.category]}</span>
                    <h3 className="text-white font-semibold">{vehicle.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-bold">${vehicle.pricePerDay * days}</div>
                    <div className="text-[#A6AAB4] text-xs">total</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#A6AAB4]">
                  <span>{vehicle.year}</span>
                  <span>{vehicle.seats} seats</span>
                  <span>{vehicle.mpg > 0 ? `${vehicle.mpg} MPG` : 'Electric'}</span>
                </div>
                <button
                  onClick={() => onSelect(vehicle)}
                  className="btn-primary w-full mt-3 text-xs py-2"
                >
                  Select This Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Step 4: Review Booking
function StepFourReview({ 
  vehicle,
  formData,
  days,
  totalPrice,
  onBack,
  onNext,
  isAuthenticated,
  user
}: { 
  vehicle: Vehicle;
  formData: BookingFormData;
  days: number;
  totalPrice: number;
  onBack: () => void;
  onNext: () => void;
  isAuthenticated: boolean;
  user: any;
}) {
  const locations: Record<string, string> = {
    dtw: 'DTW Airport Terminal',
    rochester: 'Rochester Hills',
    delivery: 'Custom Delivery Location',
  };

  return (
    <div className="card-glass p-8">
      <h2 className="text-white font-semibold text-xl mb-6">Review Your Booking</h2>
      
      {/* Vehicle Summary */}
      <div className="flex gap-4 mb-6 p-4 bg-charcoal rounded-lg">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-24 h-16 object-cover rounded"
        />
        <div>
          <span className="text-gold text-xs">{categoryLabels[vehicle.category]}</span>
          <h3 className="text-white font-semibold">{vehicle.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-[#A6AAB4]">
            <span>{vehicle.year}</span>
            <span>{vehicle.seats} seats</span>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#A6AAB4]">Pickup</span>
          <span className="text-white">{formData.startDate ? format(parseISO(formData.startDate), 'MMM dd, yyyy') : '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#A6AAB4]">Return</span>
          <span className="text-white">{formData.endDate ? format(parseISO(formData.endDate), 'MMM dd, yyyy') : '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#A6AAB4]">Location</span>
          <span className="text-white">{locations[formData.pickupLocation]}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#A6AAB4]">Duration</span>
          <span className="text-white">{days} days</span>
        </div>
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-[#A6AAB4]">{days} days × ${vehicle.pricePerDay}</span>
            <span className="text-white">${totalPrice}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[#A6AAB4]">Delivery Fee</span>
            <span className="text-gold">FREE</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
            <span className="text-white font-semibold">Total</span>
            <span className="text-gold font-bold text-xl">${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* License Verification Notice */}
      {isAuthenticated && !user?.licenseVerified && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm">
            <strong>Note:</strong> Your driver's license verification is pending. You can still complete the booking, but you'll need to verify your license before pickup.
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
          <p className="text-gold text-sm">
            <strong>Note:</strong> You'll need to sign in or create an account with driver's license information to complete this booking.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="btn-outline flex-1"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

// Step 5: Payment
function StepFivePayment({
  vehicle,
  formData,
  days,
  totalPrice,
  onBack,
  onPaymentSuccess,
  onPaymentError
}: {
  vehicle: Vehicle;
  formData: BookingFormData;
  days: number;
  totalPrice: number;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const locations: Record<string, string> = {
    dtw: 'DTW Airport Terminal',
    rochester: 'Rochester Hills',
    delivery: 'Custom Delivery Location',
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Booking Summary */}
      <div className="card-glass p-6">
        <h3 className="text-white font-semibold mb-4">Booking Summary</h3>
        
        <div className="flex gap-3 mb-4">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-20 h-14 object-cover rounded"
          />
          <div>
            <span className="text-gold text-xs">{categoryLabels[vehicle.category]}</span>
            <h4 className="text-white font-medium text-sm">{vehicle.name}</h4>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#A6AAB4]">Pickup</span>
            <span className="text-white">{formData.startDate ? format(parseISO(formData.startDate), 'MMM dd, yyyy') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A6AAB4]">Return</span>
            <span className="text-white">{formData.endDate ? format(parseISO(formData.endDate), 'MMM dd, yyyy') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A6AAB4]">Location</span>
            <span className="text-white">{locations[formData.pickupLocation]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A6AAB4]">Duration</span>
            <span className="text-white">{days} days</span>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Total</span>
            <span className="text-gold font-bold text-2xl">${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="card-glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-gold" />
          <h3 className="text-white font-semibold">Secure Payment</h3>
        </div>
        
        <p className="text-[#A6AAB4] text-sm mb-4">
          Your payment is secured with Stripe encryption. We never store your card details.
        </p>

        {!showPaymentForm ? (
          <div className="space-y-4">
            <div className="bg-charcoal p-4 rounded border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Amount to Pay</span>
                <span className="text-gold font-bold">${totalPrice}</span>
              </div>
              <p className="text-[#A6AAB4] text-xs">
                This includes the full rental cost. No hidden fees.
              </p>
            </div>
            
            <button
              onClick={() => setShowPaymentForm(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Enter Card Details
            </button>
            
            <button
              onClick={onBack}
              className="btn-outline w-full"
            >
              Back
            </button>
          </div>
        ) : (
          <StripePayment
            amount={totalPrice}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
          />
        )}
      </div>
    </div>
  );
}
