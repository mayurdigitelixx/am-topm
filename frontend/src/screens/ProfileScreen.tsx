import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { ShieldCheck, LogOut, ChevronRight, Sparkles } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="My Account" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* User Card */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/40 rounded-2xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-100">{user?.name || 'Valued Member'}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">+91 {user?.phone || '9820144829'}</div>
            <div className="text-[10px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AM to PM Privilege Pass</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
          <div 
            onClick={() => navigateTo('garage')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800 text-amber-400">🚗</div>
              <span className="font-semibold">My Vehicles (Garage)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div 
            onClick={() => navigateTo('rides')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800 text-blue-400">📅</div>
              <span className="font-semibold">Booking History & Receipts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div 
            onClick={() => navigateTo('support')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">🎧</div>
              <span className="font-semibold">Help Center & Tickets</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Legal & App Rules (from /api/app-rules and /api/polices) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2.5 text-xs text-slate-400">
          <div className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
            Platform Policies & Rules
          </div>
          <div className="flex justify-between items-center py-1 cursor-pointer hover:text-slate-200">
            <span>Cancellation Policy & Fair Usage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex justify-between items-center py-1 cursor-pointer hover:text-slate-200">
            <span>Chauffeur Code of Conduct & Vetting</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex justify-between items-center py-1 cursor-pointer hover:text-slate-200">
            <span>Terms of Service & Privacy Policy</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full p-3.5 rounded-2xl bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Account</span>
        </button>

        <div className="text-center text-[10px] text-slate-600 font-mono pt-2">
          AM to PM Mobility OS • Build 3.12.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
