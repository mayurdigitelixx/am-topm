import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import type { SavedAddress, VehicleCategory, TransmissionType } from '../types';
import { MapPin, ChevronRight, Check, X } from 'lucide-react';
import { apiService } from '../services/apiService';
import { INITIAL_LOCALITIES } from '../services/mockData';

const MUMBAI_LOCALITIES = INITIAL_LOCALITIES.filter((locality) => locality.cityId === 'c1');
const MUMBAI_AREA_SUGGESTIONS = MUMBAI_LOCALITIES
  .map((locality) => `${locality.name}, Mumbai - PIN ${locality.pincode}`);
const MAX_ROUTE_STOPS = 3;

const formatSavedAddress = (address: SavedAddress) =>
  [address.addressLine, address.locality, address.city, address.pincode ? `PIN ${address.pincode}` : '']
    .filter(Boolean)
    .join(', ');

export const ConfigureRideScreen: React.FC = () => {
  const {
    selectedRideType,
    pickupAddress,
    setPickupAddress,
    dropAddress,
    setDropAddress,
    stops,
    setStops,
    selectedCategory,
    setSelectedCategory,
    selectedTransmission,
    setSelectedTransmission,
    packageHours,
    setPackageHours,
    setPackageKm,
    isCustomerCar,
    setIsCustomerCar,
    selectedCarId,
    setSelectedCarId,
    updateEstimatedFare,
    navigateTo,
    showToast,
  } = useApp();

  const customerCars = apiService.getCustomerCars();
  const savedAddresses = apiService.getSavedAddresses();
  const selectedSavedAddressId = savedAddresses.find(
    (address) => formatSavedAddress(address) === pickupAddress
  )?.id ?? '';
  const selectedPickupAreaId = MUMBAI_LOCALITIES.find((locality) => pickupAddress.includes(locality.name))?.id ?? '';

  const categories: { id: VehicleCategory; name: string; subtitle: string; icon: string }[] = [
    { id: 'Hatchback', name: 'Hatchback', subtitle: 'WagonR, Swift, i10', icon: '🚗' },
    { id: 'Sedan', name: 'Sedan', subtitle: 'Dzire, City, Verna', icon: '🚘' },
    { id: 'SUV', name: 'SUV / MUV', subtitle: 'Creta, Innova, Scorpio', icon: '🚙' },
    { id: 'Luxury', name: 'Luxury / Premium', subtitle: 'Mercedes, BMW, Audi', icon: '🏎️' },
  ];

  const packages = [
    { hours: 4, km: 40, label: '4 Hrs / 40 Km', desc: 'Shopping & errands' },
    { hours: 8, km: 80, label: '8 Hrs / 80 Km', desc: 'Full day in-city meetings' },
    { hours: 12, km: 120, label: '12 Hrs / 120 Km', desc: 'Whole day & evening' },
  ];

  const handleProceedToPreview = () => {
    if (!pickupAddress.trim()) {
      showToast('Choose a saved pickup address or enter a new location.');
      return;
    }

    if ((selectedRideType === 'drop' || selectedRideType === 'outstation') && !dropAddress.trim()) {
      showToast('Enter a destination for this ride.');
      return;
    }

    if (stops.some((stop) => !stop.trim())) {
      showToast('Enter an address for each stop or remove the empty stop.');
      return;
    }

    updateEstimatedFare();
    navigateTo('preview_fare');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title={`Configure ${selectedRideType.toUpperCase()} Ride`} showBack onBack={() => navigateTo('dashboard')} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Route / Addresses */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pickup Point
            </label>
            <label
              htmlFor="saved-pickup-address"
              className="text-[10px] font-semibold text-slate-500 block mb-1"
            >
              Saved address or new location
            </label>
            <select
              id="saved-pickup-address"
              value={selectedSavedAddressId}
              onChange={(event) => {
                const address = savedAddresses.find((item) => item.id === event.target.value);
                setPickupAddress(address ? formatSavedAddress(address) : '');
              }}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2.5 rounded-xl text-xs text-slate-100 focus:outline-none mb-2"
            >
              <option value="">Enter a new pickup location</option>
              {savedAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.title} - {formatSavedAddress(address)}
                </option>
              ))}
            </select>
            <label
              htmlFor="pickup-area"
              className="text-[10px] font-semibold text-slate-500 block mb-1"
            >
              Mumbai area and PIN code
            </label>
            <select
              id="pickup-area"
              value={selectedPickupAreaId}
              onChange={(event) => {
                const locality = MUMBAI_LOCALITIES.find((item) => item.id === event.target.value);
                setPickupAddress(
                  locality ? `${locality.name}, Mumbai - PIN ${locality.pincode}` : ''
                );
              }}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2.5 rounded-xl text-xs text-slate-100 focus:outline-none mb-2"
            >
              <option value="">Select a Mumbai area and PIN code</option>
              {MUMBAI_LOCALITIES.map((locality) => (
                <option key={locality.id} value={locality.id}>
                  {locality.name} - PIN {locality.pincode}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                list="mumbai-area-suggestions"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter pickup address"
                className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {(selectedRideType === 'drop' || selectedRideType === 'outstation') && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Destination Point
              </label>
              <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  list="mumbai-area-suggestions"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                  placeholder="Enter drop destination"
                  className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          )}

          {(selectedRideType === 'drop' || selectedRideType === 'outstation') && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Route plan
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Choose a direct trip or add up to {MAX_ROUTE_STOPS} stops before the drop-off.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStops([])}
                  aria-pressed={stops.length === 0}
                  className={`rounded-xl border px-2 py-2.5 text-[10px] font-bold transition ${
                    stops.length === 0
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  Direct pickup and drop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stops.length === 0) setStops(['']);
                  }}
                  aria-pressed={stops.length > 0}
                  className={`rounded-xl border px-2 py-2.5 text-[10px] font-bold transition ${
                    stops.length > 0
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  Add route stops
                </button>
              </div>
              {stops.map((stop, index) => (
                <div key={`route-stop-${index}`} className="space-y-1">
                  <label
                    htmlFor={`route-stop-${index}`}
                    className="text-[10px] font-semibold text-slate-400"
                  >
                    Stop {index + 1}
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      id={`route-stop-${index}`}
                      type="text"
                      list="mumbai-area-suggestions"
                      value={stop}
                      onChange={(event) =>
                        setStops(stops.map((currentStop, stopIndex) =>
                          stopIndex === index ? event.target.value : currentStop
                        ))
                      }
                      placeholder="Enter stop location"
                      className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setStops(stops.filter((_, stopIndex) => stopIndex !== index))}
                      aria-label={`Remove stop ${index + 1}`}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {stops.length > 0 && stops.length < MAX_ROUTE_STOPS && (
                <button
                  type="button"
                  onClick={() => setStops([...stops, ''])}
                  className="w-full rounded-xl border border-dashed border-slate-700 px-3 py-2 text-[10px] font-bold text-amber-400"
                >
                  + Add another stop ({stops.length}/{MAX_ROUTE_STOPS})
                </button>
              )}
            </div>
          )}
          <datalist id="mumbai-area-suggestions">
            {MUMBAI_AREA_SUGGESTIONS.map((area) => (
              <option key={area} value={area} />
            ))}
          </datalist>
        </div>

        {/* Car Option: Customer Car vs Chauffeur + Vehicle */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Vehicle Arrangement
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsCustomerCar(true)}
              className={`p-3 rounded-xl border text-left transition ${
                isCustomerCar
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Driver For My Car</span>
                {isCustomerCar && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Chauffeur will drive your own vehicle</p>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomerCar(false)}
              className={`p-3 rounded-xl border text-left transition ${
                !isCustomerCar
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Cab + Driver</span>
                {!isCustomerCar && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Car provided by AM to PM partner fleet</p>
            </button>
          </div>
        </div>

        {/* If customer's own car, select from garage */}
        {isCustomerCar && (
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Select Car From Garage</span>
              <button
                type="button"
                onClick={() => navigateTo('garage')}
                className="text-[11px] text-amber-400 hover:underline"
              >
                + Add New Car
              </button>
            </div>

            <div className="space-y-2">
              {customerCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => {
                    setSelectedCarId(car.id);
                    setSelectedCategory(car.category);
                    setSelectedTransmission(car.transmission);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedCarId === car.id
                      ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🚗</span>
                    <div>
                      <div className="text-xs font-bold">
                        {car.brand} {car.model}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {car.registrationNumber} • {car.transmission}
                      </div>
                    </div>
                  </div>
                  {selectedCarId === car.id && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transmission & Category selection */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Car Category & Transmission
          </label>

          {/* Transmission Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-3">
            {(['Manual', 'Automatic'] as TransmissionType[]).map((trans) => (
              <button
                key={trans}
                type="button"
                onClick={() => setSelectedTransmission(trans)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedTransmission === trans
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {trans} Transmission
              </button>
            ))}
          </div>

          {/* Vehicle Categories */}
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{cat.icon}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="text-xs font-bold mt-2">{cat.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{cat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Packages (For local bookings) */}
        {selectedRideType === 'local' && (
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Hourly Package
            </label>
            <div className="grid grid-cols-3 gap-2">
              {packages.map((pkg) => (
                <div
                  key={pkg.hours}
                  onClick={() => {
                    setPackageHours(pkg.hours);
                    setPackageKm(pkg.km);
                  }}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                    packageHours === pkg.hours
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{pkg.hours} Hours</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{pkg.km} Km</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Base</span>
          <div className="text-lg font-bold text-amber-400">
            ₹{selectedRideType === 'outstation' ? '1,499' : selectedRideType === 'drop' ? '399' : '499'}
          </div>
        </div>

        <button
          onClick={handleProceedToPreview}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition"
        >
          <span>Review Fare</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
