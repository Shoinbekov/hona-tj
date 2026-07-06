'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

// ssr:false is required — Leaflet accesses `window` and cannot run on the server
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 14 }}>
      Загрузка карты…
    </div>
  ),
});

export default function MapPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ flex: 1, marginTop: 60, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <MapView />
      </div>
    </div>
  );
}
