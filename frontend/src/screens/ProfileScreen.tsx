import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { ShieldCheck, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import type { SavedAddress } from '../types';
import { apiService } from '../services/apiService';
import { INITIAL_LOCALITIES } from '../services/mockData';

const MUMBAI_LOCALITIES = INITIAL_LOCALITIES.filter((locality) => locality.cityId === 'c1');

export const ProfileScreen: React.FC = () => {
  const { user, logout, navigateTo, showToast } = useApp();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => apiService.getSavedAddresses());

  const updateSavedAddress = (id: string, updates: Partial<SavedAddress>) => {
    setSavedAddresses((current) =>
      current.map((address) => (address.id === id ? { ...address, ...updates } : address))
    );
  };

  const addSavedAddress = () => {
    setSavedAddresses((current) => [
      ...current,
      {
        id: `address_${Date.now().toString(36)}`,
        title: 'New Address',
        addressLine: '',
        locality: '',
        city: 'Mumbai',
        pincode: '',
        latitude: 0,
        longitude: 0,
        isDefault: false,
      },
    ]);
  };

  const saveAddress = (address: SavedAddress) => {
    if (!address.addressLine.trim() || !address.locality || !/^\d{6}$/.test(address.pincode)) {
      showToast('Enter an address, choose a Mumbai area, and provide a 6-digit PIN code.');
      return;
    }

    apiService.saveSavedAddress(address);
    showToast(`${address.title} address saved.`);
  };

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

        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saved Addresses</h2>
              <p className="text-[10px] text-slate-500 mt-1">Choose a Mumbai area to fill its PIN code.</p>
            </div>
            <button
              type="button"
              onClick={addSavedAddress}
              className="shrink-0 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[10px] font-bold text-amber-400"
            >
              + Add Address
            </button>
          </div>

          {savedAddresses.map((address) => (
            <div key={address.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{address.title}</span>
                {address.isDefault && <span className="text-[10px] text-emerald-400">Default</span>}
              </div>

              <label className="block text-[10px] font-semibold text-slate-400">
                Street address
                <input
                  type="text"
                  value={address.addressLine}
                  onChange={(event) => updateSavedAddress(address.id, { addressLine: event.target.value })}
                  placeholder="Flat, building, street"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </label>

              <label className="block text-[10px] font-semibold text-slate-400">
                Mumbai area
                <select
                  value={address.locality}
                  onChange={(event) => {
                    const locality = MUMBAI_LOCALITIES.find((item) => item.name === event.target.value);
                    updateSavedAddress(address.id, {
                      locality: event.target.value,
                      pincode: locality?.pincode ?? address.pincode,
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                >
                  <option value="">Choose area and PIN code</option>
                  {MUMBAI_LOCALITIES.map((locality) => (
                    <option key={locality.id} value={locality.name}>
                      {locality.name} - PIN {locality.pincode}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-[10px] font-semibold text-slate-400">
                PIN code
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(event) =>
                    updateSavedAddress(address.id, { pincode: event.target.value.replace(/\D/g, '').slice(0, 6) })
                  }
                  placeholder="6-digit PIN code"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </label>

              <button
                type="button"
                onClick={() => saveAddress(address)}
                className="w-full rounded-xl bg-amber-400 px-3 py-2.5 text-xs font-bold text-slate-950"
              >
                Save Address
              </button>
            </div>
          ))}
        </section>

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
