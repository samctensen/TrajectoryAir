"use client";
import { LocationInfo } from '@/components/LocationInfo';
import { MapLegend } from '@/components/MapLegend';
import useGeoJSON from '@/components/useGeoJSON';
import useUserLocation from '@/components/useUserLocation';
import { MAP_BOUNDARY, U_OF_U_DEFAULT_COORDS } from '@/constants/constants';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import MapGL, { Layer, MapLayerMouseEvent, Source } from 'react-map-gl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ParticleMatterLayer } from '../components/ParticleMatterLayer';
config.autoAddCss = false;

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { geoJSONData, geoJSONLoading, setGeoJSONData } = useGeoJSON('/2024-05-15.geojson');
  const { userLocationLoading, userLocation } = useUserLocation();
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);
  const [clickedPM25, setClickedPM25] = useState<number>(0);
  const currentDate = new Date("2024-05-15");
  var sliderDate = new Date("2024-05-15");

  function OnDateChange(current: number, next: number) {
    if (next > current) {
      sliderDate.setDate(sliderDate.getDate() + 1);
    } else {
      if (next === 0) {
        sliderDate.setDate(currentDate.getDate());
      } else {
        sliderDate.setDate(sliderDate.getDate() - 1);
      }
    }
    setGeoJSONData("/" + sliderDate.toISOString().split('T')[0] + ".geojson");
  }

  const getNextDays = (days: number) => {
    const dates = [];
    for (let i = (days / 2) - 1; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    for (let i = 0; i < days / 2; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const nextDays = getNextDays(5);

  useEffect(() => {
    if (!userLocationLoading && !geoJSONLoading) {
      setMapLoaded(true);
    }
  }, [userLocationLoading, geoJSONLoading]);

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const onClick = (event: MapLayerMouseEvent) => {
    setShowInfo(true);
    setClickedLatLng([event.lngLat.lat, event.lngLat.lng]);
    const feature = event.features && event.features[0];
    if (feature && feature.properties) {
      const pm25 = feature.properties.PM25;
      setClickedPM25(pm25);
    }
    else {
      setClickedPM25(0);
    }
  };

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
    <main className="h-full w-full relative">
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
          maxZoom={10}
          style={{ width: '100%', height: '100%' }}
          interactiveLayerIds={["ParticleMatterLayer"]}
          onLoad={() => setMapLoaded(true)}
          onClick={onClick}
        >
          <Source type="geojson" data={geoJSONData!}>
            <Layer {...ParticleMatterLayer} />
          </Source>
        </MapGL>
      )}
      <MapLegend />
      <div className="legend-title">PM 2.5 Level</div>
      <div className="slider-container">
        <Slider 
          beforeChange={(current, next) => {
            OnDateChange(current, next);
          }}
          className="center"
          slidesToShow={1}
          slidesToScroll={1}
          speed={300}
          dots={true}
          initialSlide={2}
        >
          {nextDays.map((date, index) => (
            <div className="slide-content" key={index}>
              <h3 className="slide-text">
                {index === 2 ? 'Today' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>
          ))}
        </Slider>
      </div>
      {showInfo && (
        <LocationInfo close={handleCloseInfo} latLng={clickedLatLng} pm25={clickedPM25}/>
      )}
    </main>
  );
}
