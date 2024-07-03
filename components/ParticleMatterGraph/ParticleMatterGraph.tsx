import { TILESET_IDS } from "@/constants";
import { getColor } from "@/functions";
import { useQueries } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

interface GraphProps {
    latLng: [number, number],
    currentPM25: number,
    currentTime: number
}

export const ParticleMatterGraph = ({ latLng, currentPM25, currentTime }: GraphProps)  => {

    const graphData = useQueries({
      queries: TILESET_IDS.map((id, index) => {
        return {
          queryKey: [`${latLng?.[0]},${latLng?.[1]},${index}`],
          queryFn: async () => {
            const response = await fetch(
              `https://api.mapbox.com/v4/${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${id}/tilequery/${latLng[1]},${latLng[0]}.json?radius=6000&limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );            
            const data =  await response.json();
            return {
                name: index,
                "PM-2.5": data.features[0] ? parseFloat(data.features[0].properties.PM25.toFixed(1)) : 0
            }
          }
        }
      }),
      combine: (results) => {
        return {
          data: results.map((result) => result.data),
          pending: results.some((result) => result.isPending),
        }
      },
    });
    const labelMap: { [key: number]: string } = {
      12: "Good",
      23: "Moderate",
      45: "Unhealthy",
      250: "Hazardous"
    };
    const formatYAxisLabel = (value: number) => labelMap[value];

    if (graphData.pending) {
        return (
            <BarLoader
                color={"#FFFFFF"}
                loading={graphData.pending}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        );
    }

    else {
      const getMaxPM25Value = () => {
        if (!graphData || graphData.data.length === 0) return 0;
        const pm25Values = graphData.data.map(entry => entry ? entry["PM-2.5"] : 0);
        return Math.max(...pm25Values);
      };
      const ticks = () => {
        const maxPM25Value = getMaxPM25Value();
        if (maxPM25Value < 20) return [12, 23];
        if (maxPM25Value < 70) return [12, 23, 45];
        if (maxPM25Value < 90) return [23, 45, 250];
        if (maxPM25Value < 130) return [45, 250];
        return [12, 23, 45, 250];
      };
      return (
        <LineChart
          width={280}
          height={200}
          data={graphData.data}
          margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              {graphData.data.map((entry, index) => (
                <stop
                  key={index}
                  offset={`${(index / (graphData.data.length - 1)) * 100}%`}
                  stopColor={entry ? getColor(entry["PM-2.5"]) : ""}
                />
              ))}
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#FFFFFF"/>
          <YAxis 
            stroke="#FFFFFF" 
            ticks={ticks()}
            tickFormatter={formatYAxisLabel}
            fontSize={12}
          />
          <Tooltip/>
          <Line 
            type="monotone" 
            dataKey="PM-2.5" 
            stroke="url(#gradient)" 
            dot={false} 
            strokeWidth={3} 
            activeDot={{fill: "transparent"}}
          />
        </LineChart>
      )
    }
}