import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { apiService } from '../services/apiService';
import type { CustomerCar, VehicleCategory, TransmissionType, FuelType } from '../types';
import { Plus, CheckCircle2 } from 'lucide-react';

export const GarageScreen: React.FC = () => {
  const { showToast } = useApp();
  const [cars, setCars] = useState<CustomerCar[]>(apiService.getCustomerCars());
  const [showAddForm, setShowAddForm] = useState(false);

  // New Car Form State
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('Sedan');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [fuelType] = useState<FuelType>('Petrol');

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !regNumber) {
      showToast('Please fill all car details');
      return;
    }

    apiService.saveCustomerCar({
      brand,
      model,
      registrationNumber: regNumber.toUpperCase(),
      category,
      transmission,
      fuelType,
      isDefault: cars.length === 0,
    });

    setCars(apiService.getCustomerCars());
    setShowAddForm(false);
    setBrand('');
    setModel('');
    setRegNumber('');
    showToast(`${brand} ${model} saved to garage!`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100">
      <TopBar title="My Garage" />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Registered Vehicles</h2>
            <p className="text-xs text-slate-400">AM to PM verified chauffeurs will drive your saved vehicles</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold flex items-center gap-1 text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Car</span>
          </button>
        </div>

        {/* Add Car Modal / Expansion */}
        {showAddForm && (
          <form onSubmit={handleAddCar} className="p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3 animate-fade-in shadow-xl">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Add Vehicle to Garage
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Make / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Honda, Hyundai"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. City, Creta"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Registration / Number Plate</label>
              <input
                type="text"
                placeholder="e.g. MH 02 AB 1234"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono tracking-wider focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Body Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV / MUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        )}

        {/* Saved Cars List */}
        <div className="space-y-2.5">
          {cars.map((car) => (
            <div
              key={car.id}
              className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                  🚗
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      {car.brand} {car.model}
                    </span>
                    {car.isDefault && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {car.registrationNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {car.category} • {car.transmission} • {car.fuelType}
                  </div>
                </div>
              </div>

              <div className="text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
