import React, { useEffect, useRef } from 'react';
import { Vehicle } from '../types/Vehicle';

interface VehicleMapProps {
  vehicles: Vehicle[];
  userLocation?: { latitude: number; longitude: number } | null;
  className?: string;
}

const VehicleMap: React.FC<VehicleMapProps> = ({ vehicles, userLocation, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const validVehicles = (vehicles || []).filter(
    (v) => v && v.coordinates &&
      typeof v.coordinates.latitude === 'number' && isFinite(v.coordinates.latitude) &&
      typeof v.coordinates.longitude === 'number' && isFinite(v.coordinates.longitude)
  );

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    let mounted = true;

    (async () => {
      const L = await import('leaflet');
      if (!mounted || !containerRef.current) return;

      const fallbackCenter: [number, number] = [-25.4284, -49.2733];
      const initialCenter: [number, number] = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : (validVehicles[0]
            ? [validVehicles[0].coordinates.latitude, validVehicles[0].coordinates.longitude]
            : fallbackCenter);

      const map = L.map(containerRef.current, { zoomAnimation: false }).setView(initialCenter, 12);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      if (userLocation) {
        const u = L.circleMarker([userLocation.latitude, userLocation.longitude], {
          radius: 8,
          color: '#1d4ed8',
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        u.bindTooltip('Você');
        bounds.extend([userLocation.latitude, userLocation.longitude]);
        markersRef.current.push(u);
      }

      validVehicles.forEach((v) => {
        const m = L.circleMarker([v.coordinates.latitude, v.coordinates.longitude], {
          radius: 7,
          color: '#065f46',
          fillColor: '#10b981',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        m.bindTooltip(v.identifier || 'Veículo');
        bounds.extend([v.coordinates.latitude, v.coordinates.longitude]);
        markersRef.current.push(m);
      });

      if (bounds.isValid()) {
        try {
          map.fitBounds(bounds.pad(0.2), { animate: false });
        } catch {}
      }

      map.whenReady(() => {
        setTimeout(() => {
          try { map.invalidateSize(false); } catch {}
        }, 0);
      });
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    (async () => {
      const L = await import('leaflet');
      const map = mapRef.current;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds = L.latLngBounds([]);

      if (userLocation) {
        const u = L.circleMarker([userLocation.latitude, userLocation.longitude], {
          radius: 8,
          color: '#1d4ed8',
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        u.bindTooltip('Você');
        bounds.extend([userLocation.latitude, userLocation.longitude]);
        markersRef.current.push(u);
      }

      validVehicles.forEach((v) => {
        const m = L.circleMarker([v.coordinates.latitude, v.coordinates.longitude], {
          radius: 7,
          color: '#065f46',
          fillColor: '#10b981',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        m.bindTooltip(v.identifier || 'Veículo');
        bounds.extend([v.coordinates.latitude, v.coordinates.longitude]);
        markersRef.current.push(m);
      });

      if (bounds.isValid()) {
        try {
          map.fitBounds(bounds.pad(0.2), { animate: false });
        } catch {}
      }
    })();
  }, [vehicles, userLocation]);

  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
    return (
      <div className={`w-full h-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 ${className || ''}`}>
        <div className="font-semibold mb-1">Mapa dos Veículos (modo teste)</div>
        <div>Veículos com coordenadas: {validVehicles.length}/{vehicles.length}</div>
        {userLocation && (
          <div className="mt-1">Sua localização: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full rounded-md overflow-hidden ${className || ''}`} data-testid="vehicle-map" />
  );
};

export default VehicleMap;
