import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SunMedium, Moon, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { user, navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigateTo('dashboard');
      } else {
        navigateTo('login');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [user, navigateTo]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 select-none">
      <div />

      <div className="flex flex-col items-center text-center animate-pulse">
        {/* Dual Sun & Moon Emblem */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-0.5 shadow-2xl shadow-amber-500/20 mb-6 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-amber-500/20 rounded-full blur-lg" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-indigo-500/30 rounded-full blur-lg" />
            <div className="flex items-center gap-1">
              <SunMedium className="w-9 h-9 text-amber-400" />
              <Moon className="w-7 h-7 text-indigo-300 -ml-2" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-200 bg-clip-text text-transparent">
          AM to PM
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
          Chauffeurs • Drivers • 24/7 Mobility
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Professional Drivers</span>
        </div>
        <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-amber-500 animate-[shimmer_1.5s_infinite]" />
        </div>
        <span className="text-[10px] text-slate-600 font-mono">v1.0.0 Prototype Build</span>
      </div>
    </div>
  );
};
