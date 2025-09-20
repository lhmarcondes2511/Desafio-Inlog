import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types/Vehicle';

interface InlineMapProps {
  center: Coordinates;
  height?: number;
  className?: string;
}

const InlineMap: React.FC<InlineMapProps> = ({ center, height = 240, className }) => {
  const isValid = !!center && typeof center.latitude === 'number' && isFinite(center.latitude) && typeof center.longitude === 'number' && isFinite(center.longitude);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!isValid) return;
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    let mounted = true;

    (async () => {
      const L = await import('leaflet');
      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current).setView([center.latitude, center.longitude], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      markerRef.current = L.circleMarker([center.latitude, center.longitude], {
        radius: 8,
        color: '#065f46',
        fillColor: '#10b981',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map);
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
      }
      markerRef.current = null;
    };
  }, [isValid, center?.latitude, center?.longitude]);

  useEffect(() => {
    if (!isValid || !mapRef.current || !markerRef.current) return;
    const ll = [center.latitude, center.longitude] as [number, number];
    markerRef.current.setLatLng(ll);
    mapRef.current.panTo(ll, { animate: true });
  }, [isValid, center?.latitude, center?.longitude]);

  if (!isValid) {
    return (
      <div className={className}>
        <div style={{ width: '100%', height }} className="rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
          Sem coordenadas válidas para exibir o mapa
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{ width: '100%', height }}
        className="rounded-md overflow-hidden border border-emerald-200"
        data-testid="inline-map"
      />
    </div>
  );
};

export default InlineMap;
