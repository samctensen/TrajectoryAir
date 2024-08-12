"use client";
import { negativeModulo } from "@/functions";
import { Tileset } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
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

function getDaysTilesets(
  date: Date,
  timezone: number,
  mapboxTilesets: string[]
): string[] | null {
  let newDate = new Date(date.getTime());
  let nextDay = new Date(newDate.getDate() + 1);
  const ids = [];
  for (let index = 0; index < 24; index++) {
    if (index + timezone > 23 && newDate.getTime() !== nextDay.getTime()) {
      newDate.setDate(nextDay.getTime());
    }
    let dateString = newDate.toISOString().split("T")[0] + "_";
    dateString =
      dateString + ((index + timezone) % 24).toString().padStart(2, "0");
    if (mapboxTilesets.includes(dateString)) {
      ids.push(dateString);
    }
  }
  if (ids.length !== 0) {
    return ids;
  }
  return null;
}

export const TilesetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [allTilesetIDs, setAllTilesetIDs] = useState<string[][]>([]);
  const [activeTilesets, setTileset] = useState<string[]>([]);
  const { userTimezone, userTime, userLocationLoading } = useLocation();
  const sliderTime =
    userTime.getMinutes() < 30 ? userTime.getHours() : userTime.getHours() + 1;
  const { isLoading } = useQuery({
    queryKey: ["allSets"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.mapbox.com/tilesets/v1/${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ALL_TOKEN}&limit=500&sortby=modified`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const JSON = await response.json();
      const tilesets = JSON as Tileset[];
      const tilesetNames = tilesets.map((tileset) => tileset.name);

      // Reset allTilesetIDs to avoid accumulation
      const newAllTilesetIDs: string[][] = [];
      for (let index = 0; index < 5; index++) {
        let currentDay = new Date(); // Clone today's date
        currentDay.setDate(new Date().getDate() + index); // Move forward by index days
        const currentTilesets = getDaysTilesets(
          currentDay,
          userTimezone,
          tilesetNames
        );
        if (currentTilesets !== null) {
          newAllTilesetIDs.push(currentTilesets);
        }
      }

      // Limit to only 5 arrays
      if (newAllTilesetIDs.length > 5) {
        newAllTilesetIDs.splice(5);
      }

      setAllTilesetIDs(newAllTilesetIDs);

      setTileset([
        newAllTilesetIDs[0][negativeModulo(sliderTime - 2, 24)],
        newAllTilesetIDs[0][negativeModulo(sliderTime - 1, 24)],
        newAllTilesetIDs[0][sliderTime % 24],
        newAllTilesetIDs[0][(sliderTime + 1) % 24],
        newAllTilesetIDs[0][(sliderTime + 2) % 24],
      ]);

      return tilesets;
    },
  });

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
