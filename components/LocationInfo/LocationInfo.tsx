import { getAirQuality } from '@/functions';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BarLoader } from 'react-spinners';
import './LocationInfo.css';
import { ParticleMatterGraph } from './ParticleMatterGraph/ParticleMatterGraph';

interface LocationProps {
    close: () => void,
    latLng: [number, number] | null,
    currentPM25: number,
    tilesetIDs: string[][],
    currentTime: Date,
}

export function LocationInfo({ close, latLng, currentPM25, tilesetIDs, currentTime}: LocationProps) {
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
              const response = await fetch(
                `https://api.mapbox.com/v4/${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${id}/tilequery/${latLng![1]},${latLng![0]}.json?radius=6000&limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
              );            
              const data =  await response.json();
              return {
                x: index,
                y: data.features[0] ? parseFloat(data.features[0].properties.PM25.toFixed(1)) : 0
              }
            }
          }
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
                <h3 className='text-2s font-bold text-white'>PM-2.5: {currentPM25 == 0 ? '---' : currentPM25.toFixed(1)}</h3>
            </div>
            <div className='text-white mt-3 ml-3'>
                <h3 className='text-2s font-bold text-white'>Air Quality: {currentPM25 == 0 ? 'No Smoke Forecasted' : getAirQuality(currentPM25)}</h3>
            </div>
            <div className='mt-4 ml-3'>
                <ParticleMatterGraph graphData={graphData} currentTime={currentTime} />
            </div>
        </div>
    );
}
