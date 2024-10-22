import { Switch } from "@mui/material";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useTilesets } from "../TilesetProvider";
import "./CMAQToggle.css";

export const CMAQToggle = () => {
  const {cmaqEnabled, setCMAQEnabled} = useTilesets();

  return (
    <div className="cmaq-toggle-container">
      <h1 className="text-1l font-bold text-white">
        Trajectory Air
      </h1>
      <Switch
        checked={cmaqEnabled}
        onChange={() => setCMAQEnabled()}
      />
      <h1 className="text-1l font-bold text-white">
        CMAQ
      </h1>
    </div>
  );
};
