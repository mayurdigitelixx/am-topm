import type { City, CustomerCar, Driver, Locality, SavedAddress } from '../types';

export const INITIAL_CITIES: City[] = [
  { id: 'c1', name: 'Mumbai', state: 'Maharashtra', isOperational: true },
  { id: 'c2', name: 'Pune', state: 'Maharashtra', isOperational: true },
  { id: 'c3', name: 'Delhi NCR', state: 'Delhi', isOperational: true },
  { id: 'c4', name: 'Bengaluru', state: 'Karnataka', isOperational: true },
  { id: 'c5', name: 'Hyderabad', state: 'Telangana', isOperational: true },
  { id: 'c6', name: 'Ahmedabad', state: 'Gujarat', isOperational: true },
];

export const INITIAL_LOCALITIES: Locality[] = [
  { id: 'l1', cityId: 'c1', name: 'Bandra West', pincode: '400050' },
  { id: 'l2', cityId: 'c1', name: 'Andheri East', pincode: '400069' },
  { id: 'l3', cityId: 'c1', name: 'South Mumbai (Colaba)', pincode: '400005' },
  { id: 'l4', cityId: 'c1', name: 'Powai Hiranandani', pincode: '400076' },
  { id: 'l9', cityId: 'c1', name: 'Bandra Kurla Complex', pincode: '400051' },
  { id: 'l10', cityId: 'c1', name: 'Andheri West', pincode: '400053' },
  { id: 'l11', cityId: 'c1', name: 'Juhu', pincode: '400049' },
  { id: 'l12', cityId: 'c1', name: 'Santacruz West', pincode: '400054' },
  { id: 'l13', cityId: 'c1', name: 'Vile Parle East', pincode: '400057' },
  { id: 'l14', cityId: 'c1', name: 'Goregaon East', pincode: '400063' },
  { id: 'l15', cityId: 'c1', name: 'Malad West', pincode: '400064' },
  { id: 'l16', cityId: 'c1', name: 'Kandivali West', pincode: '400067' },
  { id: 'l17', cityId: 'c1', name: 'Borivali West', pincode: '400092' },
  { id: 'l18', cityId: 'c1', name: 'Dadar West', pincode: '400028' },
  { id: 'l19', cityId: 'c1', name: 'Lower Parel', pincode: '400013' },
  { id: 'l20', cityId: 'c1', name: 'Worli', pincode: '400018' },
  { id: 'l21', cityId: 'c1', name: 'Chembur', pincode: '400071' },
  { id: 'l22', cityId: 'c1', name: 'Ghatkopar East', pincode: '400077' },
  { id: 'l23', cityId: 'c1', name: 'Kurla West', pincode: '400070' },
  { id: 'l24', cityId: 'c1', name: 'Mulund West', pincode: '400080' },
  { id: 'l25', cityId: 'c1', name: 'Vikhroli East', pincode: '400083' },
  { id: 'l26', cityId: 'c1', name: 'Mahim', pincode: '400016' },
  { id: 'l5', cityId: 'c2', name: 'Koregaon Park', pincode: '411001' },
  { id: 'l6', cityId: 'c2', name: 'Hinjewadi Phase 1', pincode: '411057' },
  { id: 'l7', cityId: 'c3', name: 'Cyber Hub, Gurugram', pincode: '122002' },
  { id: 'l8', cityId: 'c4', name: 'Indiranagar 100ft Rd', pincode: '560038' },
];

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'a1',
    title: 'Home',
    addressLine: 'A-402, Sunset Heights, Pali Hill',
    locality: 'Bandra West',
    city: 'Mumbai',
    latitude: 19.0607,
    longitude: 72.8362,
    isDefault: true,
  },
  {
    id: 'a2',
    title: 'Office',
    addressLine: 'Tower 3, Level 14, One BKC, G Block',
    locality: 'Bandra Kurla Complex',
    city: 'Mumbai',
    latitude: 19.0664,
    longitude: 72.8687,
    isDefault: false,
  },
];

export const INITIAL_CUSTOMER_CARS: CustomerCar[] = [
  {
    id: 'car1',
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    registrationNumber: 'MH 02 FJ 4821',
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    isDefault: true,
  },
  {
    id: 'car2',
    brand: 'Honda',
    model: 'City ZX',
    registrationNumber: 'MH 01 DX 1042',
    category: 'Sedan',
    transmission: 'Manual',
    fuelType: 'Petrol',
    isDefault: false,
  },
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'd1',
    name: 'Rajesh Sharma',
    phone: '+91 98201 44829',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    totalTrips: 1840,
    assignedCar: 'Hyundai Creta / Chauffeur-Only',
    experienceYears: 7,
    verificationBadge: true,
  },
  {
    id: 'd2',
    name: 'Vikram Singh Jadhav',
    phone: '+91 97654 32189',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalTrips: 1210,
    assignedCar: 'Honda City / Chauffeur-Only',
    experienceYears: 5,
    verificationBadge: true,
  },
];
