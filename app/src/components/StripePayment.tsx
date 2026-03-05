import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      // Create payment intent on your backend
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
      // });
      // const { clientSecret } = await response.json();

      // For demo purposes, simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Confirm card payment
      // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: elements.getElement(CardElement)!,
      //   },
      // });

      // if (error) {
      //   setCardError(error.message || 'Payment failed');
      //   onError(error.message || 'Payment failed');
      // } else if (paymentIntent.status === 'succeeded') {
      //   onSuccess(paymentIntent.id);
      // }

      // Demo success
      onSuccess('pi_demo_' + Date.now());
    } catch (err) {
      setCardError('An error occurred. Please try again.');
      onError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        '::placeholder': {
          color: '#A6AAB4',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-charcoal-light p-4 rounded-lg border border-white/10">
        <label className="text-[#A6AAB4] text-sm mb-2 block">Card Information</label>
        <div className="bg-charcoal p-3 rounded border border-white/10">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && (
          <p className="text-red-400 text-sm mt-2">{cardError}</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-[#A6AAB4] text-sm">
        <Lock size={14} />
        <span>Your payment is secured with Stripe encryption</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay ${amount}
          </>
        )}
      </button>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  const [isComplete, setIsComplete] = useState(false);

  const handleSuccess = (paymentIntentId: string) => {
    setIsComplete(true);
    onSuccess(paymentIntentId);
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-[#A6AAB4]">Your booking has been confirmed.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} onSuccess={handleSuccess} onError={onError} />
    </Elements>
  );
}
