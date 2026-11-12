export type RideType = 'local' | 'outstation' | 'drop' | 'monthly';

export type VehicleCategory = 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury';
export type TransmissionType = 'Manual' | 'Automatic';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';

export type TripStatus = 
  | 'idle'
  | 'configuring'
  | 'preview'
  | 'searching'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'on_trip'
  | 'payment_pending'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'razorpay' | 'upi' | 'cash';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  token?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CustomerCar {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuelType: FuelType;
  isDefault: boolean;
}

export interface City {
  id: string;
  name: string;
  state: string;
  isOperational: boolean;
}

export interface Locality {
  id: string;
  cityId: string;
  name: string;
  pincode: string;
}

export interface SavedAddress {
  id: string;
  title: string; // 'Home' | 'Office' | 'Gym' | 'Custom'
  addressLine: string;
  locality: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface FareBreakdown {
  baseFare: number;
  perKmRate: number;
  perHourRate: number;
  estimatedKm: number;
  estimatedHours: number;
  nightAllowance: number;
  tollEstimate: number;
  taxGst: number;
  totalFare: number;
  discount: number;
  finalPayable: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  rating: number;
  totalTrips: number;
  assignedCar?: string;
  experienceYears: number;
  verificationBadge: boolean;
}

export interface Booking {
  id: string;
  rideType: RideType;
  city: string;
  pickupAddress: string;
  dropAddress?: string;
  scheduledTime: string;
  packageHours?: number;
  packageKm?: number;
  vehicleCategory: VehicleCategory;
  transmission: TransmissionType;
  isCustomerCar: boolean;
  customerCarId?: string;
  fare: FareBreakdown;
  status: TripStatus;
  startOtp: string;
  endOtp: string;
  driver?: Driver;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Trip Issue' | 'Billing & Refund' | 'Driver Conduct' | 'App Feedback';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}
