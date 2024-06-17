import { faHeadSideCough, faMap, faMapPin, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './LocationInfo.css';

export function LocationInfo({ close, latLng, pm25 }: { close: () => void, latLng: [number, number] | null, pm25: number}) {
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

    if (!loading && error == null) {
        const address = (locationData as any)?.features[3]?.properties.full_address;
        
        return (
            <div className='location-info slide-in'>
                <button className='location-info-close-button' onClick={close}>
                    <FontAwesomeIcon icon={faX} className='text-white' />
                </button>
                <div className='ml-8 mr-3 flex min-h-screen flex-col mt-10'>
                    <div className='text-white mt-12'>
                        <h3 className='text-2s font-bold text-white'>
                            <FontAwesomeIcon icon={faMapPin} color='#D85140' className='mr-2'/>
                            {latLng![0].toFixed(6)}, {latLng![1].toFixed(6)}
                        </h3>
                    </div>
                    {address != undefined && (
                        <div className={`text-white ${address != undefined ? 'mt-3' : ''}`}>
                            <h3 className='text-2s font-bold text-white'>
                                <FontAwesomeIcon icon={faMap} color='#64B562' className='mr-2'/>
                                {address}
                            </h3>
                        </div>
                    )}
                    <div className='text-white mt-3'>
                        <h3 className='text-2s font-bold text-white'>
                            <FontAwesomeIcon icon={faHeadSideCough} color='#F8D662' className='mr-2'/>
                            PM 2.5: {pm25 == 0 ? 0 : pm25.toFixed(6)}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}