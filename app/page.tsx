'use client';
import { CornerHUD, DateSlider, LocationInfo, Logo, MapLegend, MediaControls, ParticleMatterLayer, TimeSlider } from '@/components';
import useUserLocation from '@/components/useUserLocation';
import { LAYER_OPACITY, MAP_BOUNDARY, TILESET_IDS, U_OF_U_DEFAULT_COORDS } from '@/constants/constants';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { Layer, LngLatBoundsLike, MapLayerMouseEvent, MapRef, Source } from 'react-map-gl';
config.autoAddCss = false;

export default function Home() {
  const mapRef = useRef<MapRef | null>(null);
  const { userLocation, userTime } = useUserLocation();
  const userTimezone = useMemo(() => {
    const offsetInMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
    const offsetSign = offsetInMinutes < 0 ? -1 : 1;
    return offsetSign * offsetHours;
  }, []);
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);
  const [clickedPM25, setClickedPM25] = useState<number>(0);
  const [sliderDate, setSliderDate] = useState(new Date());
  const [sliderTime, setSliderTime] = useState(userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1);
  const [activeLayer, setActiveLayer] = useState(["ParticleMatterLayer2"]);
  const [tilesetIDs, setTilesetIDs] = useState([TILESET_IDS[(sliderTime - 2)% 24 + userTimezone], TILESET_IDS[(sliderTime - 1) % 24 + userTimezone], TILESET_IDS[sliderTime % 24 + userTimezone], TILESET_IDS[(sliderTime + 1) % 24 + userTimezone], TILESET_IDS[(sliderTime + 2) % 24 + userTimezone]]);
  const [maxBounds, setMaxBounds] = useState<LngLatBoundsLike | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showCornerHUD, setShowCornerHUD] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [dayPlaying, setDayPlaying] = useState(false);
  const [mapControlsEnabled, setMapControls] = useState(false);
  const firstDate = new Date();
  const sliderDays = getNextDays(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
      setDayPlaying(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (dayPlaying) {
      interval = setInterval(() => {
        onSkipClicked(1);
      }, 2000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dayPlaying, onSkipClicked]);

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
  }

  function onMapClick(event: MapLayerMouseEvent) {
    if (mapControlsEnabled) {
      setShowInfo(true);
      setShowCornerHUD(false);
      setClickedLatLng([event.lngLat.lat, event.lngLat.lng]);
      mapRef.current?.flyTo({
        center: event.lngLat,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        duration: 1500
      });
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
  }

  function onLegendButtonClick() {
    setShowLegend(!showLegend);
  }

  function getActiveLayer(): number {
    if (mapRef.current?.getMap().getPaintProperty('ParticleMatterLayer0', 'circle-opacity') != 0) {
      return 0;
    }
    else if (mapRef.current?.getMap().getPaintProperty('ParticleMatterLayer1', 'circle-opacity') != 0) {
      return 1;
    }
    else if (mapRef.current?.getMap().getPaintProperty('ParticleMatterLayer2', 'circle-opacity') != 0) {
      return 2;
    }
    else if (mapRef.current?.getMap().getPaintProperty('ParticleMatterLayer3', 'circle-opacity') != 0) {
      return 3;
    }
    else {
      return 4;
    }
  }

  function onSkipClicked(increment: number) {
    let newTime = sliderTime + increment;
    if (newTime > 23) {
      newTime = 0;
    } else if (newTime < 0) {
      newTime = 23;
    }
    const activeLayer = getActiveLayer();
    const nextLayer = (newTime + userTimezone + 2) % TILESET_IDS.length;
    setTilesetIDs(tilesetIDs.with((activeLayer + 3) % 5, TILESET_IDS[nextLayer]));
    mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-opacity', 0);
    mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${(activeLayer + 1) % 5}`, 'circle-opacity', LAYER_OPACITY);
    setActiveLayer([`ParticleMatterLayer${(activeLayer + 1) % 5}`])
    setSliderTime(newTime);
  }

  return (
    <main>
        {showLogo && <Logo />}
        {animationDone && <CornerHUD time={sliderTime} sliderDate={sliderDate} showHUD={showCornerHUD}/>}
        {animationDone && <MapLegend showLegend={showLegend} onClick={onLegendButtonClick}/>}
        {showInfo && (
          <LocationInfo close={onCloseInfoClick} latLng={clickedLatLng} pm25={clickedPM25} />
        )}
        <DateSlider sliderDays={sliderDays} onDateChange={onDateChange} />
        <MediaControls playing={dayPlaying} onPlayPauseClicked={onPlayPauseClick} onSkipClicked={onSkipClicked}/>
        <TimeSlider sliderValue={sliderTime} onTimeChange={onTimeChange} />
        <MapGL
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          attributionControl={false}
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
          interactiveLayerIds={activeLayer}
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
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[0]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer0", 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[1]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer1", 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[2]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer2", LAYER_OPACITY)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[3]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer3", 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[4]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer4", 0)}/>
          </Source>
        </MapGL>
    </main>
  );
}
