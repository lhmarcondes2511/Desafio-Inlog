import axios from 'axios';
import { Vehicle } from '../types/Vehicle';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? (process.env.NODE_ENV === 'development' ? '' : '/api');

const http = axios.create({ baseURL: API_BASE_URL });

export const vehicleApi = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const res = await http.get('/Veiculo/Listar');
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.lista ?? []);
    return list as Vehicle[];
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const res = await http.get(`/vehicles/${id}`);
    return (res.data?.vehicle ?? res.data) as Vehicle;
  },

  createVehicle: async (vehicle: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle> => {
    const res = await http.post('/Veiculo/Cadastrar', vehicle);
    return (res.data?.vehicle ?? res.data?.data ?? res.data) as Vehicle;
  },

  updateVehicle: async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await http.put(`/vehicles/${id}`, vehicle);
    return (res.data?.vehicle ?? res.data) as Vehicle;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await http.delete(`/vehicles/${id}`);
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Geolocation is not supported by this browser.'));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
    (error) => reject(new Error(`Geolocation error: ${error.message}`)),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
});