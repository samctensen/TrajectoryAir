'use client';
import { DateSlider } from '@/components/DateSlider/DateSlider';
import { LocationInfo } from '@/components/LocationInfo/LocationInfo';
import { MapLegend } from '@/components/MapLegend/MapLegend';
import { TimeSlider } from '@/components/TimeSlider/TimeSlider';
import useUserLocation from '@/components/useUserLocation';
import { MAP_BOUNDARY, U_OF_U_DEFAULT_COORDS } from '@/constants/constants';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import MapGL, { Layer, MapLayerMouseEvent, Source } from 'react-map-gl';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { ParticleMatterLayer } from '../components/ParticleMatterLayer';
config.autoAddCss = false;

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { userLocationLoading, userLocation, userTime, userTimezone } = useUserLocation();
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);
  const [clickedPM25, setClickedPM25] = useState<number>(0);
  const [sliderDate, setSliderDate] = useState(new Date('2024-05-17'));
  const [sliderTime, setSliderTime] = useState(userTime.getHours());
  const [layerIndex, setLayerIndex] = useState(2);
  const [layerID, setLayerID] = useState("20240517");
  const firstDate = new Date('2024-05-15');
  const sliderDays = getNextDays(5);
  const layerURLs = ["4h7e6bm6", "5s4xxzhr", "3gofe1r7", "6w3bn0nh", "d1aj7qju"]

  useEffect(() => {
    if (!userLocationLoading) {
      setMapLoaded(true);
    }
  }, [userLocationLoading]);

  function getNextDays(days: number) {
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

  function onDateChange(current: number, next: number) {
    const newSliderDate = new Date(sliderDate);
    if (next > current) {
      newSliderDate.setDate(sliderDate.getDate() + 1);
      setLayerIndex(layerIndex + 1);
    }
    else if (next == 0) {
      newSliderDate.setDate(firstDate.getDate());
      setLayerIndex(0);
    }
    else {
      newSliderDate.setDate(sliderDate.getDate() - 1);
      setLayerIndex(layerIndex - 1);
    }
    setSliderDate(newSliderDate);
    setLayerID(sliderDate.toISOString().split('T')[0].replace(/-/g, ''));
  }

  function onTimeChange(event: Event, value: number) {
    setSliderTime(value);
  };

  function onMapClick(event: MapLayerMouseEvent) {
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

  function onCloseInfoClick() {
    setShowInfo(false);
  };

  if (userLocationLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen flex-col'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-white'>
            Trajectory Air 
            <FontAwesomeIcon 
              icon={faWind} 
              className='text-white ml-4' 
            />
          </h1>
        </div>
        {(userLocationLoading) && (
          <h1 className='text-3 font-bold text-white'>Loading...</h1>
        )}
      </div>
    );
  }

  return (
    <main className='h-full w-full relative'>
      {mapLoaded && (
        <MapGL
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            latitude: userLocation?.latitude || U_OF_U_DEFAULT_COORDS.lat,
            longitude: userLocation?.longitude || U_OF_U_DEFAULT_COORDS.lon,
            zoom: 10
          }}
          mapStyle='mapbox://styles/mapbox/dark-v11'
          maxBounds={MAP_BOUNDARY}
          maxZoom={10}
          style={{ width: '100%', height: '100%' }}
          interactiveLayerIds={['ParticleMatterLayer']}
          onLoad={() => setMapLoaded(true)}
          onClick={onMapClick}
        >
          <Source type='vector' url={'mapbox://samctensen.' + layerURLs[layerIndex]}>
            <Layer {...ParticleMatterLayer(layerID)} />
          </Source>
        </MapGL>
      )}
      <MapLegend />
      <DateSlider sliderDays={sliderDays} onDateChange={onDateChange}/>
      <TimeSlider sliderValue={sliderTime} onTimeChange={onTimeChange} />
      {showInfo && (
        <LocationInfo close={onCloseInfoClick} latLng={clickedLatLng} pm25={clickedPM25}/>
      )}
    </main>
  );
}
