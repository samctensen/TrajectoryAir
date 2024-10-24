"use client";
import {
  ControlCenter,
  CornerHUD,
  LocationInfo,
  Logo,
  MapLegend,
  ParticleMatterLayer,
} from "@/components";
import { useLocation } from "@/components/LocationProvider";
import { useTilesets } from "@/components/TilesetProvider";
import {
  LAYER_BLUR,
  LAYER_OPACITY,
  LAYER_RADIUS,
  MAP_BOUNDARY,
  U_OF_U_DEFAULT_COORDS,
} from "@/constants";
import { getNextDays, negativeModulo } from "@/functions";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MapGL, {
  Layer,
  LngLatBoundsLike,
  MapLayerMouseEvent,
  MapRef,
  Marker,
  Source,
} from "react-map-gl";
config.autoAddCss = false;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const mapRef = useRef<MapRef | null>(null);
  const { userLocation, userTime } = useLocation();
  const { allTilesetIDs, activeTilesets, setActiveTilesets, tilesetsLoading } =
    useTilesets();
  const [animationDone, setAnimationDone] = useState(false);
  const [mapControlsEnabled, setMapControls] = useState(false);
  const [dayPlaying, setDayPlaying] = useState(false);
  const [sliderDateIndex, setSliderDateIndex] = useState(0);
  const [sliderTime, setSliderTime] = useState(
    userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1
  );
  const [activeLayer, setActiveLayer] = useState(["ParticleMatterLayer2"]);
  const [maxBounds, setMaxBounds] = useState<LngLatBoundsLike | null>(null);
  const [logoFadeOut, setLogoFadeOut] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showCornerHUD, setShowCornerHUD] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<[number, number] | null>(
    lat && lng ? [Number(lat), Number(lng)] : null
  );
  const sliderDays = getNextDays(allTilesetIDs.length);

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
      mapRef.current
        .getMap()
        .setPaintProperty(
          `ParticleMatterLayer2`,
          "circle-opacity",
          LAYER_OPACITY
        );
      if (lat && lng) {
        mapRef.current.flyTo({
          center: [Number(lng), Number(lat)],
          bearing: 0,
          pitch: 0,
          duration: 4000,
        });
      } else if (userLocation?.latitude && userLocation?.longitude) {
        mapRef.current.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 6,
          bearing: 0,
          pitch: 0,
          duration: 4000,
        });
      } else {
        mapRef.current.flyTo({
          center: [U_OF_U_DEFAULT_COORDS.lon, U_OF_U_DEFAULT_COORDS.lat],
          zoom: 6,
          bearing: 0,
          pitch: 0,
          duration: 4000,
        });
      }
      setMaxBounds(MAP_BOUNDARY);
      setTimeout(() => {
        setShowLogo(false);
        setAnimationDone(true);
        setMapControls(true);
        setShowCornerHUD(true);
        setShowControlCenter(true);
        if (lat && lng) {
          setShowInfo(true);
          setDayPlaying(false);
        } else {
          setDayPlaying(true);
        }
      }, 3500);
    }
  }

  function onDateChange(current: number, next: number) {
    setSliderDateIndex(next);
    setActiveTilesets([
      allTilesetIDs[next][negativeModulo(sliderTime - 2, 24)],
      allTilesetIDs[next][negativeModulo(sliderTime - 1, 24)],
      allTilesetIDs[next][negativeModulo(sliderTime, 24)],
      allTilesetIDs[next][negativeModulo(sliderTime + 1, 24)],
      allTilesetIDs[next][negativeModulo(sliderTime + 2, 24)],
    ]);
    mapRef.current
      ?.getMap()
      .setPaintProperty(
        `ParticleMatterLayer${getActiveLayer()}`,
        "circle-opacity",
        0
      );
    mapRef.current
      ?.getMap()
      .setPaintProperty(
        `ParticleMatterLayer2`,
        "circle-opacity",
        LAYER_OPACITY
      );
  }

  function onMapClick(event: MapLayerMouseEvent) {
    if (mapControlsEnabled) {
      setShowInfo(true);
      setDayPlaying(false);
      setShowCornerHUD(false);
      setClickedLatLng([event.lngLat.lat, event.lngLat.lng]);
      mapRef.current?.flyTo({
        center: event.lngLat,
        bearing: 0,
        pitch: 0,
        duration: 1500,
      });
      const params = new URLSearchParams(searchParams);
      params.set("lat", event.lngLat.lat.toString());
      params.set("lng", event.lngLat.lng.toString());
      router.replace(`/?${params.toString()}`);
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

  function onTimeChange(event: Event, value: number) {
    setSliderTime(value);
  }

  function setLatLng(lat: number, lng: number) {
    setClickedLatLng([lat, lng]);
    mapRef.current?.flyTo({
      center: [Number(lng), Number(lat)],
      bearing: 0,
      pitch: 0,
      duration: 4000,
    });
  }

  function getActiveLayer(): number {
    if (
      mapRef.current
        ?.getMap()
        .getPaintProperty("ParticleMatterLayer0", "circle-opacity") != 0
    ) {
      return 0;
    } else if (
      mapRef.current
        ?.getMap()
        .getPaintProperty("ParticleMatterLayer1", "circle-opacity") != 0
    ) {
      return 1;
    } else if (
      mapRef.current
        ?.getMap()
        .getPaintProperty("ParticleMatterLayer2", "circle-opacity") != 0
    ) {
      return 2;
    } else if (
      mapRef.current
        ?.getMap()
        .getPaintProperty("ParticleMatterLayer3", "circle-opacity") != 0
    ) {
      return 3;
    } else {
      return 4;
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onSkipClicked(increment: number) {
    const newTime = negativeModulo(sliderTime + increment, 24);
    const activeLayer = getActiveLayer();
    if (increment > 0) {
      const nextLayer = (newTime + 2) % 24;
      setActiveTilesets(
        activeTilesets.with(
          (activeLayer + 3) % 5,
          allTilesetIDs[sliderDateIndex][nextLayer]
        )
      );
      mapRef.current
        ?.getMap()
        .setPaintProperty(
          `ParticleMatterLayer${activeLayer}`,
          "circle-opacity",
          0
        );
      mapRef.current
        ?.getMap()
        .setPaintProperty(
          `ParticleMatterLayer${(activeLayer + 1) % 5}`,
          "circle-opacity",
          LAYER_OPACITY
        );
      setActiveLayer([`ParticleMatterLayer${(activeLayer + 1) % 5}`]);
    } else {
      const nextLayer = negativeModulo(newTime - 2, 24);
      setActiveTilesets(
        activeTilesets.with(
          negativeModulo(activeLayer - 3, 5),
          allTilesetIDs[sliderDateIndex][nextLayer]
        )
      );
      mapRef.current
        ?.getMap()
        .setPaintProperty(
          `ParticleMatterLayer${activeLayer}`,
          "circle-opacity",
          0
        );
      mapRef.current
        ?.getMap()
        .setPaintProperty(
          `ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`,
          "circle-opacity",
          LAYER_OPACITY
        );
      setActiveLayer([
        `ParticleMatterLayer${negativeModulo(activeLayer - 1, 5)}`,
      ]);
    }
    setSliderTime(newTime);
  }

  return (
    <main>
      {showLogo && <Logo fadeOut={logoFadeOut} />}
      {animationDone && (
        <CornerHUD
          time={sliderTime}
          sliderDateIndex={sliderDateIndex}
          showHUD={showCornerHUD}
        />
      )}
      {animationDone && (
        <MapLegend showLegend={showLegend} onClick={onLegendButtonClick} />
      )}
      {animationDone && (
        <ControlCenter
          showControls={showControlCenter}
          sliderTime={sliderTime}
          onTimeChange={onTimeChange}
          playing={dayPlaying}
          onPlayPauseClicked={onPlayPauseClick}
          onSkipClicked={onSkipClicked}
          sliderDays={sliderDays}
          sliderDateIndex={sliderDateIndex}
          onDateChange={onDateChange}
        />
      )}
      {showInfo && (
        <LocationInfo
          close={onCloseInfoClick}
          tilesetIDs={allTilesetIDs}
          latLng={clickedLatLng}
          setLatLng={setLatLng}
          sliderDateIndex={sliderDateIndex}
          sliderTime={sliderTime}
          currentTime={userTime}
        />
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
        mapStyle="mapbox://styles/mapbox/dark-v11"
        maxZoom={10}
        style={{ width: "100%", height: "100%" }}
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
        {showInfo && (
          <Marker longitude={clickedLatLng![1]} latitude={clickedLatLng![0]}>
            <h1 className="text-2xl">📍</h1>
          </Marker>
        )}
        {!tilesetsLoading && (
          <>
            <Source
              type="vector"
              url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${activeTilesets[0]}`}
            >
              <Layer
                {...ParticleMatterLayer(
                  "ParticleMatterLayer0",
                  LAYER_RADIUS,
                  0,
                  LAYER_BLUR
                )}
              />
            </Source>
            <Source
              type="vector"
              url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${activeTilesets[1]}`}
            >
              <Layer
                {...ParticleMatterLayer(
                  "ParticleMatterLayer1",
                  LAYER_RADIUS,
                  0,
                  LAYER_BLUR
                )}
              />
            </Source>
            <Source
              type="vector"
              url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${activeTilesets[2]}`}
            >
              <Layer
                {...ParticleMatterLayer(
                  "ParticleMatterLayer2",
                  LAYER_RADIUS,
                  0,
                  LAYER_BLUR
                )}
              />
            </Source>
            <Source
              type="vector"
              url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${activeTilesets[3]}`}
            >
              <Layer
                {...ParticleMatterLayer(
                  "ParticleMatterLayer3",
                  LAYER_RADIUS,
                  0,
                  LAYER_BLUR
                )}
              />
            </Source>
            <Source
              type="vector"
              url={`mapbox://${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${activeTilesets[4]}`}
            >
              <Layer
                {...ParticleMatterLayer(
                  "ParticleMatterLayer4",
                  LAYER_RADIUS,
                  0,
                  LAYER_BLUR
                )}
              />
            </Source>
          </>
        )}
      </MapGL>
    </main>
  );
}
