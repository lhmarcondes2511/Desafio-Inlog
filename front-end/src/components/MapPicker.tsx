import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types/Vehicle';

interface MapPickerProps {
  value?: Coordinates | null;
  onChange: (coords: Coordinates) => void;
  initialCenter?: Coordinates;
  className?: string;
  height?: number;
}

const MapPicker: React.FC<MapPickerProps> = ({
  value,
  onChange,
  initialCenter = { latitude: -25.4284, longitude: -49.2733 },
  className,
  height = 360,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    let mounted = true;

    (async () => {
      const L = await import('leaflet');

      if (!mounted || !containerRef.current) return;

      const center = value ?? initialCenter;

      const map = L.map(containerRef.current, { zoomAnimation: false }).setView([center.latitude, center.longitude], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const addOrMoveMarker = (lat: number, lng: number) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.circleMarker([lat, lng], {
            radius: 8,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.9,
            weight: 2,
          }).addTo(map);
        }
      };

      if (value) {
        addOrMoveMarker(value.latitude, value.longitude);
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        addOrMoveMarker(lat, lng);
        onChange({ latitude: lat, longitude: lng });
      });

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
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !value) return;
    const LlatLng = [value.latitude, value.longitude] as [number, number];
    if (!markerRef.current) return;
    markerRef.current.setLatLng(LlatLng);
    mapRef.current.panTo(LlatLng, { animate: true });
  }, [value?.latitude, value?.longitude]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{ width: '100%', height }}
        className="rounded-md overflow-hidden border border-gray-200"
        data-testid="map-picker"
      />
      <div className="text-xs text-gray-600 mt-2">
        Clique no mapa para selecionar a localização do veículo.
      </div>
    </div>
  );
};

export default MapPicker;
