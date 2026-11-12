/**
 * ======================================================================================
 * AM to PM — Central Configuration & External Credentials Directory
 * ======================================================================================
 * 
 * This file centralizes all External APIs, Base URLs, and Secret Keys.
 * For local prototype testing, `USE_MOCK_BACKEND` is set to `true` by default so that
 * all booking, OTP verification, pricing, and payments work instantly without credentials.
 * 
 * When deploying to staging or production:
 * 1. Set `USE_MOCK_BACKEND` to `false`.
 * 2. Fill in the corresponding environment variables in your `.env` file or directly below.
 * ======================================================================================
 */

export interface ApiConfig {
  useMockBackend: boolean;
  server: {
    baseUrl: string;
    timeoutMs: number;
    endpoints: {
      versionCheck: string;
      login: string;
      otpVerify: string;
      register: string;
      forgotPassword: string;
      changePassword: string;
      profileUpdate: string;
      addressList: string;
      saveAddress: string;
      cities: string;
      localities: string;
      carCategories: string;
      carTypes: string;
      carTransmissions: string;
      carFuelTypes: string;
      customerCarList: string;
      customerCarSave: string;
      cityWisePriceLocal: string;
      cityWisePriceOutstation: string;
      cityWisePriceDrop: string;
      pricePreview: string;
      bookTrip: string;
      bookingList: string;
      bookingDetails: string;
      cancelBooking: string;
      startTripOtp: string;
      endTripOtp: string;
      feedback: string;
      deviceIdSave: string;
      razorpayCheckSetting: string;
      razorpayPaymentSave: string;
      monthlyContract: string;
      ticketsList: string;
      ticketSave: string;
    };
  };
  keys: {
    // ==========================================
    // 1. PAYMENT GATEWAY: RAZORPAY
    // Obtain from: https://dashboard.razorpay.com/#/app/keys
    // ==========================================
    razorpay: {
      keyId: string;       // Public Key ID (e.g., rzp_test_xxxxxxxxxx or rzp_live_xxxxxxxxxx)
      keySecret: string;   // Secret Key (Keep on backend in production)
      merchantName: string;
      currency: string;
    };

    // ==========================================
    // 2. MAPS & GEOLOCATION: GOOGLE MAPS
    // Obtain from: https://console.cloud.google.com/google/maps-apis
    // Required APIs: Places API, Geocoding API, Directions API
    // ==========================================
    googleMaps: {
      apiKey: string;      // Google Maps Browser/Client API Key
    };

    // ==========================================
    // 3. OTP & MESSAGING: WHATSAPP / SMS GATEWAY
    // Option A: WhatsApp Business Cloud API (https://developers.facebook.com)
    // Option B: Twilio / MSG91 / Fast2SMS
    // ==========================================
    messaging: {
      provider: 'whatsapp_cloud_api' | 'twilio' | 'msg91' | 'mock';
      whatsappCloudApiToken: string;   // Permanent System User Access Token
      whatsappPhoneNumberId: string;   // WhatsApp Sender Phone Number ID
      twilioAccountSid: string;
      twilioAuthToken: string;
      twilioFromNumber: string;
    };

    // ==========================================
    // 4. PUSH NOTIFICATIONS: FIREBASE (FCM)
    // Obtain from: Firebase Console -> Project Settings -> Cloud Messaging / Web Config
    // ==========================================
    firebase: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      vapidKey: string;     // Web Push Certificate Key (Key pair)
    };
  };
}

export const API_CONFIG: ApiConfig = {
  // TOGGLE TO TRUE FOR INSTANT OFFLINE PROTOTYPE TESTING
  useMockBackend: import.meta.env.VITE_USE_MOCK_BACKEND !== 'false',

  server: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.amtopm.example.com',
    timeoutMs: 15000,
    endpoints: {
      versionCheck: '/api/version-check',
      login: '/api/customer/login',
      otpVerify: '/api/customer/otp',
      register: '/api/customer/register',
      forgotPassword: '/api/customer/forgot-password-update',
      changePassword: '/api/customer/change-password',
      profileUpdate: '/api/customer/update-profile',
      addressList: '/api/customer/address-list',
      saveAddress: '/api/customer/address/save',
      cities: '/api/cities',
      localities: '/api/customer/localities',
      carCategories: '/api/car-categories',
      carTypes: '/api/car-types',
      carTransmissions: '/api/car-transmissions',
      carFuelTypes: '/api/car-fuel_types',
      customerCarList: '/api/customer/car-list',
      customerCarSave: '/api/customer/car/save',
      cityWisePriceLocal: '/api/cities-wise-local-price',
      cityWisePriceOutstation: '/api/cities-wise-outstation-price',
      cityWisePriceDrop: '/api/cities-wise-drop-price',
      pricePreview: '/api/customer/booking/price-preview',
      bookTrip: '/api/customer/booking/save',
      bookingList: '/api/customer/booking/lists',
      bookingDetails: '/api/driver/booking-details',
      cancelBooking: '/api/customer/booking/cancel',
      startTripOtp: '/api/customer/drive-start-otp',
      endTripOtp: '/api/customer/drive-end-otp',
      feedback: '/api/customer/feedback',
      deviceIdSave: '/api/customer/device-id-save',
      razorpayCheckSetting: '/api/check-setting',
      razorpayPaymentSave: '/api/customer/payment-details-save',
      monthlyContract: '/api/contractual-enquiry',
      ticketsList: '/api/customer/ticket/list',
      ticketSave: '/api/customer/ticket/save',
    },
  },

  keys: {
    // 1. RAZORPAY PAYMENT GATEWAY
    // Replace with your Razorpay test or live keys when ready
    razorpay: {
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_AMtoPMDemoKey001',
      keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
      merchantName: 'AM to PM Mobility Services',
      currency: 'INR',
    },

    // 2. GOOGLE MAPS API
    // Replace with your Google Cloud Maps API key
    googleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
    },

    // 3. WHATSAPP / SMS OTP GATEWAY
    // Replace with your Meta WhatsApp or Twilio credentials
    messaging: {
      provider: (import.meta.env.VITE_MESSAGING_PROVIDER as any) || 'mock',
      whatsappCloudApiToken: import.meta.env.VITE_WHATSAPP_TOKEN || 'YOUR_WHATSAPP_CLOUD_API_TOKEN',
      whatsappPhoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_ID || 'YOUR_WHATSAPP_PHONE_NUMBER_ID',
      twilioAccountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID',
      twilioAuthToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN',
      twilioFromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '+1234567890',
    },

    // 4. FIREBASE CLOUD MESSAGING (PUSH NOTIFICATIONS)
    // Replace with your Firebase Web App configuration
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAMtoPMDemoKeyPlaceholder',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'am-to-pm-mobility.firebaseapp.com',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'am-to-pm-mobility',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'am-to-pm-mobility.appspot.com',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '219374029986',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:219374029986:web:77bf90cc22a1e8b5cc5bfb',
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'YOUR_FIREBASE_VAPID_KEY',
    },
  },
};
