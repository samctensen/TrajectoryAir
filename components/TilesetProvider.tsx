"use client";
import { negativeModulo } from "@/functions"; // Assuming this is the correct path to your utility function
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./LocationProvider";

const TilesetContext = createContext<{
  allTilesetIDs: string[][];
  activeTilesets: string[];
  setActiveTilesets: (newActiveSet: string[]) => void;
  tilesetsLoading: boolean;
}>({
  allTilesetIDs: [],
  activeTilesets: [],
  setActiveTilesets: () => null,
  tilesetsLoading: true,
});

export function useTilesets() {
  return useContext(TilesetContext);
}

function getAllTilesets(timezone: number): string[][] {
  const listOfTilesets: string[][] = [];
  for (let index = 0; index < 5; index++) {
    let currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + index);
    const currentTilesets = getDaysTilesets(currentDay, timezone);
    listOfTilesets.push(currentTilesets);
  }
  return listOfTilesets;
}

function getDaysTilesets(date: Date, timezone: number): string[] {
  let newDate = new Date(date.getTime());
  let nextDay = new Date(newDate.getTime());
  nextDay.setDate(newDate.getDate() + 1);
  const ids = [];
  for (let index = 0; index < 24; index++) {
    if (index + timezone > 23 && newDate.getTime() !== nextDay.getTime()) {
      newDate.setDate(nextDay.getDate());
    }
    let dateString = newDate.toISOString().split("T")[0] + "_";
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
        allTilesetIDs,
        activeTilesets,
        tilesetsLoading: isLoading && userLocationLoading,
        setActiveTilesets: (newSet: string[]) => {
          setTileset(newSet);
        },
      }}
    >
      {children}
    </TilesetContext.Provider>
  );
};
