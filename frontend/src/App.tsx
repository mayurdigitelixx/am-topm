import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { OtpScreen } from './screens/OtpScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ConfigureRideScreen } from './screens/ConfigureRideScreen';
import { FarePreviewScreen } from './screens/FarePreviewScreen';
import { ActiveTripScreen } from './screens/ActiveTripScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { RidesHistoryScreen } from './screens/RidesHistoryScreen';
import { GarageScreen } from './screens/GarageScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SupportScreen } from './screens/SupportScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <LoginScreen />;
    case 'otp':
      return <OtpScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'configure_ride':
      return <ConfigureRideScreen />;
    case 'preview_fare':
      return <FarePreviewScreen />;
    case 'active_trip':
      return <ActiveTripScreen />;
    case 'payment':
      return <PaymentScreen />;
    case 'rides':
      return <RidesHistoryScreen />;
    case 'garage':
      return <GarageScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'support':
      return <SupportScreen />;
    default:
      return <DashboardScreen />;
  }
};

export function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <ScreenRouter />
      </MobileFrame>
    </AppProvider>
  );
}

export default App;
