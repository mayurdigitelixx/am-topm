import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { ArrowLeft, MessageSquareQuote, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OtpScreen: React.FC = () => {
  const { setUser, navigateTo, showToast } = useApp();
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const savedPhone = sessionStorage.getItem('pending_phone') || '9820144829';
    const savedName = sessionStorage.getItem('pending_name') || '';
    setPhone(savedPhone);
    setName(savedName);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      showToast('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiService.verifyOtp(phone, fullOtp, name);
      setUser(res.user);
      showToast('Login Successful! Welcome to AM to PM');
      navigateTo('dashboard');
    } catch (err: any) {
      showToast(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      const res = await apiService.requestOtp(phone);
      setCountdown(30);
      showToast(`New OTP sent: ${res.mockOtp}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to resend');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-slate-100">
      <div>
        <button
          onClick={() => navigateTo('login')}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Number</span>
        </button>

        <div className="mt-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Verify WhatsApp OTP</h2>
          <p className="text-xs text-slate-400 mt-1">
            We have sent a 4-digit code to <span className="font-semibold text-slate-200 font-mono">+91 {phone}</span>
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Prototype Auto-Fill: <strong>1234</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setOtp(['1', '2', '3', '4'])}
            className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold hover:bg-amber-300"
          >
            Insert
          </button>
        </div>

        {/* 4-Digit Input Form */}
        <form onSubmit={handleVerify} className="mt-8">
          <div className="flex justify-between gap-3 max-w-xs mx-auto">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-input-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-14 h-16 bg-slate-800 border-2 border-slate-700 focus:border-amber-400 text-center text-2xl font-mono font-bold rounded-2xl text-slate-100 focus:outline-none transition shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length < 4}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition active:scale-[0.99] mt-8"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Verify & Continue</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {countdown > 0 ? (
            <span>Resend OTP in <strong className="text-slate-200 font-mono">{countdown}s</strong></span>
          ) : (
            <button
              onClick={handleResend}
              className="text-amber-400 hover:underline font-semibold"
            >
              Resend WhatsApp Code
            </button>
          )}
        </div>
      </div>

      <div className="pt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>End-to-end encrypted session authentication</span>
      </div>
    </div>
  );
};
