import { API_CONFIG } from '../config/api.config';
import type { Booking, CustomerCar, FareBreakdown, RideType, SavedAddress, SupportTicket, User, VehicleCategory } from '../types';
import { INITIAL_CUSTOMER_CARS, INITIAL_LOCALITIES, INITIAL_SAVED_ADDRESSES, MOCK_DRIVERS } from './mockData';

// Local Storage Keys
const STORAGE_USER_KEY = 'am_to_pm_user_session';
const STORAGE_BOOKINGS_KEY = 'am_to_pm_bookings';
const STORAGE_CARS_KEY = 'am_to_pm_customer_cars';
const STORAGE_ADDRESSES_KEY = 'am_to_pm_saved_addresses';
const STORAGE_TICKETS_KEY = 'am_to_pm_tickets';

// Simulated delay helper
const delay = (ms: number = 600) => new Promise(res => setTimeout(res, ms));

export const apiService = {
  // =========================================================================
  // AUTHENTICATION APIs
  // Real Endpoint Mapping:
  // - POST /api/customer/login
  // - POST /api/customer/otp
  // - POST /api/customer/register
  // =========================================================================
  async requestOtp(phone: string): Promise<{ success: boolean; message: string; mockOtp: string }> {
    if (API_CONFIG.useMockBackend) {
      await delay(500);
      const generatedOtp = '1234';
      return {
        success: true,
        message: `OTP sent to your WhatsApp number ${phone}`,
        mockOtp: generatedOtp,
      };
    }

    // [LIVE BACKEND INTEGRATION]
    const response = await fetch(`${API_CONFIG.server.baseUrl}${API_CONFIG.server.endpoints.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return response.json();
  },

  async verifyOtp(phone: string, otp: string, userName?: string): Promise<{ success: boolean; user: User; token: string }> {
    if (API_CONFIG.useMockBackend) {
      await delay(600);
      if (otp !== '1234' && otp.length !== 4) {
        throw new Error('Invalid OTP. Please enter 1234 for testing.');
      }

      const user: User = {
        id: 'usr_' + Date.now().toString(36),
        name: userName || (phone === '9820144829' ? 'Mayur Sharma' : 'Chauffeur Guest'),
        phone: phone,
        email: 'guest@amtopm.example.com',
        token: 'am2pm_jwt_secure_token_' + Math.random().toString(36).substring(2),
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      return { success: true, user, token: user.token! };
    }

    // [LIVE BACKEND INTEGRATION]
    const response = await fetch(`${API_CONFIG.server.baseUrl}${API_CONFIG.server.endpoints.otpVerify}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name: userName }),
    });
    return response.json();
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_USER_KEY);
  },

  // =========================================================================
  // PRICING & FARE CALCULATION ENGINE
  // Real Endpoint Mapping:
  // - POST /api/cities-wise-local-price
  // - POST /api/cities-wise-outstation-price
  // - POST /api/cities-wise-drop-price
  // - POST /api/customer/booking/price-preview
  // =========================================================================
  calculateFare(
    rideType: RideType,
    category: VehicleCategory,
    packageHours: number = 4,
    packageKm: number = 40,
    tripStartTime: Date = new Date(),
    actualHours: number = packageHours,
    actualDistanceKm: number = packageKm
  ): FareBreakdown {
    // Dynamic rate card
    let baseRate = 499;
    let perKm = 14;
    let perHour = 120;

    switch (category) {
      case 'Sedan':
        baseRate = 599;
        perKm = 16;
        perHour = 140;
        break;
      case 'SUV':
        baseRate = 799;
        perKm = 20;
        perHour = 180;
        break;
      case 'Luxury':
        baseRate = 1499;
        perKm = 35;
        perHour = 350;
        break;
      default:
        baseRate = 499;
        perKm = 14;
        perHour = 120;
    }

    // Adjust for Ride Mode
    if (rideType === 'outstation') {
      baseRate += 500; // Outstation driver allowance
      perKm += 4;
    } else if (rideType === 'drop') {
      baseRate = Math.round(baseRate * 0.85); // Flat one-way drop discount
    }

    const baseFare = baseRate;
    const extraDistanceKm = Math.round(Math.max(0, actualDistanceKm - packageKm) * 100) / 100;
    const extraHours = Math.round(Math.max(0, actualHours - packageHours) * 100) / 100;
    const distanceCharge = Math.round(extraDistanceKm * perKm * 100) / 100;
    const timeCharge = Math.round(extraHours * perHour * 100) / 100;
    const nightAllowance = this.tripOverlapsNightWindow(tripStartTime, actualHours) ? 250 : 0;
    const tollEstimate = rideType === 'outstation' ? 180 : 0;
    
    const subtotal = baseFare + distanceCharge + timeCharge + nightAllowance + tollEstimate;
    const taxGst = Math.round(subtotal * 0.05); // 5% GST
    const discount = 50; // Welcome promotional discount
    const totalFare = Math.round((subtotal + taxGst) * 100) / 100;
    const finalPayable = Math.round((subtotal + taxGst - discount) * 100) / 100;

    return {
      baseFare,
      perKmRate: perKm,
      perHourRate: perHour,
      estimatedKm: packageKm,
      estimatedHours: packageHours,
      extraDistanceKm,
      extraHours,
      distanceCharge,
      timeCharge,
      nightAllowance,
      tollEstimate,
      taxGst,
      totalFare,
      discount,
      finalPayable: Math.max(100, finalPayable),
    };
  },

  tripOverlapsNightWindow(tripStartTime: Date, durationHours: number): boolean {
    const tripStartMs = tripStartTime.getTime();
    if (!Number.isFinite(tripStartMs) || durationHours <= 0) return false;

    const tripEndMs = tripStartMs + durationHours * 60 * 60 * 1000;
    const nightStart = new Date(tripStartTime);
    nightStart.setDate(nightStart.getDate() - 1);
    nightStart.setHours(22, 0, 0, 0);

    while (nightStart.getTime() < tripEndMs) {
      const nightEnd = new Date(nightStart);
      nightEnd.setDate(nightEnd.getDate() + 1);
      nightEnd.setHours(6, 0, 0, 0);

      if (tripStartMs < nightEnd.getTime() && tripEndMs > nightStart.getTime()) return true;

      nightStart.setDate(nightStart.getDate() + 1);
      nightStart.setHours(22, 0, 0, 0);
    }

    return false;
  },

  // =========================================================================
  // BOOKINGS & TRIP LIFECYCLE
  // Real Endpoint Mapping:
  // - POST /api/customer/booking/save
  // - GET  /api/customer/booking/lists
  // - POST /api/customer/drive-start-otp
  // - POST /api/customer/drive-end-otp
  // =========================================================================
  async createBooking(bookingData: Omit<Booking, 'id' | 'startOtp' | 'endOtp' | 'status' | 'paymentStatus' | 'createdAt'>): Promise<Booking> {
    await delay(700);

    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const assignedDriver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];

    const newBooking: Booking = {
      ...bookingData,
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      status: 'driver_assigned',
      startOtp,
      endOtp,
      driver: assignedDriver,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    const existing = this.getLocalBookings();
    existing.unshift(newBooking);
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(existing));

    return newBooking;
  },

  getLocalBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  updateBookingStatus(bookingId: string, status: Booking['status'], paymentStatus?: Booking['paymentStatus'], transactionId?: string): Booking | null {
    const bookings = this.getLocalBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;

    bookings[idx].status = status;
    if (status === 'on_trip' && !bookings[idx].startedAt) {
      bookings[idx].startedAt = new Date().toISOString();
    }
    if (paymentStatus) bookings[idx].paymentStatus = paymentStatus;
    if (transactionId) bookings[idx].transactionId = transactionId;

    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings[idx];
  },

  recordTripUsage(bookingId: string, actualDistanceKm: number, actualDurationHours: number): Booking | null {
    if (
      !Number.isFinite(actualDistanceKm) ||
      actualDistanceKm < 0 ||
      !Number.isFinite(actualDurationHours) ||
      actualDurationHours <= 0
    ) {
      throw new Error('Enter valid actual trip distance and duration.');
    }

    const bookings = this.getLocalBookings();
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || booking.status !== 'on_trip') return null;

    const packageHours = booking.packageHours ?? booking.fare.estimatedHours;
    const packageKm = booking.packageKm ?? booking.fare.estimatedKm;
    const startedAt = booking.startedAt ? new Date(booking.startedAt) : new Date();
    booking.actualDistanceKm = actualDistanceKm;
    booking.actualDurationHours = actualDurationHours;
    booking.fare = this.calculateFare(
      booking.rideType,
      booking.vehicleCategory,
      packageHours,
      packageKm,
      startedAt,
      actualDurationHours,
      actualDistanceKm
    );
    booking.status = 'payment_pending';
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    return booking;
  },

  // =========================================================================
  // PAYMENT INTEGRATION (RAZORPAY)
  // Real Endpoint Mapping:
  // - GET  /api/check-setting (fetches keyId)
  // - POST /api/customer/payment-details-save
  // =========================================================================
  async processPayment(
    bookingId: string,
    _amount: number,
    _method: 'razorpay' | 'upi' | 'cash'
  ): Promise<{ success: boolean; transactionId: string; receiptUrl: string }> {
    await delay(1200);

    const transactionId = 'pay_' + Math.random().toString(36).substring(2, 14).toUpperCase();
    this.updateBookingStatus(bookingId, 'completed', 'success', transactionId);

    return {
      success: true,
      transactionId,
      receiptUrl: `#receipt-${transactionId}`,
    };
  },

  getSavedAddresses(): SavedAddress[] {
    const raw = localStorage.getItem(STORAGE_ADDRESSES_KEY);
    const addresses: SavedAddress[] = raw ? JSON.parse(raw) : INITIAL_SAVED_ADDRESSES;

    return addresses.map((address) => ({
      ...address,
      pincode: address.pincode || INITIAL_LOCALITIES.find(
        (locality) => locality.cityId === 'c1' && locality.name === address.locality
      )?.pincode || '',
    }));
  },

  saveSavedAddress(address: SavedAddress): SavedAddress {
    const addresses = this.getSavedAddresses();
    const existingIndex = addresses.findIndex((savedAddress) => savedAddress.id === address.id);

    if (existingIndex === -1) {
      addresses.push(address);
    } else {
      addresses[existingIndex] = address;
    }

    localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(addresses));
    return address;
  },

  // =========================================================================
  // GARAGE (CUSTOMER SAVED CARS)
  // Real Endpoint Mapping:
  // - GET  /api/customer/car-list
  // - POST /api/customer/car/save
  // =========================================================================
  getCustomerCars(): CustomerCar[] {
    const raw = localStorage.getItem(STORAGE_CARS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CARS_KEY, JSON.stringify(INITIAL_CUSTOMER_CARS));
      return INITIAL_CUSTOMER_CARS;
    }
    return JSON.parse(raw);
  },

  saveCustomerCar(car: Omit<CustomerCar, 'id'>): CustomerCar {
    const cars = this.getCustomerCars();
    const newCar: CustomerCar = {
      ...car,
      id: 'car_' + Date.now().toString(36),
    };
    cars.push(newCar);
    localStorage.setItem(STORAGE_CARS_KEY, JSON.stringify(cars));
    return newCar;
  },

  // =========================================================================
  // SUPPORT TICKETS
  // Real Endpoint Mapping:
  // - GET  /api/customer/ticket/list
  // - POST /api/customer/ticket/save
  // =========================================================================
  getTickets(): SupportTicket[] {
    const raw = localStorage.getItem(STORAGE_TICKETS_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'TCK-1082',
        subject: 'Night driving surcharge inquiry',
        category: 'Billing & Refund',
        description: 'Wanted clarification on night charges applicable between 10 PM and 6 AM.',
        status: 'Resolved',
        createdAt: '2026-11-01T14:20:00Z',
      }
    ];
  },

  createTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): SupportTicket {
    const tickets = this.getTickets();
    const newTicket: SupportTicket = {
      ...ticket,
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    tickets.unshift(newTicket);
    localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  }
};
