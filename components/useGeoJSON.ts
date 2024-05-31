import { useEffect, useState } from 'react';

const useGeoJSON = (url: string) => {
  const [geoJSONData, setData] = useState(null);
  const [geoJSONLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching the GeoJSON data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const setGeoJSONData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching the GeoJSON data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { geoJSONData, geoJSONLoading, setGeoJSONData };
};

export default useGeoJSON;