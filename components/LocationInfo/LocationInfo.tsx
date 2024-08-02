import { getAirQuality } from '@/functions';
import { faArrowUpFromBracket, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueries, useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { BarLoader } from 'react-spinners';
import './LocationInfo.css';
import { ParticleMatterGraph } from './ParticleMatterGraph/ParticleMatterGraph';

interface LocationProps {
  close: () => void,
  tilesetIDs: string[][],
  latLng: [number, number] | null,
  sliderDateIndex: number,
  sliderTime: number,
  currentTime: Date,
}

export function LocationInfo({ close, latLng, tilesetIDs, currentTime, sliderDateIndex, sliderTime}: LocationProps) {
  const currentHour = currentTime.getMinutes() < 30 ? currentTime.getHours() : currentTime.getHours() + 1
  const { data: locationData, isLoading: loadingLocationData } = useQuery({
      queryKey: [latLng],
      queryFn: async () => {
          const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${latLng![1]}&latitude=${latLng![0]}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
          if (response.ok) {
              const data = await response.json();
              return data;
          }
          return null;
      },
  });
  const graphData = useQueries({
    queries: tilesetIDs.flat().map((id, index) => {
      return {
        queryKey: [`${latLng?.[0]},${latLng?.[1]},${index}`],
        queryFn: async () => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/v4/${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${id}/tilequery/${latLng![1]},${latLng![0]}.json?radius=6000&limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            if (!response.ok) {
              if (response.status === 404) {
                return {
                  x: index,
                  y: 0
                };
              }
            }
            const data = await response.json();
            return {
              x: index,
              y: data.features[0] ? parseFloat(data.features[0].properties.PM25.toFixed(1)) : 0
            };
          }
          catch (error) {
            return {
              x: index,
              y: 0
            };
          }
        }
      };
    }),
    combine: (results) => {
      const data = results.map((result) => result.data);
      const loading = results.some((result) => result.isPending);
      const empty = data.every((entry) => entry === undefined || entry.y === 0);
      return { data, loading, empty };
    },
  });
  const address = (locationData as any)?.features[3]?.properties.full_address;

  return (
    <div className='location-info slide-in'>
        <button className='location-info-close-button' onClick={close}>
            <FontAwesomeIcon icon={faX} className='text-white' />
        </button>
        <div className='location-line mt-24'>
            <BarLoader
                color={'#FFFFFF'}
                loading={(loadingLocationData || graphData.loading)}
                aria-label='Loading Spinner'
                data-testid='loader'
                width={'100%'}
                height={2}
            />
            {(!loadingLocationData && !graphData.loading) && (
                <hr className='location-line-loaded'/>
            )}
        </div>
        <div className='text-white mt-4 ml-3'>
            <h3 className='text-2s font-bold text-white'>{Math.abs(latLng![0]).toFixed(2)}° {latLng![0] > 0 ? 'N' : 'S'}, {Math.abs(latLng![1]).toFixed(2)}° {latLng![1] > 0 ? 'E' : 'W'}</h3>
        </div>
        {address != undefined && (
            <div className={`text-white ml-3 ${address != undefined ? 'mt-3' : ''}`}>
                <h3 className='text-2s font-bold text-white'>{address}</h3>
            </div>
        )}
        <div className='text-white mt-3 ml-3'>
          <h3 className='text-2s font-bold text-white'>PM-2.5: {graphData.data[24 * sliderDateIndex + sliderTime]?.y === 0 || graphData.data[24 * sliderDateIndex + sliderTime] === undefined ? "---" : graphData.data[24 * sliderDateIndex + sliderTime]?.y}</h3>
        </div>
        <div className='text-white mt-3 ml-3'>
          <h3 className='text-2s font-bold text-white'>Air Quality: {graphData.data[24 * sliderDateIndex + sliderTime]?.y === 0 || graphData.data[24 * sliderDateIndex + sliderTime] === undefined ? "No Smoke Forecasted" : getAirQuality(graphData.data[24 * sliderDateIndex + sliderTime]?.y)}</h3>
        </div>
        <div className='mt-4 ml-3'>
          <ParticleMatterGraph graphData={graphData} currentTime={currentTime} />
        </div>
        <button className='location-info-share-button' onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard.', {
              style: {
                fontSize: '12px',
                padding: '8px 8px',
              },
              iconTheme: {
                primary: '#000000',
                secondary: '#FFFFFF',
              },
            });
          } catch (err) {
            toast.error('Failed to copy link to clipboard.', {
              style: {
                fontSize: '12px',
                padding: '8px 8px',
              },
            });
          }
        }}>
            <FontAwesomeIcon icon={faArrowUpFromBracket} className='text-white' />
        </button>
        <Toaster position='bottom-center'/>
    </div>
  );
}
