"use client";
import useGeoJSON from '@/components/useGeoJSON';
import useUserLocation from '@/components/useUserLocation';
import { MAP_BOUNDARY, U_OF_U_DEFAULT_COORDS } from '@/constants/constants';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import MapGL, { Layer, Source } from 'react-map-gl';
import { heatmapLayer } from '../mapstyle';
config.autoAddCss = false;

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { geoJSONData, geoJSONLoading } = useGeoJSON('/2024-05-19_05.geojson');
  const { userLocationLoading, userLocation, userLocationError } = useUserLocation();

  useEffect(() => {
    if (!userLocationLoading && !geoJSONLoading) {
      setMapLoaded(true);
    }
  }, [userLocationLoading, geoJSONLoading]);

  if (userLocationLoading || geoJSONLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white">
            Trajectory Air 
            <FontAwesomeIcon 
              icon={faWind} 
              className="text-white ml-4" 
            />
          </h1>
        </div>
        {(userLocationLoading || geoJSONLoading) && (
          <h1 className="text-3 font-bold text-white">Loading...</h1>
        )}
      </div>
    );
  }

  return (
    <main className='h-full w-full'>
      {mapLoaded && (
        <MapGL
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            latitude: userLocation?.latitude || U_OF_U_DEFAULT_COORDS.lat,
            longitude: userLocation?.longitude || U_OF_U_DEFAULT_COORDS.lon,
            zoom: 10
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          maxBounds={MAP_BOUNDARY}
          style={{ width: '100%', height: '100%' }}
          onLoad={() => setMapLoaded(true)}
        >
          <Source type="geojson" data={geoJSONData!}>
            <Layer {...heatmapLayer} />
          </Source>
        </MapGL>
      )}
    </main>
  );
}
