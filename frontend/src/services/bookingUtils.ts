import type { Booking } from '../types';

export const IMMEDIATE_BOOKING_LABEL = 'Immediate (Within 15 mins)';
const CANCELLATION_CUTOFF_MS = 6 * 60 * 60 * 1000;

export const getScheduledPickupDate = (scheduledTime: string): Date | null => {
  if (scheduledTime === IMMEDIATE_BOOKING_LABEL) return null;

  const date = new Date(scheduledTime);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatScheduledPickup = (scheduledTime: string): string => {
  const date = getScheduledPickupDate(scheduledTime);
  return date ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : scheduledTime;
};

export const isBookingCancellable = (booking: Booking, now = Date.now()): boolean => {
  if (booking.status !== 'driver_assigned') return false;

  const pickupDate = getScheduledPickupDate(booking.scheduledTime);
  return pickupDate !== null && pickupDate.getTime() - now > CANCELLATION_CUTOFF_MS;
};
