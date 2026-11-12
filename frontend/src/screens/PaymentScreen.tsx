import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { apiService } from '../services/apiService';
import { CreditCard, CheckCircle2, Smartphone, Banknote, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { FareBreakdownCard } from '../components/FareBreakdownCard';

export const PaymentScreen: React.FC = () => {
  const { activeBooking, setActiveBooking, navigateTo, showToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'upi' | 'cash'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  if (!activeBooking) {
    navigateTo('dashboard');
    return null;
  }

  const amount = activeBooking.fare.finalPayable;
  const formattedAmount = amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await apiService.processPayment(activeBooking.id, amount, selectedMethod);
      setTransactionId(res.transactionId);
      setIsCompleted(true);
      showToast('Payment Authorized & Confirmed!');
    } catch (err: any) {
      showToast(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setActiveBooking(null);
    showToast('Thank you for rating your AM to PM Chauffeur!');
    navigateTo('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="Trip Settlement" showBack onBack={() => navigateTo('active_trip')} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isCompleted ? (
          /* Payment Success & Receipt View */
          <div className="space-y-4 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-100">Payment Successful!</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Transaction ID: <span className="font-mono text-emerald-400">{transactionId}</span>
              </p>
              <div className="text-3xl font-extrabold text-amber-400 font-mono mt-3">
                ₹{formattedAmount}
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Booking Reference</span>
                <span className="font-mono text-slate-200">{activeBooking.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chauffeur</span>
                <span className="text-slate-200">{activeBooking.driver?.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service Category</span>
                <span className="text-slate-200">{activeBooking.vehicleCategory} ({activeBooking.rideType})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode</span>
                <span className="text-slate-200 uppercase">{selectedMethod} Gateway</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span>Amount Paid</span>
                <span className="text-emerald-400 font-mono">₹{formattedAmount}</span>
              </div>
            </div>

            <FareBreakdownCard fare={activeBooking.fare} title="Paid Fare Breakdown" />

            {/* Driver Rating & Review */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Rate Your Chauffeur Experience
              </div>

              <div className="flex justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share feedback on driving safety, etiquette, punctuality..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none h-16"
              />
            </div>
          </div>
        ) : (
          /* Payment Method Selection View */
          <>
            {/* Amount Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 p-5 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Invoice Amount</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">₹{formattedAmount}</div>
              <p className="text-[11px] text-slate-400 mt-1">All taxes, toll estimates & allowances included</p>
            </div>

            <FareBreakdownCard fare={activeBooking.fare} title="Final Trip Fare" />

            {/* Gateway Methods */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Choose Payment Option
              </label>

              {/* Razorpay Online */}
              <div
                onClick={() => setSelectedMethod('razorpay')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  selectedMethod === 'razorpay'
                    ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      <span>Razorpay Fast Checkout</span>
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                        Instant
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Cards, Netbanking, Google Pay, PhonePe</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'razorpay' ? 'border-amber-400' : 'border-slate-600'}`}>
                  {selectedMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                </div>
              </div>

              {/* UPI Direct */}
              <div
                onClick={() => setSelectedMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  selectedMethod === 'upi'
                    ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">UPI QR / VPA</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Scan driver's UPI QR code</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-amber-400' : 'border-slate-600'}`}>
                  {selectedMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                </div>
              </div>

              {/* Cash on Hand */}
              <div
                onClick={() => setSelectedMethod('cash')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  selectedMethod === 'cash'
                    ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-600/20 text-amber-400 rounded-xl">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Direct Cash to Chauffeur</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Hand physical currency to driver</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cash' ? 'border-amber-400' : 'border-slate-600'}`}>
                  {selectedMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                </div>
              </div>
            </div>

            {/* Razorpay PCI DSS Certification Badge */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PCI-DSS Level 1 Encrypted Payment Security</span>
            </div>
          </>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        {isCompleted ? (
          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99]"
          >
            <span>Done & Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Authorize & Pay ₹{formattedAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
