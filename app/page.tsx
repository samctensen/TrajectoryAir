"use client";
import MapGL from 'react-map-gl';

export default function Home() {
  return (
    <main className='h-screen w-screen'>
        <MapGL
          initialViewState={{
            latitude: 40.7649,
            longitude: -111.8421,
            zoom: 14
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        />
    </main>
  );
}
