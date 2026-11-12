import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { Clock, Car, CreditCard, ChevronRight, Tag, Info, Banknote } from 'lucide-react';
import type { PaymentMethod } from '../types';
import { formatScheduledPickup, IMMEDIATE_BOOKING_LABEL } from '../services/bookingUtils';

export const FarePreviewScreen: React.FC = () => {
  const { 
    selectedRideType,
    pickupAddress,
    dropAddress,
    stops,
    selectedCategory,
    selectedTransmission,
    packageHours,
    packageKm,
    isAdvanceBooking,
    scheduledPickupTime,
    isCustomerCar,
    estimatedFare,
    confirmBooking,
    navigateTo,
    showToast,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fare = estimatedFare || {
    baseFare: 499,
    perKmRate: 14,
    perHourRate: 120,
    estimatedKm: 40,
    estimatedHours: 4,
    nightAllowance: 0,
    tollEstimate: 0,
    taxGst: 25,
    totalFare: 524,
    discount: 50,
    finalPayable: 474,
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await confirmBooking();
    } catch (err: any) {
      showToast(err.message || 'Booking failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="Fare Breakdown & Booking" showBack onBack={() => navigateTo('configure_ride')} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Trip Overview Card */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {selectedRideType} Chauffeur
            </span>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
              {selectedCategory} • {selectedTransmission}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <div>
                <span className="block text-[10px] text-slate-400">Pickup time</span>
                <span className="font-medium text-slate-200">
                  {isAdvanceBooking
                    ? formatScheduledPickup(new Date(scheduledPickupTime).toISOString())
                    : IMMEDIATE_BOOKING_LABEL}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <span className="text-slate-400 text-[10px] block">Pickup</span>
                <span className="text-slate-200 font-medium">{pickupAddress}</span>
              </div>
            </div>

            {stops.map((stop, index) => (
              <div key={`preview-stop-${index}`} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-300 mt-1.5 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Stop {index + 1}</span>
                  <span className="text-slate-200 font-medium">{stop}</span>
                </div>
              </div>
            ))}

            {dropAddress && (selectedRideType === 'drop' || selectedRideType === 'outstation') && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Destination</span>
                  <span className="text-slate-200 font-medium">{dropAddress}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{packageHours} Hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-slate-500" />
                <span>{packageKm} Km Included</span>
              </div>
              <div className="text-emerald-400 font-medium">
                {isCustomerCar ? 'Your Own Car' : 'AM to PM Fleet'}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Price Breakdown */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Price Calculation</span>
            <span className="text-[10px] font-normal text-slate-500">Transparent Pricing</span>
          </div>

          <div className="flex justify-between text-xs text-slate-300">
            <span>Base Chauffeur Package</span>
            <span className="font-mono">₹{fare.baseFare}</span>
          </div>

          <div className="flex justify-between text-xs text-slate-300">
            <span>Extra Distance Rate</span>
            <span className="font-mono text-slate-400">₹{fare.perKmRate} / km</span>
          </div>

          <div className="flex justify-between text-xs text-slate-300">
            <span>Extra Time Rate</span>
            <span className="font-mono text-slate-400">₹{fare.perHourRate} / hr</span>
          </div>

          {fare.nightAllowance > 0 && (
            <div className="flex justify-between text-xs text-amber-400">
              <span>Night Travel Allowance (10 PM - 6 AM)</span>
              <span className="font-mono">+₹{fare.nightAllowance}</span>
            </div>
          )}

          {fare.tollEstimate > 0 && (
            <div className="flex justify-between text-xs text-slate-300">
              <span>Estimated Highway Tolls</span>
              <span className="font-mono">+₹{fare.tollEstimate}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-slate-300">
            <span>GST & Service Taxes (5%)</span>
            <span className="font-mono">+₹{fare.taxGst}</span>
          </div>

          {fare.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>AM to PM Welcome Privilege</span>
              </span>
              <span className="font-mono">-₹{fare.discount}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-100">Total Net Fare</span>
            <span className="text-amber-400 text-base font-mono">₹{fare.finalPayable}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Payment Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                paymentMethod === 'razorpay'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold">Online / Razorpay</div>
                <div className="text-[10px] text-slate-400">Cards, UPI, Netbanking</div>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                paymentMethod === 'cash'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Banknote className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold">Cash / Post Trip</div>
                <div className="text-[10px] text-slate-400">Pay driver directly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Support Affirmation */}
        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Start and End OTP metering will be activated to protect you from unauthorized trip charges.
          </span>
        </div>
      </div>

      {/* Booking CTA Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Payable</span>
          <div className="text-xl font-bold text-amber-400 font-mono">₹{fare.finalPayable}</div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-7 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Confirm Chauffeur</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
