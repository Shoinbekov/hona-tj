'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BLUE = '#1a56db';
const DUSHANBE_CENTER: [number, number] = [38.5598, 68.7733];

// Same pin style as the main site map (MapView.tsx) — divIcon avoids Leaflet's
// default-image-icon/webpack breakage under Next.js.
const PIN = L.divIcon({
  className: '',
  html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 0C5.82 0 0 5.82 0 13c0 9.1 13 21 13 21S26 22.1 26 13C26 5.82 20.18 0 13 0z"
      fill="${BLUE}" stroke="white" stroke-width="1.5"/>
    <circle cx="13" cy="13" r="5.5" fill="white"/>
  </svg>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  // Bumped by the parent only when a *geocode* result lands (not on manual clicks) —
  // that's the signal to fly the map to the new point instead of leaving the view alone.
  flyToSignal: number;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToOnGeocode({ lat, lng, signal }: { lat: number; lng: number; signal: number }) {
  const map = useMap();
  useEffect(() => {
    if (signal === 0) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15));
    // Only react to a new geocode result (signal), not to every lat/lng render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);
  return null;
}

export default function AddressMapPicker({ lat, lng, onChange, flyToSignal }: Props) {
  const hasPoint = lat != null && lng != null;
  const center: [number, number] = hasPoint ? [lat, lng] : DUSHANBE_CENTER;

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #d1d5db' }}>
      <MapContainer center={center} zoom={hasPoint ? 15 : 12} style={{ height: 220, width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickHandler onChange={onChange} />
        {hasPoint && <Marker position={[lat, lng]} icon={PIN} />}
        {hasPoint && <FlyToOnGeocode lat={lat} lng={lng} signal={flyToSignal} />}
      </MapContainer>
    </div>
  );
}
