import { getColor, getNextDays } from '@/functions';
import { Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomTooltip } from './CustomToolTip/CustomToolTip';

interface GraphProps {
  graphData: {
    data: ({
        x: number;
        y: number;
    } | undefined)[];
    loading: boolean;
    empty: boolean;
  }
  currentTime: Date
}

export const ParticleMatterGraph = ({ graphData, currentTime }: GraphProps)  => {
  const currentHour = currentTime.getMinutes() < 30 ? currentTime.getHours() : currentTime.getHours() + 1
  const getMaxPM25Value = () => {
    if (!graphData || graphData.data.length === 0) return 0;
    const pm25Values = graphData.data.map(entry => entry ? entry.y : 0);
    return Math.max(...pm25Values);
  };
  const yAxisTicks = () => {
    const maxPM25Value = getMaxPM25Value();
    if (maxPM25Value < 20) return [12, 23];
    if (maxPM25Value < 70) return [12, 23, 45];
    if (maxPM25Value < 90) return [23, 45, 250];
    if (maxPM25Value < 130) return [45, 250];
    return [12, 23, 45, 250];
  };
  const yAxisLabelMap: { [key: number]: string } = {
    12: 'Good',
    23: 'Moderate',
    45: 'Unhealthy',
    250: 'Hazardous'
  };
  const formattedYAxisLabel = (value: number) => yAxisLabelMap[value];

  const dates = getNextDays();
  const xAxisTicks = [24, 48, 72, 96];
  const xAxisLabelMap: { [key: number]: string } = {
    24: `${dates[1].getMonth() + 1}/${dates[1].getDate()}`,
    48: `${dates[2].getMonth() + 1}/${dates[2].getDate()}`,
    72: `${dates[3].getMonth() + 1}/${dates[3].getDate()}`,
    96: `${dates[4].getMonth() + 1}/${dates[4].getDate()}`,
  };
  const formattedXAxisLabel = (value: number) => xAxisLabelMap[value];
  const gradientStops = () => {
    return graphData.data.map((entry, index) => (
      <stop
        key={index}
        offset={`${(index / (graphData.data.length - 1)) * 100}%`}
        stopColor={getColor(entry?.y)}
      />
    ));
  };
  if (!graphData.empty && !graphData.loading) {
    return (
      <LineChart
        width={280}
        height={200}
        data={graphData.data}
        margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
      >
       <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            {gradientStops()}
          </linearGradient>
        </defs>
        <Line 
          type='monotone' 
          dataKey='y' 
          stroke='url(#gradient)' 
          dot={false} 
          strokeWidth={3} 
          activeDot={{fill: 'transparent'}}
        />
        <XAxis
          dataKey='x'
          stroke='#FFFFFF'
          ticks={xAxisTicks}
          tickFormatter={formattedXAxisLabel}
          interval={0}
          fontSize={12}
        />
        <YAxis
          dataKey='y'
          stroke='#FFFFFF' 
          ticks={yAxisTicks()}
          tickFormatter={formattedYAxisLabel}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={currentHour} stroke='gray'/>
      </LineChart>
    )
  }
}
