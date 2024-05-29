import { useEffect, useState } from 'react';

const useUserLocation = () => {
  const [userLocation, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userLocationError, setError] = useState<string | null>(null);
  const [userLocationLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { userLocation, userLocationError, userLocationLoading };
};

export default useUserLocation;
