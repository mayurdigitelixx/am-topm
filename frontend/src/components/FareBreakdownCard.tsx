import React from 'react';
import { Tag } from 'lucide-react';
import type { FareBreakdown } from '../types';

interface FareBreakdownCardProps {
  fare: FareBreakdown;
  title: string;
}

export const FareBreakdownCard: React.FC<FareBreakdownCardProps> = ({ fare, title }) => {
  const extraDistanceKm = fare.extraDistanceKm ?? 0;
  const extraHours = fare.extraHours ?? 0;
  const distanceCharge = fare.distanceCharge ?? 0;
  const timeCharge = fare.timeCharge ?? 0;
  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
        <span>{title}</span>
        <span className="text-[10px] font-normal text-slate-500">Extra usage finalized after trip</span>
      </div>

      <div className="flex justify-between gap-3 text-xs text-slate-300">
        <span>Base package ({fare.estimatedKm} km / {fare.estimatedHours} hrs)</span>
        <span className="font-mono">₹{formatCurrency(fare.baseFare)}</span>
      </div>

      <div className="flex justify-between gap-3 text-xs text-slate-300">
        <span>Extra distance ({extraDistanceKm} km × ₹{fare.perKmRate}/km)</span>
        <span className="font-mono">₹{formatCurrency(distanceCharge)}</span>
      </div>

      <div className="flex justify-between gap-3 text-xs text-slate-300">
        <span>Extra time ({extraHours} hrs × ₹{fare.perHourRate}/hr)</span>
        <span className="font-mono">₹{formatCurrency(timeCharge)}</span>
      </div>

      <div className="flex justify-between gap-3 text-xs text-amber-400">
        <span>Overnight allowance (trip overlaps 10 PM-6 AM)</span>
        <span className="font-mono">
          {fare.nightAllowance > 0 ? `₹${formatCurrency(fare.nightAllowance)}` : 'Not applicable'}
        </span>
      </div>

      {fare.tollEstimate > 0 && (
        <div className="flex justify-between gap-3 text-xs text-slate-300">
          <span>Estimated highway tolls</span>
          <span className="font-mono">₹{formatCurrency(fare.tollEstimate)}</span>
        </div>
      )}

      <div className="flex justify-between gap-3 border-t border-slate-800 pt-2 text-xs text-slate-300">
        <span>Service subtotal</span>
        <span className="font-mono">₹{formatCurrency(fare.totalFare - fare.taxGst)}</span>
      </div>

      <div className="flex justify-between gap-3 text-xs text-slate-300">
        <span>GST & service taxes (5%)</span>
        <span className="font-mono">₹{formatCurrency(fare.taxGst)}</span>
      </div>

      {fare.discount > 0 && (
        <div className="flex justify-between gap-3 text-xs text-emerald-400">
          <span className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            AM to PM Welcome Privilege
          </span>
          <span className="font-mono">-₹{formatCurrency(fare.discount)}</span>
        </div>
      )}

      <div className="flex justify-between gap-3 border-t border-slate-800 pt-2 text-sm font-bold">
        <span className="text-slate-100">Total Net Fare</span>
        <span className="font-mono text-base text-amber-400">₹{formatCurrency(fare.finalPayable)}</span>
      </div>

      <p className="text-[10px] text-slate-500">
        Extra distance/time is charged only for actual usage beyond the booked package. Night allowance applies only when the trip overlaps 10 PM-6 AM.
      </p>
    </div>
  );
};
