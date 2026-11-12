import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import type { RideType } from '../types';
import { Clock, MapPin, Car, Navigation, Briefcase, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatScheduledPickup, getScheduledPickupDate } from '../services/bookingUtils';

export const DashboardScreen: React.FC = () => {
  const { 
    user, 
    startBookingFlow, 
    activeBooking, 
    navigateTo, 
    pickupAddress, 
    setPickupAddress,
    selectedCity 
  } = useApp();

  const rideModes = [
    {
      id: 'local' as RideType,
      title: 'City Chauffeur',
      badge: 'Most Popular',
      desc: 'Hourly driver for your shopping, meetings, or night outs',
      rate: 'Starts ₹499 (4 hrs)',
      icon: Clock,
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      id: 'outstation' as RideType,
      title: 'Outstation Trip',
      badge: 'Intercity',
      desc: 'Experienced highway drivers for outstation & vacation trips',
      rate: 'Starts ₹1,499 / day',
      icon: Navigation,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      id: 'drop' as RideType,
      title: 'One-Way Drop',
      badge: 'Airport & Point-to-Point',
      desc: 'Safe one-way drop to airport, railway station, or late night return',
      rate: 'Starts ₹399',
      icon: MapPin,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'monthly' as RideType,
      title: 'Monthly Dedicated',
      badge: 'Contract',
      desc: 'Permanent corporate or family chauffeur on monthly contract',
      rate: 'Custom Pricing',
      icon: Briefcase,
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];
  const isScheduledRide =
    activeBooking?.status === 'driver_assigned' &&
    getScheduledPickupDate(activeBooking.scheduledTime) !== null;

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Active Booking Banner Alert (If trip is ongoing) */}
        {activeBooking && activeBooking.status !== 'completed' && activeBooking.status !== 'cancelled' && (
          <div 
            onClick={() => navigateTo('active_trip')}
            className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl flex items-center justify-between shadow-lg cursor-pointer hover:border-emerald-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Car className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {isScheduledRide ? 'Scheduled Ride' : 'Ride Active'}
                  </span>
                  {!isScheduledRide && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                      OTP: {activeBooking.startOtp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {isScheduledRide
                    ? formatScheduledPickup(activeBooking.scheduledTime)
                    : `Driver: ${activeBooking.driver?.name || 'Assigned'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-400">
              <span>Track</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        )}

        {/* Welcome & Location Selector */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Hello, {user?.name || 'Driver Suvidha Member'}</span>
            <span className="text-[11px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              AM to PM Guaranteed
            </span>
          </div>

          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
            Pickup Location in {selectedCity}
          </label>
          <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Enter pickup address or landmark"
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4 Core Service Modes */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">Select Service Mode</h2>
            <span className="text-[11px] text-slate-500 font-medium">24 Hours Service</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {rideModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  onClick={() => startBookingFlow(mode.id)}
                  className={`p-3.5 rounded-2xl bg-gradient-to-r ${mode.gradient} bg-slate-900 border ${mode.borderColor} hover:border-slate-500 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-slate-800/90 ${mode.iconColor} border border-slate-700/60 shadow-inner shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                          {mode.title}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {mode.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {mode.desc}
                      </p>
                      <span className="text-xs font-bold text-amber-400 mt-1.5 block">
                        {mode.rate}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 rounded-full bg-slate-800/80 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-400 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Why AM to PM Chauffeurs?</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="font-semibold text-slate-200">Police Verified</div>
              <div className="text-[10px] text-slate-400">Strict background checks</div>
            </div>
            <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400 mb-1" />
              <div className="font-semibold text-slate-200">On-Time Guarantee</div>
              <div className="text-[10px] text-slate-400">Arrives in 15-30 mins</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
