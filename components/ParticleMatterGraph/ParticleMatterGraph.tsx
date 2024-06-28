import { TILESET_IDS } from "@/constants";
import { useQueries } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";
import { Line, LineChart, XAxis, YAxis } from "recharts";

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
                amt: data.features[0] ? data.features[0].properties.PM25 : 0,
                pm25: data.features[0] ? data.features[0].properties.PM25 : 0
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
                width={200}
                height={100}
                data={graphData.data}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="pm25" stroke="#8884d8" dot={false}/>
            </LineChart>
        )
    }

}