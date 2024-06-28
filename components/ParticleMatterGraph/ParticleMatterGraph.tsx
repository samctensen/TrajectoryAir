import { TILESET_IDS } from "@/constants";
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

    const getColor = (value: number) => {
      if (value <= 6) return '#00e400';
      if (value <= 23.75) return '#ffff00';
      if (value <= 45.5) return '#ff7e00'
      if (value <= 103) return '#ff0000';
      if (value <= 200.5) return '#8f3f97';
      return '#7e0023';
    };

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
        return (
            <LineChart
                width={280}
                height={200}
                data={graphData.data}
                margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  {graphData.data.map((entry, index) => (
                    <stop
                      key={index}
                      offset={`${(index / (graphData.data.length - 1)) * 100}%`}
                      stopColor={getColor(entry!["PM-2.5"])}
                    />
                  ))}
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#FFFFFF"/>
              <YAxis stroke="#FFFFFF"/>
              <Tooltip/>
              <Line type="monotone" dataKey="PM-2.5" stroke="url(#gradient)" dot={false} strokeWidth={3} activeDot={{fill: "transparent"}}/>
            </LineChart>
        )
    }

}