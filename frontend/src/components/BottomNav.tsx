import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CalendarClock, Car, UserCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, activeBooking } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Book Chauffeur', icon: Home },
    { id: 'rides', label: 'My Trips', icon: CalendarClock, badge: activeBooking ? 'Active' : undefined },
    { id: 'garage', label: 'My Cars', icon: Car },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 flex justify-around items-center shrink-0 z-30">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || (item.id === 'rides' && currentScreen === 'active_trip');
        
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id as any)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative ${
              isActive ? 'text-amber-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
