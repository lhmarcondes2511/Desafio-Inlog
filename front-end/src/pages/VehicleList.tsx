import React, { useEffect, useState } from 'react';
import { useVehicles } from '../contexts/VehicleContext';
import { vehicleApi, calculateDistance, getUserLocation } from '../services/api';
import { Vehicle } from '../types/Vehicle';
import VehicleMap from '../components/VehicleMap';
import InlineMap from '../components/InlineMap';

const VehicleList: React.FC = () => {
  const { vehicles, setVehicles, loading, setLoading, error, setError } = useVehicles();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [sortedVehicles, setSortedVehicles] = useState<Vehicle[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadVehicles();
    getUserCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation && vehicles.length > 0) {
      sortVehiclesByDistance();
    }
  }, [userLocation, vehicles]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const vehiclesData = await vehicleApi.getVehicles();
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const getUserCurrentLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);
    } catch (err) {
      console.warn('Could not get user location:', err);
      // Usar localização padrão (Curitiba) se não conseguir obter a localização do usuário
      setUserLocation({ latitude: -25.4284, longitude: -49.2733 });
    }
  };

  const sortVehiclesByDistance = () => {
    if (!userLocation) return;

    const withCoords = vehicles.filter(v => v && v.coordinates && typeof v.coordinates.latitude === 'number' && isFinite(v.coordinates.latitude) && typeof v.coordinates.longitude === 'number' && isFinite(v.coordinates.longitude));
    const vehiclesWithDistance = withCoords.map(vehicle => ({
      ...vehicle,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        vehicle.coordinates.latitude,
        vehicle.coordinates.longitude
      )
    }));

    const sorted = vehiclesWithDistance.sort((a, b) => (a.distance as number) - (b.distance as number));
    setSortedVehicles(sorted);
  };

  const toggleExpanded = (id?: string) => {
    if (!id) return;
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando veículos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold">Erro: {error}</p>
            </div>
            <button 
              onClick={loadVehicles} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Veículos</h1>
          <p className="text-gray-600">Veículos ordenados por proximidade</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Veículos ({vehicles.length})</h2>
                <button 
                  onClick={loadVehicles} 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  🔄 Atualizar
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">Nenhum veículo encontrado.</p>
                  <a 
                    href="/register" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 inline-block"
                  >
                    Cadastrar primeiro veículo
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.identifier}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">Placa:</span> {vehicle.license_plate}</p>
                            <p><span className="font-medium">Rastreador:</span> {vehicle.tracker_serial_number}</p>
                            {vehicle.coordinates && typeof vehicle.coordinates.latitude === 'number' && typeof vehicle.coordinates.longitude === 'number' ? (
                              <p><span className="font-medium">Coordenadas:</span> {vehicle.coordinates.latitude.toFixed(6)}, {vehicle.coordinates.longitude.toFixed(6)}</p>
                            ) : (
                              <p className="text-amber-700"><span className="font-medium">Coordenadas:</span> Não informadas</p>
                            )}
                            {userLocation && vehicle.coordinates && typeof (vehicle as any).distance === 'number' && isFinite((vehicle as any).distance) && (
                              <p><span className="font-medium">Distância:</span> {formatDistance((vehicle as any).distance)}</p>
                            )}
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => toggleExpanded(vehicle.id)}
                              disabled={!(vehicle.coordinates && typeof vehicle.coordinates.latitude === 'number' && typeof vehicle.coordinates.longitude === 'number')}
                              className={`text-sm px-3 py-1 rounded-md border transition-colors ${vehicle.coordinates ? 'border-blue-200 text-blue-700 hover:bg-blue-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                              {expanded[vehicle.id || ''] ? 'Ocultar mapa' : 'Ver localização'}
                            </button>
                          </div>
                          {expanded[vehicle.id || ''] && vehicle.coordinates && (
                            <div className="mt-4">
                              <InlineMap
                                center={vehicle.coordinates}
                                height={220}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                        <div className="bg-blue-100 text-blue-800 font-bold text-sm px-3 py-1 rounded-full ml-4">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mapa dos Veículos</h2>
              <div className="h-96">
                <VehicleMap 
                  vehicles={vehicles} 
                  userLocation={userLocation}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
