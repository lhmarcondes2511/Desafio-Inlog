import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vehicle } from '../types/Vehicle';

interface VehicleContextState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface VehicleProviderProps {
  children: ReactNode;
}

const VehicleContext = createContext<VehicleContextState | undefined>(undefined);

export const useVehicles = (): VehicleContextState => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};

export const VehicleProvider: React.FC<VehicleProviderProps> = ({ children }) => {
  const [vehicles, setVehiclesState] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addVehicle = (vehicle: Vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: vehicle.id || Date.now().toString(),
      created_at: vehicle.created_at || new Date().toISOString()
    };
    setVehiclesState(prev => [...prev, newVehicle]);
  };

  const updateVehicle = (id: string, updatedVehicle: Partial<Vehicle>) => {
    setVehiclesState(prev => 
      prev.map(vehicle => 
        vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
      )
    );
  };

  const deleteVehicle = (id: string) => {
    setVehiclesState(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  const setVehicles = (newVehicles: Vehicle[]) => {
    setVehiclesState(newVehicles);
  };

  const clearError = () => {
    setError(null);
  };

  const value: VehicleContextState = {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setVehicles,
    setLoading,
    setError,
    clearError
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};


