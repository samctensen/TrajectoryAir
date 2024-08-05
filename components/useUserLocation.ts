import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [userLocation, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocationError, setError] = useState<string | null>(null);
  const [userLocationLoading, setLoading] = useState(true);
  const [userTime] = useState(new Date());
  const [userTimezone, setTimezone] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
    const offsetSign = offsetInMinutes < 0 ? -1 : 1;
    setTimezone(offsetSign * offsetHours);

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

  return {
    userLocation,
    userLocationError,
    userLocationLoading,
    userTime,
    userTimezone,
  };
};

export default useUserLocation;
