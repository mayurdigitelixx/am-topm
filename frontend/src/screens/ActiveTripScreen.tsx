import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { apiService } from '../services/apiService';
import { Phone, ShieldCheck, KeyRound, AlertTriangle, Car, ArrowRight, Sparkles } from 'lucide-react';
import { formatScheduledPickup, getScheduledPickupDate, isBookingCancellable } from '../services/bookingUtils';

type ActualUsage = { distanceKm: string; durationHours: string };

export const ActiveTripScreen: React.FC = () => {
  const { activeBooking, setActiveBooking, navigateTo, showToast } = useApp();
  const [tripStep, setTripStep] = useState<'assigned' | 'arrived' | 'running' | 'ended'>('assigned');
  const [currentTime, setCurrentTime] = useState(0);
  const [actualUsageByBooking, setActualUsageByBooking] = useState<Record<string, ActualUsage>>({});

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  if (!activeBooking) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950 text-slate-100 text-center">
        <Car className="w-12 h-12 text-slate-600 mb-3" />
        <h2 className="text-lg font-bold">No Active Booking</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">You don't have an ongoing trip right now.</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs"
        >
          Book a Chauffeur
        </button>
      </div>
    );
  }

  const driver = activeBooking.driver;
  const actualUsage = actualUsageByBooking[activeBooking.id] ?? {
    distanceKm: String(activeBooking.packageKm ?? activeBooking.fare.estimatedKm),
    durationHours: String(activeBooking.packageHours ?? activeBooking.fare.estimatedHours),
  };
  const scheduledPickupDate = getScheduledPickupDate(activeBooking.scheduledTime);
  const isUpcomingScheduledTrip =
    activeBooking.status === 'driver_assigned' &&
    scheduledPickupDate !== null &&
    (currentTime === 0 || scheduledPickupDate.getTime() > currentTime);
  const canCancelTrip = currentTime > 0 && isBookingCancellable(activeBooking, currentTime);

  const handleSimulateArrived = () => {
    const updatedBooking = apiService.updateBookingStatus(activeBooking.id, 'driver_arrived');
    if (!updatedBooking) {
      showToast('Unable to update trip status. Please try again.');
      return;
    }

    setTripStep('arrived');
    setActiveBooking(updatedBooking);
    showToast('Driver has arrived at pickup location!');
  };

  const handleSimulateStartTrip = () => {
    const updatedBooking = apiService.updateBookingStatus(activeBooking.id, 'on_trip');
    if (!updatedBooking) {
      showToast('Unable to start trip. Please try again.');
      return;
    }

    setTripStep('running');
    setActiveBooking(updatedBooking);
    showToast(`Trip Started with OTP: ${activeBooking.startOtp}`);
  };

  const handleSimulateEndTrip = () => {
    const actualDistanceKm = Number(actualUsage.distanceKm);
    const actualDurationHours = Number(actualUsage.durationHours);
    if (
      !actualUsage.distanceKm.trim() ||
      !Number.isFinite(actualDistanceKm) ||
      actualDistanceKm < 0 ||
      !actualUsage.durationHours.trim() ||
      !Number.isFinite(actualDurationHours) ||
      actualDurationHours <= 0
    ) {
      showToast('Enter a valid actual distance and trip duration.');
      return;
    }

    const completedBooking = apiService.recordTripUsage(
      activeBooking.id,
      actualDistanceKm,
      actualDurationHours
    );
    if (!completedBooking) {
      showToast('Unable to record trip usage. Please try again.');
      return;
    }

    setTripStep('ended');
    setActiveBooking(completedBooking);
    showToast(`Trip Ended! End OTP: ${activeBooking.endOtp}`);
  };

  const updateActualUsage = (field: keyof ActualUsage, value: string) => {
    setActualUsageByBooking((current) => ({
      ...current,
      [activeBooking.id]: { ...actualUsage, [field]: value },
    }));
  };

  const handleProceedToPayment = () => {
    navigateTo('payment');
  };

  const handleCancelTrip = () => {
    if (!isBookingCancellable(activeBooking)) {
      showToast('This trip can no longer be cancelled from the app.');
      return;
    }

    if (!window.confirm('Cancel this scheduled trip? This action cannot be undone.')) return;

    const cancelledBooking = apiService.updateBookingStatus(activeBooking.id, 'cancelled');
    if (!cancelledBooking) {
      showToast('Unable to cancel this trip. Please try again.');
      return;
    }

    setActiveBooking(null);
    showToast('Scheduled trip cancelled.');
    navigateTo('rides');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title={`Trip Status • ${activeBooking.id}`} showBack onBack={() => navigateTo('dashboard')} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Status Step Header */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
          {isUpcomingScheduledTrip ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-2 bg-blue-400/10 text-blue-300 border border-blue-400/30">
                Scheduled Ride
              </div>
              <h2 className="text-lg font-bold text-slate-100">Pickup is scheduled</h2>
              <p className="mt-1 text-xs text-slate-300">{formatScheduledPickup(activeBooking.scheduledTime)}</p>
              <p className="text-xs text-slate-400 mt-1">
                Booking ID: <span className="font-mono text-slate-300">{activeBooking.id}</span>
              </p>
            </>
          ) : (
            <>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-2 bg-amber-400/10 text-amber-300 border border-amber-400/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            {tripStep === 'assigned' && 'Chauffeur On the Way'}
            {tripStep === 'arrived' && 'Chauffeur Has Arrived'}
            {tripStep === 'running' && 'Trip in Progress'}
            {tripStep === 'ended' && 'Trip Completed'}
          </div>

          <h2 className="text-lg font-bold text-slate-100">
            {tripStep === 'assigned' && 'Arriving in ~8 minutes'}
            {tripStep === 'arrived' && 'Waiting at your pickup spot'}
            {tripStep === 'running' && 'Driving smoothly to destination'}
            {tripStep === 'ended' && 'Ride complete • Ready for bill'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Booking ID: <span className="font-mono text-slate-300">{activeBooking.id}</span>
          </p>
            </>
          )}
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trip Route</div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-emerald-400 font-bold">Pickup</span>
            <span className="text-slate-200">{activeBooking.pickupAddress}</span>
          </div>
          {activeBooking.stops?.map((stop, index) => (
            <div key={`${activeBooking.id}-stop-${index}`} className="flex items-start gap-2 text-xs">
              <span className="text-amber-400 font-bold">Stop {index + 1}</span>
              <span className="text-slate-200">{stop}</span>
            </div>
          ))}
          <div className="flex items-start gap-2 text-xs">
            <span className="text-amber-400 font-bold">Drop-off</span>
            <span className="text-slate-200">{activeBooking.dropAddress || 'Not recorded for this booking'}</span>
          </div>
        </div>

        {/* Dual OTP Security Box (Extracted from Reverse Engineering) */}
        {!isUpcomingScheduledTrip && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Trip Verification OTPs</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Anti-Fraud Shield</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Start OTP */}
            <div className={`p-3 rounded-xl border ${tripStep === 'running' || tripStep === 'ended' ? 'bg-slate-900/60 border-slate-800 opacity-60' : 'bg-slate-900 border-amber-500/50'}`}>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Start Trip OTP</div>
              <div className="text-2xl font-black font-mono tracking-widest text-amber-400 mt-1">
                {activeBooking.startOtp}
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Share with driver before driving begins</p>
            </div>

            {/* End OTP */}
            <div className={`p-3 rounded-xl border ${tripStep === 'ended' ? 'bg-slate-900 border-emerald-500/60' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">End Trip OTP</div>
              <div className="text-2xl font-black font-mono tracking-widest text-emerald-400 mt-1">
                {activeBooking.endOtp}
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Share only upon arrival at final stop</p>
            </div>
          </div>
        </div>
        )}

        {/* Driver Profile Card */}
        {driver && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={driver.photoUrl}
                  alt={driver.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-100">{driver.name}</h3>
                    {driver.verificationBadge && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-amber-400 font-bold">★ {driver.rating}</span>
                    <span>•</span>
                    <span>{driver.totalTrips} Trips</span>
                    <span>•</span>
                    <span>{driver.experienceYears}y exp</span>
                  </div>
                </div>
              </div>

              {/* Call Driver Button */}
              <a
                href={`tel:${driver.phone}`}
                onClick={(e) => { e.preventDefault(); showToast(`Calling ${driver.name} (${driver.phone})...`); }}
                className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Vehicle Assigned</span>
              <span className="text-slate-200 font-medium">{driver.assignedCar}</span>
            </div>
          </div>
        )}

        {/* Interactive Prototype Progression Controls */}
        {!isUpcomingScheduledTrip && (
        <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Prototype Test Controls (Simulate Driver Actions)</span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {tripStep === 'assigned' && (
              <button
                onClick={handleSimulateArrived}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-700 transition"
              >
                1. Simulate "Driver Reached Pickup"
              </button>
            )}

            {tripStep === 'arrived' && (
              <button
                onClick={handleSimulateStartTrip}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 px-3 rounded-xl transition"
              >
                2. Simulate "Driver Enters Start OTP ({activeBooking.startOtp})"
              </button>
            )}

            {tripStep === 'running' && (
              <>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                <label className="text-[10px] font-semibold text-slate-400">
                  Actual distance (km)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={actualUsage.distanceKm}
                    onChange={(event) => updateActualUsage('distanceKm', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </label>
                <label className="text-[10px] font-semibold text-slate-400">
                  Actual duration (hours)
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={actualUsage.durationHours}
                    onChange={(event) => updateActualUsage('durationHours', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </label>
                <p className="col-span-2 text-[10px] text-slate-500">
                  Extra rates apply only to actual usage beyond the booked package.
                </p>
              </div>
              <button
                onClick={handleSimulateEndTrip}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition"
              >
                3. Record Usage & Finish Trip ({activeBooking.endOtp})
              </button>
              </>
            )}
          </div>
        </div>
        )}

        {/* SOS Emergency Helpline */}
        <div className="flex items-center justify-between p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>AM to PM 24/7 Safety Helpline</span>
          </div>
          <button 
            onClick={() => showToast('Connecting to 24/7 Emergency Dispatch...')}
            className="text-[10px] bg-red-600 text-white font-bold px-2.5 py-1 rounded-lg"
          >
            SOS Alert
          </button>
        </div>
      </div>

      {/* Bottom Action Footer */}
      {isUpcomingScheduledTrip ? (
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          {canCancelTrip ? (
            <button
              type="button"
              onClick={handleCancelTrip}
              className="w-full rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
            >
              Cancel Scheduled Trip
            </button>
          ) : (
            <p className="text-center text-xs text-slate-400">
              Cancellation is available only more than 6 hours before pickup.
            </p>
          )}
        </div>
      ) : tripStep === 'ended' ? (
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <span>
              Proceed to Settlement (₹{activeBooking.fare.finalPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400 shrink-0">
          Safe driving monitored in real-time by AM to PM operations
        </div>
      )}
    </div>
  );
};
