"use client";
import useGeoJSON from '@/components/useGeoJSON';
import MapGL, { Layer, Source } from 'react-map-gl';
import { heatmapLayer } from '../mapstyle';

export default function Home() {
  const { data, loading, } = useGeoJSON('/2024-05-19_05.geojson');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='h-screen w-screen'>
      {data && (
        <MapGL
        initialViewState={{
          latitude: 40.7649,
          longitude: -111.8421,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <Source type="geojson" data={data}>
          <Layer {...heatmapLayer} />
        </Source>
      </MapGL>
      )}
      
    </main>
  );
};

