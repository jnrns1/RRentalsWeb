import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, User, Mail, Lock, Phone, Eye, EyeOff, CreditCard, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // For multi-step registration
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, register } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    // License info
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    dateOfBirth: '',
    // Address info
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateStep1 = () => {
    return formData.email && formData.password && formData.password.length >= 6 &&
           formData.firstName && formData.lastName && formData.phone;
  };

  const validateStep2 = () => {
    return formData.licenseNumber && formData.licenseState && formData.licenseExpiry && formData.dateOfBirth;
  };

  const validateStep3 = () => {
    return formData.address && formData.city && formData.state && formData.zip;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Handle admin login
        if (formData.email === 'admin' && formData.password === 'admin') {
          const success = await login('admin', 'admin');
          if (success) {
            onClose();
          } else {
            setError('Invalid admin credentials');
          }
          setIsLoading(false);
          return;
        }

        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Registration with license info
        const success = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber,
          licenseState: formData.licenseState,
          licenseExpiry: formData.licenseExpiry,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        });

        if (success) {
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
            setIsSuccess(false);
            setStep(1);
            setFormData({
              email: '', password: '', firstName: '', lastName: '', phone: '',
              licenseNumber: '', licenseState: '', licenseExpiry: '', dateOfBirth: '',
              address: '', city: '', state: '', zip: '',
            });
          }, 2000);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError('');
    setFormData({
      email: '', password: '', firstName: '', lastName: '', phone: '',
      licenseNumber: '', licenseState: '', licenseExpiry: '', dateOfBirth: '',
      address: '', city: '', state: '', zip: '',
    });
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-charcoal-light w-full max-w-md rounded-lg border border-white/10 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="heading-display text-2xl text-white mb-2">ACCOUNT CREATED!</h2>
          <p className="text-[#A6AAB4]">Your account has been created successfully. You can now book vehicles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-charcoal-light w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A6AAB4] hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className="heading-display text-2xl text-white mb-2">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-[#A6AAB4] text-sm">
            {mode === 'login'
              ? 'Sign in to access your bookings and preferences'
              : 'Join Rochester Car Rental for exclusive benefits'}
          </p>
          
          {/* Progress indicator for registration */}
          {mode === 'register' && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded ${step >= s ? 'bg-gold' : 'bg-white/10'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <>
              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="you@example.com or admin"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 pl-10 pr-12 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6AAB4] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-gold/10 border border-gold/30 rounded-lg p-3">
                <p className="text-gold text-xs">
                  <strong>Admin Login:</strong> Use username "admin" and password "admin"
                </p>
              </div>

              <button
                type="submit"
                disabled={!formData.email || !formData.password || isLoading}
                className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </>
          )}

          {/* REGISTER MODE - STEP 1: Basic Info */}
          {mode === 'register' && step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Last Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-charcoal border border-white/10 pl-10 pr-12 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6AAB4] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!validateStep1()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </>
          )}

          {/* REGISTER MODE - STEP 2: License Info */}
          {mode === 'register' && step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-gold" />
                <h3 className="text-white font-semibold">Driver's License Information</h3>
              </div>
              <p className="text-[#A6AAB4] text-sm mb-4">Required for vehicle rental verification.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="A12345678"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">State</label>
                  <select
                    name="licenseState"
                    value={formData.licenseState}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="">Select State</option>
                    <option value="MI">Michigan</option>
                    <option value="OH">Ohio</option>
                    <option value="IN">Indiana</option>
                    <option value="IL">Illinois</option>
                    <option value="WI">Wisconsin</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="NY">New York</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Expiry Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                    <input
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-white/10 pl-10 pr-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!validateStep2()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* REGISTER MODE - STEP 3: Address Info */}
          {mode === 'register' && step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-gold" />
                <h3 className="text-white font-semibold">Address Information</h3>
              </div>

              <div>
                <label className="text-xs text-[#A6AAB4] micro-label block mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="Detroit"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="MI">MI</option>
                    <option value="OH">OH</option>
                    <option value="IN">IN</option>
                    <option value="IL">IL</option>
                    <option value="WI">WI</option>
                    <option value="PA">PA</option>
                    <option value="NY">NY</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#A6AAB4] micro-label block mb-2">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-white/10 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors"
                    placeholder="48201"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!validateStep3() || isLoading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Toggle Mode */}
          {mode === 'login' && (
            <p className="text-center text-sm text-[#A6AAB4] mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className="text-gold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
          {mode === 'register' && step === 1 && (
            <p className="text-center text-sm text-[#A6AAB4] mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="text-gold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-[#A6AAB4] text-center">
            By {mode === 'login' ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <Link to="/terms" className="text-gold hover:underline" onClick={onClose}>Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-gold hover:underline" onClick={onClose}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
