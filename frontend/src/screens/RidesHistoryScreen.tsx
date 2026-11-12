import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { apiService } from '../services/apiService';
import { CalendarClock, Clock, ChevronRight } from 'lucide-react';
import { formatScheduledPickup, getScheduledPickupDate } from '../services/bookingUtils';

export const RidesHistoryScreen: React.FC = () => {
  const { navigateTo, setActiveBooking } = useApp();
  const bookings = apiService.getLocalBookings();

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="My Trips History" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <CalendarClock className="w-12 h-12 text-slate-600 mb-3" />
            <div className="text-sm font-bold text-slate-300">No Trips Booked Yet</div>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              When you book hourly chauffeurs or outstation rides, your trip history will appear here.
            </p>
            <button
              onClick={() => navigateTo('dashboard')}
              className="mt-6 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Book Chauffeur Now
            </button>
          </div>
        ) : (
          bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            const scheduledPickup = getScheduledPickupDate(booking.scheduledTime);
            const isScheduled = booking.status === 'driver_assigned' && scheduledPickup !== null;

            return (
            <div
              key={booking.id}
              onClick={
                isCancelled
                  ? undefined
                  : () => {
                      setActiveBooking(booking);
                      navigateTo(booking.status === 'completed' ? 'payment' : 'active_trip');
                    }
              }
              className={`p-3.5 bg-slate-900 rounded-2xl border border-slate-800 transition space-y-2.5 ${
                isCancelled ? '' : 'cursor-pointer hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {booking.rideType} Ride
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    booking.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCancelled
                        ? 'bg-red-500/20 text-red-300'
                        : isScheduled
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300 animate-pulse'
                  }`}>
                    {booking.status === 'completed'
                      ? 'Completed'
                      : isCancelled
                        ? 'Cancelled'
                        : isScheduled
                          ? 'Scheduled'
                          : 'In Progress'}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  ₹{booking.fare.finalPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate">Pickup: {booking.pickupAddress}</span>
                </div>
                {booking.stops?.map((stop, index) => (
                  <div key={`${booking.id}-stop-${index}`} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    <span className="truncate">Stop {index + 1}: {stop}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">Drop-off: {booking.dropAddress || 'Not recorded for this booking'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {scheduledPickup
                      ? `Pickup ${formatScheduledPickup(booking.scheduledTime)}`
                      : `Booked ${new Date(booking.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
                {!isCancelled && (
                  <div className="flex items-center text-amber-400 font-medium">
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};
