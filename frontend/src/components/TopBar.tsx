import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, HelpCircle, SunMedium } from 'lucide-react';
import { INITIAL_CITIES } from '../services/mockData';

export const TopBar: React.FC<{ title?: string; showBack?: boolean; onBack?: () => void }> = ({
  title,
  showBack,
  onBack,
}) => {
  const { selectedCity, setSelectedCity, navigateTo } = useApp();

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0 z-20">
      {showBack ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack || (() => navigateTo('dashboard'))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <span className="text-sm font-bold px-1">&#8592;</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 tracking-tight">{title || 'AM to PM'}</h1>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Logo badge with Sun (AM) and Moon (PM) icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-center text-white">
              <SunMedium className="w-4 h-4 text-amber-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-300 bg-clip-text text-transparent">
                AM to PM
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono border border-slate-700">
                24/7
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-amber-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
              >
                {INITIAL_CITIES.map(c => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-slate-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Right Action: Help / Support */}
      <button
        onClick={() => navigateTo('support')}
        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
        title="Help & Support"
      >
        <HelpCircle className="w-4 h-4 text-slate-400 hover:text-amber-400" />
      </button>
    </div>
  );
};
