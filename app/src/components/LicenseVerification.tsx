import { useState } from 'react';
import { CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LicenseVerificationProps {
  onComplete?: () => void;
}

export default function LicenseVerification({ onComplete }: LicenseVerificationProps) {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: user?.licenseNumber || '',
    licenseState: user?.licenseState || '',
    licenseExpiry: user?.licenseExpiry || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = await updateProfile({
      ...formData,
      licenseVerified: true,
    });
    
    setIsSubmitting(false);
    
    if (success) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">Verification Submitted!</h3>
        <p className="text-[#A6AAB4]">Your driver's license has been verified. You can now book vehicles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded ${
              step >= s ? 'bg-gold' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Driver's License Information</h3>
          <p className="text-[#A6AAB4] text-sm">Please enter your driver's license details for verification.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="A12345678"
              />
            </div>
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">State</label>
              <select
                value={formData.licenseState}
                onChange={(e) => setFormData({ ...formData, licenseState: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
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
              <label className="text-[#A6AAB4] text-sm mb-1 block">Expiry Date</label>
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.licenseNumber || !formData.licenseState || !formData.licenseExpiry || !formData.dateOfBirth}
            className="btn-primary w-full disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Address Information</h3>
          <p className="text-[#A6AAB4] text-sm">Please enter your current address.</p>
          
          <div>
            <label className="text-[#A6AAB4] text-sm mb-1 block">Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="Detroit"
              />
            </div>
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              >
                <option value="">Select</option>
                <option value="MI">MI</option>
                <option value="OH">OH</option>
                <option value="IN">IN</option>
                <option value="IL">IL</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">ZIP</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="48201"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="btn-outline flex-1">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.address || !formData.city || !formData.state || !formData.zip}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Upload License Photo</h3>
          <p className="text-[#A6AAB4] text-sm">Please upload a clear photo of your driver's license.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
              <Camera size={32} className="text-gold mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Front of License</p>
              <p className="text-[#A6AAB4] text-xs mt-1">Click to upload</p>
            </div>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
              <Camera size={32} className="text-gold mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Back of License</p>
              <p className="text-[#A6AAB4] text-xs mt-1">Click to upload</p>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-gold mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Important</p>
                <p className="text-[#A6AAB4] text-xs mt-1">
                  Make sure all text is clearly visible and the photo is well-lit. 
                  We use secure encryption to protect your information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="btn-outline flex-1">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Complete Verification'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
