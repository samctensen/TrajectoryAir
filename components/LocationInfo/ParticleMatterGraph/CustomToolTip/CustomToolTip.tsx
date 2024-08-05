import { TooltipProps } from "recharts";
import "./CustomToolTip.css";

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const x = payload[0].payload.x % 23;
    const y = payload[0].payload.y;

    return (
      <div className="custom-tooltip">
        <h1 className="text-black ml-2 mr-2">{`PM-2.5: ${y}`}</h1>
        <h1 className="text-black ml-2 mr-2">{`${x % 12 === 0 ? 12 : x % 12} ${
          x >= 12 ? "PM" : "AM"
        }`}</h1>
      </div>
    );
  }
  return null;
};
