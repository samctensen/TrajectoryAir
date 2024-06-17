'use client';
import { CornerHUD } from '@/components/CornerHUD/CornerHUD';
import { DateSlider } from '@/components/DateSlider/DateSlider';
import { LocationInfo } from '@/components/LocationInfo/LocationInfo';
import { Logo } from '@/components/Logo/Logo';
import { MapLegend } from '@/components/MapLegend/MapLegend';
import { MediaControls } from '@/components/MediaControls/MediaControls';
import { TimeSlider } from '@/components/TimeSlider/TimeSlider';
import useUserLocation from '@/components/useUserLocation';
import { MAP_BOUNDARY, TILESET_IDS, U_OF_U_DEFAULT_COORDS } from '@/constants/constants';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import MapGL, { Layer, LngLatBoundsLike, MapLayerMouseEvent, MapRef, Source } from 'react-map-gl';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { ParticleMatterLayer } from '../components/ParticleMatterLayer';
config.autoAddCss = false;

export default function Home() {
  const mapRef = useRef<MapRef | null>(null);
  const { userLocation, userTime } = useUserLocation();
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
  const offsetSign = offsetInMinutes < 0 ? -1 : 1;
  const userTimezone = (offsetSign * offsetHours);
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);
  const [clickedPM25, setClickedPM25] = useState<number>(0);
  const [sliderDate, setSliderDate] = useState(new Date('2024-05-15'));
  const [sliderTime, setSliderTime] = useState(userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1);
  const [tilesetID, setTilesetID] = useState(TILESET_IDS[(userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1) + userTimezone]);
  const [maxBounds, setMaxBounds] = useState<LngLatBoundsLike | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [showCornerHUD, setShowCornerHUD] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [dayPlaying, setDayPlaying] = useState(false);
  const [mapControlsEnabled, setMapControls] = useState(false);
  const firstDate = new Date('2024-05-15');
  const sliderDays = getNextDays(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (dayPlaying) {
      interval = setInterval(() => {
        setSliderTime((prevTime) => {
          const newTime = (prevTime + 1) % 24;
          return newTime;
        });
      }, 2000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dayPlaying]);

  useEffect(() => {
    setTilesetID(TILESET_IDS[sliderTime + userTimezone]);
  }, [sliderTime, userTimezone]);

  function initialMapAnimation() {
    if (mapRef.current) {
      mapRef.current?.flyTo({
        center: [(userLocation?.longitude || U_OF_U_DEFAULT_COORDS.lon), (userLocation?.latitude || U_OF_U_DEFAULT_COORDS.lat)],
        zoom: 8,
        bearing: 0,
        pitch: 0,
        duration: 4000,
      });
      setMaxBounds(MAP_BOUNDARY);
      setTimeout(() => {
        setAnimationDone(true);
        setMapControls(true);
        setDayPlaying(true);
        setShowCornerHUD(true);
      }, 3500);
    }
}

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
  }

  function onDateChange(current: number, next: number) {
    const newSliderDate = new Date(sliderDate);
    if (next > current) {
      newSliderDate.setDate(sliderDate.getDate() + 1);
    } else if (next == 0) {
      newSliderDate.setDate(firstDate.getDate());
    } else {
      newSliderDate.setDate(sliderDate.getDate() - 1);
    }
    setSliderDate(newSliderDate);
  }

  function onTimeChange(event: Event, value: number) {
    setSliderTime(value);
    if (value + userTimezone > 23) {
      setSliderDate(new Date(sliderDate.getDate() + 1));
    }
    setTilesetID(TILESET_IDS[value + userTimezone]);
  }

  function onMapClick(event: MapLayerMouseEvent) {
    if (mapControlsEnabled) {
      setShowCornerHUD(false);
      mapRef.current?.flyTo({ center: event.lngLat, zoom: 8, duration: 1500 });
      setShowInfo(true);
      setClickedLatLng([event.lngLat.lat, event.lngLat.lng]);
      const feature = event.features && event.features[0];
      if (feature && feature.properties) {
        const pm25 = feature.properties.PM25;
        setClickedPM25(pm25);
      } else {
        setClickedPM25(0);
      }
    }
  }

  function onPlayPauseClick() {
    setDayPlaying(!dayPlaying);
  }

  function onCloseInfoClick() {
    setShowInfo(false);
    setShowCornerHUD(true);
  }

  function onSkipClicked(increment: number) {
    if (dayPlaying) {
      setDayPlaying(false);
    }
    if (sliderTime + increment > 23) {
      setSliderTime(0);
    }
    else if (sliderTime + increment < 0) {
      setSliderTime(23);
    }
    else {
      setSliderTime(sliderTime + increment);
    }
    
  }

  return (
    <main>
      {showLogo && <Logo />}
      {animationDone && <CornerHUD time={sliderTime} showHUD={showCornerHUD}/>}
      <MapGL
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          latitude: 50,
          longitude: -130,
          zoom: 4,
          bearing: 55,
          pitch: 60,
        }}
        mapStyle='mapbox://styles/mapbox/dark-v11'
        maxZoom={10}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['ParticleMatterLayer']}
        onClick={onMapClick}
        onLoad={initialMapAnimation}
        maxBounds={maxBounds!}
        scrollZoom={mapControlsEnabled}
        boxZoom={mapControlsEnabled}
        doubleClickZoom={mapControlsEnabled}
        dragRotate={mapControlsEnabled}
        dragPan={mapControlsEnabled}
        keyboard={mapControlsEnabled}
      >
        <Source type='vector' url={'mapbox://' + process.env.NEXT_PUBLIC_MAPBOX_USERNAME + '.' + tilesetID}>
          <Layer {...ParticleMatterLayer} />
        </Source>
      </MapGL>
      <MapLegend />
      <DateSlider sliderDays={sliderDays} onDateChange={onDateChange} />
      <MediaControls playing={dayPlaying} onPlayPauseClicked={onPlayPauseClick} onSkipClicked={onSkipClicked}/>
      <TimeSlider sliderValue={sliderTime} onTimeChange={onTimeChange} />
      {showInfo && (
        <LocationInfo close={onCloseInfoClick} latLng={clickedLatLng} pm25={clickedPM25} />
      )}
    </main>
  );
}
