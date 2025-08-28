'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(m => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(m => m.Popup),
  { ssr: false }
);

export default function PropertyMap({ lat, lng, label }) {
  const center = useMemo(() => {
    if (typeof lat === 'number' && typeof lng === 'number') return [lat, lng];
    return null;
  }, [lat, lng]);

  if (!center) return null;

  return (
    <div className="mt-3">
      <MapContainer center={center} zoom={16} scrollWheelZoom={false} className="leaflet-container">
        <TileLayer
          // OpenStreetMap
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{label || 'Ubicación de la propiedad'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
