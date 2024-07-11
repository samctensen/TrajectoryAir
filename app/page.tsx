'use client';
import { ControlCenter, CornerHUD, LocationInfo, Logo, MapLegend, ParticleMatterLayer } from '@/components';
import useUserLocation from '@/components/useUserLocation';
import { LAYER_BLUR, LAYER_OPACITY, LAYER_RADIUS, MAP_BOUNDARY, U_OF_U_DEFAULT_COORDS } from '@/constants';
import { negativeModulo } from '@/functions';
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
  const [animationDone, setAnimationDone] = useState(false);
  const [mapControlsEnabled, setMapControls] = useState(false);
  const [dayPlaying, setDayPlaying] = useState(false);
  const [sliderDate, setSliderDate] = useState(new Date());
  const [sliderTime, setSliderTime] = useState(userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1);
  const [activeLayer, setActiveLayer] = useState(["ParticleMatterLayer2"]);
  const [maxBounds, setMaxBounds] = useState<LngLatBoundsLike | null>(null);
  const [logoFadeOut, setLogoFadeOut] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showCornerHUD, setShowCornerHUD] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(null);
  const [clickedPM25, setClickedPM25] = useState<number>(0);
  const [currentDaysTilesetIDs, setCurrentDaysTileSets] = useState(getDaysTilesets(sliderDate));
  const sliderDays = getNextDays(5);
  const [tilesetIDs, setTilesetIDs] = useState([
    currentDaysTilesetIDs[negativeModulo(sliderTime - 2, 24)],
    currentDaysTilesetIDs[negativeModulo(sliderTime - 1, 24)],
    currentDaysTilesetIDs[sliderTime % 24],
    currentDaysTilesetIDs[(sliderTime + 1) % 24],
    currentDaysTilesetIDs[(sliderTime + 2) % 24]
  ]);

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
    setLogoFadeOut(true);
    if (mapRef.current) {
      mapRef.current.getMap().setPaintProperty(`ParticleMatterLayer2`, 'circle-opacity', LAYER_OPACITY);
      mapRef.current.flyTo({
        center: [(userLocation?.longitude || U_OF_U_DEFAULT_COORDS.lon), (userLocation?.latitude || U_OF_U_DEFAULT_COORDS.lat)],
        zoom: 8,
        bearing: 0,
        pitch: 0,
        duration: 4000,
      });
      setMaxBounds(MAP_BOUNDARY);
      setTimeout(() => {
        setShowLogo(false);
        setAnimationDone(true);
        setMapControls(true);
        setShowCornerHUD(true);
        setShowControlCenter(true);
        setDayPlaying(true);
      }, 3500);
    }
  }

  function getNextDays(days: number) {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  function getDaysTilesets(date: Date): string[]{
    let newDate = new Date(date.getTime());
    let nextDay = new Date(newDate.getDate() + 1);
    const ids = [];
    for (let index = 0; index < 24; index++) {
      if (index + userTimezone > 23 && newDate.getTime() !== nextDay.getTime()) {
        newDate.setDate(nextDay.getTime());
      }
      let dateString = newDate.toISOString().split('T')[0] + '_';
      dateString = dateString + ((index + userTimezone) % 24).toString().padStart(2, '0');
      ids.push(dateString);
    }
    return ids;
  }

  function onDateChange(current: number, next: number) {
    let index = 0
    if (next > current) {
      index = current + 1
    } else if (next < current && next != 0) {
      index = current - 1;
    }
    setSliderDate(sliderDays[index])
    const newDatesTileSets = getDaysTilesets(sliderDays[index]);
    setCurrentDaysTileSets(newDatesTileSets);
    setTilesetIDs([
      newDatesTileSets[negativeModulo(sliderTime - 2, 24)],
      newDatesTileSets[negativeModulo(sliderTime - 1, 24)],
      newDatesTileSets[sliderTime % 24],
      newDatesTileSets[(sliderTime + 1) % 24],
      newDatesTileSets[(sliderTime + 2) % 24]
    ])
  }

  function onTimeChange(event: Event, value: number) {
    setSliderTime(value);
  }

  function onMapClick(event: MapLayerMouseEvent) {
    if (mapControlsEnabled) {
      setShowInfo(true);
      setDayPlaying(false);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onSkipClicked(increment: number) {
    const newTime = negativeModulo(sliderTime + increment, 24);
    const activeLayer = getActiveLayer();
    if (increment > 0) {
      const nextLayer = (newTime + 2) % currentDaysTilesetIDs.length;
      setTilesetIDs(tilesetIDs.with((activeLayer + 3) % 5, currentDaysTilesetIDs[nextLayer]));
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-opacity', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-radius', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-blur', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${(activeLayer + 1) % 5}`, 'circle-radius', LAYER_RADIUS);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${(activeLayer + 1) % 5}`, 'circle-blur', LAYER_BLUR);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${(activeLayer + 1) % 5}`, 'circle-opacity', LAYER_OPACITY);
      setActiveLayer([`ParticleMatterLayer${(activeLayer + 1) % 5}`])
    }
    else {
      const nextLayer = negativeModulo(newTime + userTimezone - 2, currentDaysTilesetIDs.length);
      setTilesetIDs(tilesetIDs.with(negativeModulo(activeLayer - 3, 5), currentDaysTilesetIDs[nextLayer]));
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-radius', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-opacity', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${activeLayer}`, 'circle-blur', 0);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`, 'circle-radius', LAYER_RADIUS);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`, 'circle-opacity', LAYER_OPACITY);
      mapRef.current?.getMap().setPaintProperty(`ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`, 'circle-blur', LAYER_BLUR);
      setActiveLayer([`ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`])
    }
    setSliderTime(newTime);
  }

  return (
    <main>
        {showLogo && <Logo fadeOut={logoFadeOut} />}
        {animationDone && <CornerHUD time={sliderTime} sliderDate={sliderDate} showHUD={showCornerHUD}/>}
        {animationDone && <MapLegend showLegend={showLegend} onClick={onLegendButtonClick}/>}
        {animationDone && <ControlCenter 
          showControls={showControlCenter}
          sliderTime={sliderTime}
          onTimeChange={onTimeChange}
          playing={dayPlaying}
          onPlayPauseClicked={onPlayPauseClick}
          onSkipClicked={onSkipClicked}
          sliderDays={sliderDays}
          onDateChange={onDateChange}
        />}
        {showInfo && (
          <LocationInfo close={onCloseInfoClick} latLng={clickedLatLng} currentPM25={clickedPM25} tilesetIDs={currentDaysTilesetIDs} />
        )}
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
            <Layer {...ParticleMatterLayer("ParticleMatterLayer0", 0, 0, 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[1]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer1", 0, 0, 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[2]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer2", LAYER_RADIUS, 0, LAYER_BLUR)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[3]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer3", 0, 0, 0)}/>
          </Source>
          <Source type='vector' url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${tilesetIDs[4]}`}>
            <Layer {...ParticleMatterLayer("ParticleMatterLayer4", 0, 0, 0)}/>
          </Source>
        </MapGL>
    </main>
  );
}
