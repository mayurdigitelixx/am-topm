import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Monitor, MessageSquareQuote } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileFrame, toggleMobileFrame, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 md:p-6 transition-all">
      {/* Top Controller Bar for Prototype Testing */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-4 mb-2 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-800 text-xs hidden md:flex">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wide text-slate-300">AM to PM Prototype Simulator</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            Mock Mode Active (OTP: 1234)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Expanded Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mobile Frame View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Floating Simulated WhatsApp / Push Notification Toast */}
      {toastMessage && (
        <div className="fixed top-4 z-50 animate-bounce transition-all max-w-md w-full px-4">
          <div className="bg-emerald-950/95 border border-emerald-600/50 text-emerald-100 rounded-2xl p-3.5 shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <div className="p-2 bg-emerald-600/30 rounded-xl text-emerald-400 shrink-0">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>WhatsApp Notification</span>
                <span className="text-[10px] text-emerald-400 font-mono">Just Now</span>
              </div>
              <p className="mt-1 text-slate-200">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Phone Chassis Container */}
      <main
        className={`w-full transition-all duration-300 flex flex-col relative overflow-hidden bg-slate-900 ${
          isMobileFrame
            ? 'max-w-[420px] h-[890px] rounded-[48px] border-[10px] border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] ring-1 ring-slate-700'
            : 'max-w-2xl min-h-[90vh] rounded-2xl border border-slate-800 shadow-xl'
        }`}
      >
        {/* Dynamic Island / Speaker notch for Mobile Chassis */}
        {isMobileFrame && (
          <div className="w-full pt-3 pb-1 px-8 flex justify-between items-center z-40 bg-slate-900 shrink-0 select-none">
            <span className="text-[13px] font-semibold tracking-tight text-slate-200">9:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center border border-slate-800/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 ml-auto mr-2" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-5 h-2.5 border border-slate-400 rounded-[3px] p-0.5 flex items-center">
                <div className="h-full w-full bg-slate-200 rounded-[1px]" />
              </div>
            </div>
          </div>
        )}

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator bar for Mobile Chassis */}
        {isMobileFrame && (
          <div className="w-full py-2 flex justify-center bg-slate-900 shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        )}
      </main>
    </div>
  );
};
