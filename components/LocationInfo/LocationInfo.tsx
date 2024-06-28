import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ParticleMatterGraph } from '../ParticleMatterGraph/ParticleMatterGraph';
import './LocationInfo.css';

interface LocationProps {
    close: () => void,
    latLng: [number, number] | null,
    currentPM25: number,
    currentTime: number,
}

export function LocationInfo({ close, latLng, currentPM25, currentTime}: LocationProps) {
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${latLng![1]}&latitude=${latLng![0]}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLocationData(data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [latLng]);

    function getAirQuality(pm25: number) {
        if (pm25 <= 0) {
            return 'Healthy';
        }
        else if (0 < pm25 && pm25 <= 20) { // Green
            return 'Good';
        }
        else if (20 < pm25 && pm25 <= 35) { // Yellow
            return 'Moderate';
        }
        else if (35 < pm25 && pm25 <= 80) { // Orange
            return 'Unhealthy for Sensitive Groups';
        }
        else if (80 < pm25 && pm25 <= 160) { // Red
            return 'Unhealthy for Everyone';
        }
        else if (160 < pm25 && pm25 <= 220) { // Purple
            return 'Very Unhealthy';
        }
        else if (220 < pm25) { // Maroon
            return 'Hazardous';
        }
    }

    if (!loading && error == null) {
        const address = (locationData as any)?.features[3]?.properties.full_address;
        
        return (
            <div className='location-info slide-in'>
                <button className='location-info-close-button' onClick={close}>
                    <FontAwesomeIcon icon={faX} className='text-white' />
                </button>
                <hr className='location-line mt-24' />
                <div className='ml-8 mr-3 flex min-h-screen flex-col mt-1'>
                    <div className='text-white mt-4'>
                        <h3 className='text-2s font-bold text-white'>{latLng![0].toFixed(6)}, {latLng![1].toFixed(6)}</h3>
                    </div>
                    {address != undefined && (
                        <div className={`text-white ${address != undefined ? 'mt-3' : ''}`}>
                            <h3 className='text-2s font-bold text-white'>{address}</h3>
                        </div>
                    )}
                    <div className='text-white mt-3'>
                        <h3 className='text-2s font-bold text-white'>PM 2.5: {currentPM25 == 0 ? 0 : currentPM25.toFixed(6)}</h3>
                    </div>
                    <div className='text-white mt-3'>
                        <h3 className='text-2s font-bold text-white'>Air Quality: {getAirQuality(currentPM25)}</h3>
                    </div>
                    <div className='mt-4'>
                        <ParticleMatterGraph latLng={latLng!} currentPM25={currentPM25} currentTime={currentTime} />
                    </div>
                </div>
            </div>
        );
    }
}