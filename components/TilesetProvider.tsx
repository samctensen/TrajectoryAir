"use client";
import { negativeModulo } from "@/functions"; // Assuming this is the correct path to your utility function
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./LocationProvider";

const TilesetContext = createContext<{
  cmaqEnabled: boolean;
  allTilesetIDs: string[][];
  activeTilesets: string[];
  setActiveTilesets: (newActiveSet: string[]) => void;
  setCMAQEnabled: () => void;
  tilesetsLoading: boolean;
}>({
  cmaqEnabled: false,
  allTilesetIDs: [],
  activeTilesets: [],
  setActiveTilesets: () => null,
  setCMAQEnabled: () => null,
  tilesetsLoading: true,
});

export function useTilesets() {
  return useContext(TilesetContext);
}

function getAllTilesets(timezone: number): string[][] {
  const listOfTilesets: string[][] = [];
  for (let index = 0; index < 4; index++) {
    let currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + index);
    const currentTilesets = getDaysTilesets(currentDay, timezone, index);
    if (currentTilesets) {
      listOfTilesets.push(currentTilesets);
    }
  }
  return listOfTilesets;
}

function getDaysTilesets(date: Date, timezone: number, dayIndex: number): string[] {
  let newDate = new Date(date.getTime());
  let nextDay = new Date(newDate.getTime());
  nextDay.setDate(newDate.getDate() + 1);
  const ids = [];
  for (let index = 0; index <  (dayIndex !== 3 ? 24 : 24 - timezone + 1); index++) {
    if (index + timezone > 23 && newDate.getTime() !== nextDay.getTime()) {
      newDate.setDate(nextDay.getDate());
      dayIndex++;
    }
    if (dayIndex > 3) {
      return ids;
    }
    //let dateString = newDate.toISOString().split("T")[0] + "_";
    let dateString = dayIndex + "_";
    dateString =
      dateString + ((index + timezone) % 24).toString().padStart(2, "0");
    ids.push(dateString);
  }
  return ids;
}

export const TilesetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cmaqEnabled, setCmaqEnabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [allTilesetIDs, setAllTilesetIDs] = useState<string[][]>([]);
  const [activeTilesets, setTileset] = useState<string[]>([]);
  const { userTimezone, userTime, userLocationLoading } = useLocation();

  useEffect(() => {
    const sliderTime =
      userTime.getMinutes() < 30
        ? userTime.getHours()
        : userTime.getHours() + 1;
    const allTilesets = getAllTilesets(userTimezone);
    setAllTilesetIDs(allTilesets);
    setTileset([
      allTilesets[0][negativeModulo(sliderTime - 2, 24)],
      allTilesets[0][negativeModulo(sliderTime - 1, 24)],
      allTilesets[0][sliderTime % 24],
      allTilesets[0][(sliderTime + 1) % 24],
      allTilesets[0][(sliderTime + 2) % 24],
    ]);
    setLoading(false);
  }, [userTimezone, userTime]);

  return (
    <TilesetContext.Provider
      value={{
        cmaqEnabled,
        allTilesetIDs,
        activeTilesets,
        tilesetsLoading: isLoading && userLocationLoading,
        setActiveTilesets: (newSet: string[]) => {
          setTileset(newSet);
        },
        setCMAQEnabled: () => {
          if (cmaqEnabled) {
            setCmaqEnabled(false);
            const allTATilesetIDs = allTilesetIDs.map((day) => day.map(id => id.slice(0, -5)));
            setAllTilesetIDs(allTATilesetIDs);
            const activeTATilesets = activeTilesets.map(id => id.slice(0, -5));
            setTileset(activeTATilesets);
          }
          else {
            setCmaqEnabled(true);
            const allCMAQTilesetIDs = allTilesetIDs.map((day) => day.map(id => id + "_CMAQ"));
            setAllTilesetIDs(allCMAQTilesetIDs);
            const activeCMAQTilesets = activeTilesets.map(id => id + "_CMAQ");
            setTileset(activeCMAQTilesets);
          }
        },
      }}
    >
      {children}
    </TilesetContext.Provider>
  );
};
