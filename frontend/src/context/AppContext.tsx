import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Booking, FareBreakdown, RideType, TransmissionType, User, VehicleCategory } from '../types';
import { apiService } from '../services/apiService';

export type ScreenType = 
  | 'splash'
  | 'login'
  | 'otp'
  | 'dashboard'
  | 'configure_ride'
  | 'preview_fare'
  | 'active_trip'
  | 'payment'
  | 'rides'
  | 'garage'
  | 'profile'
  | 'support';

interface AppContextType {
  user: User | null;
  currentScreen: ScreenType;
  isMobileFrame: boolean;
  toastMessage: string | null;
  // Booking Configuration State
  selectedRideType: RideType;
  selectedCity: string;
  pickupAddress: string;
  dropAddress: string;
  stops: string[];
  selectedCategory: VehicleCategory;
  selectedTransmission: TransmissionType;
  packageHours: number;
  packageKm: number;
  isCustomerCar: boolean;
  selectedCarId: string | null;
  estimatedFare: FareBreakdown | null;
  activeBooking: Booking | null;
  // Actions
  setUser: (user: User | null) => void;
  navigateTo: (screen: ScreenType) => void;
  toggleMobileFrame: () => void;
  showToast: (msg: string) => void;
  setSelectedRideType: (type: RideType) => void;
  setSelectedCity: (city: string) => void;
  setPickupAddress: (addr: string) => void;
  setDropAddress: (addr: string) => void;
  setStops: (stops: string[]) => void;
  setSelectedCategory: (cat: VehicleCategory) => void;
  setSelectedTransmission: (trans: TransmissionType) => void;
  setPackageHours: (hrs: number) => void;
  setPackageKm: (km: number) => void;
  setIsCustomerCar: (val: boolean) => void;
  setSelectedCarId: (id: string | null) => void;
  updateEstimatedFare: () => void;
  startBookingFlow: (type: RideType) => void;
  confirmBooking: () => Promise<Booking>;
  setActiveBooking: (booking: Booking | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Booking Builder
  const [selectedRideType, setSelectedRideType] = useState<RideType>('local');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [pickupAddress, setPickupAddress] = useState<string>(
    'A-402, Sunset Heights, Pali Hill, Bandra West, Mumbai, PIN 400050'
  );
  const [dropAddress, setDropAddress] = useState<string>('Chhatrapati Shivaji International Airport T2');
  const [stops, setStops] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('Sedan');
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType>('Automatic');
  const [packageHours, setPackageHours] = useState<number>(4);
  const [packageKm, setPackageKm] = useState<number>(40);
  const [isCustomerCar, setIsCustomerCar] = useState<boolean>(true);
  const [selectedCarId, setSelectedCarId] = useState<string | null>('car1');
  const [estimatedFare, setEstimatedFare] = useState<FareBreakdown | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Initialize Session
  useEffect(() => {
    const existing = apiService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
    
    // Check if there is an active ongoing booking
    const bookings = apiService.getLocalBookings();
    const active = bookings.find(b => b.status === 'driver_assigned' || b.status === 'on_trip' || b.status === 'payment_pending');
    if (active) {
      setActiveBooking(active);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileFrame = () => {
    setIsMobileFrame(prev => !prev);
  };

  const updateEstimatedFare = () => {
    const isNight = new Date().getHours() >= 22 || new Date().getHours() < 6;
    const fare = apiService.calculateFare(
      selectedRideType,
      selectedCategory,
      packageHours,
      packageKm,
      isNight
    );
    setEstimatedFare(fare);
  };

  const startBookingFlow = (type: RideType) => {
    setSelectedRideType(type);
    setStops([]);
    if (type === 'drop') {
      setPackageHours(2);
      setPackageKm(25);
    } else if (type === 'outstation') {
      setPackageHours(12);
      setPackageKm(150);
    } else {
      setPackageHours(4);
      setPackageKm(40);
    }
    updateEstimatedFare();
    navigateTo('configure_ride');
  };

  const confirmBooking = async (): Promise<Booking> => {
    if (!estimatedFare) {
      updateEstimatedFare();
    }
    const fare = estimatedFare || apiService.calculateFare(selectedRideType, selectedCategory, packageHours, packageKm);

    const booking = await apiService.createBooking({
      rideType: selectedRideType,
      city: selectedCity,
      pickupAddress,
      dropAddress: selectedRideType === 'drop' || selectedRideType === 'outstation' ? dropAddress : undefined,
      stops: stops.length > 0 ? stops : undefined,
      scheduledTime: 'Immediate (Within 15 mins)',
      packageHours,
      packageKm,
      vehicleCategory: selectedCategory,
      transmission: selectedTransmission,
      isCustomerCar,
      customerCarId: isCustomerCar && selectedCarId ? selectedCarId : undefined,
      fare,
      paymentMethod: 'razorpay',
    });

    setActiveBooking(booking);
    showToast(`Driver Assigned! Start Trip OTP: ${booking.startOtp}`);
    navigateTo('active_trip');
    return booking;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setActiveBooking(null);
    navigateTo('login');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentScreen,
        isMobileFrame,
        toastMessage,
        selectedRideType,
        selectedCity,
        pickupAddress,
        dropAddress,
        stops,
        selectedCategory,
        selectedTransmission,
        packageHours,
        packageKm,
        isCustomerCar,
        selectedCarId,
        estimatedFare,
        activeBooking,
        setUser,
        navigateTo,
        toggleMobileFrame,
        showToast,
        setSelectedRideType,
        setSelectedCity,
        setPickupAddress,
        setDropAddress,
        setStops,
        setSelectedCategory,
        setSelectedTransmission,
        setPackageHours,
        setPackageKm,
        setIsCustomerCar,
        setSelectedCarId,
        updateEstimatedFare,
        startBookingFlow,
        confirmBooking,
        setActiveBooking,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
