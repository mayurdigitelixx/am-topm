import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { ArrowRight, ShieldCheck, SunMedium } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('9820144829');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiService.requestOtp(phoneNumber);
      // Store pending phone in sessionStorage for OTP verification
      sessionStorage.setItem('pending_phone', phoneNumber);
      sessionStorage.setItem('pending_name', name);
      showToast(`WhatsApp OTP sent: ${res.mockOtp} (Enter 1234 to verify)`);
      navigateTo('otp');
    } catch (err: any) {
      showToast(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-slate-100">
      {/* Brand Header */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <SunMedium className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-amber-400 to-indigo-300 bg-clip-text text-transparent">
              AM to PM
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">On-Demand Chauffeur Service</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            {isNewUser ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Book professional, verified chauffeurs on an hourly, outstation, or monthly basis.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
          {isNewUser && (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Mayur Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                required={isNewUser}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Mobile Number</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-semibold text-slate-400 border-r border-slate-700 pr-2">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-16 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition font-mono tracking-wider"
                required
              />
            </div>
            <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
              <span>&#x2713;</span> Instant OTP verification via WhatsApp
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneNumber.length < 10}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition active:scale-[0.99] mt-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Get WhatsApp OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsNewUser(!isNewUser)}
            className="text-xs text-amber-400 hover:underline font-medium"
          >
            {isNewUser ? 'Already have an account? Sign In' : 'New to AM to PM? Register here'}
          </button>
        </div>
      </div>

      {/* Safety Footnote */}
      <div className="pt-6 border-t border-slate-800/60 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Background Checked & Verified Drivers</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          By proceeding, you agree to AM to PM Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
