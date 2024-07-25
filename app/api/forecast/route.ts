import { getAllTilesets } from "@/functions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')
  const timezone = searchParams.get('timezone')
  const timezoneInt = timezone ? parseInt(timezone) : 0;
  
  
  if (!latitude && longitude) {
    return Response.json({ error: 'Missing required parameter: latitude' }, { status: 422 });
  }
  else if (!longitude && latitude) {
    return Response.json({ error: 'Missing required parameter: longitude' }, { status: 422 });
  }
  else if (!latitude && !longitude) {
    return Response.json({ error: 'Missing required parameters: latitude, longitude' }, { status: 422 });
  }
  else if (latitude && longitude) {
    if (isNaN(+latitude) && !isNaN(+longitude)) {
      return Response.json({ error: 'Latitude must be a valid number' }, { status: 422 });
    }
    else if (!isNaN(+latitude) && isNaN(+longitude)) {
      return Response.json({ error: 'Longitude must be a valid number' }, { status: 422 });
    }
    else if (isNaN(+latitude) && isNaN(+longitude)) {
      return Response.json({ error: 'Latitude and Longitude must be valid numbers' }, { status: 422 });
    }
    try {
      const allTilesetIDs: string[] = getAllTilesets(timezoneInt).flat();
      const promises = allTilesetIDs.map(async id => {
        const date = new Date(`${id.substring(0,10)}T${id.substring(11)}:00:00Z`).toISOString();
        try {
          const response = await fetch(
            `https://api.mapbox.com/v4/${process.env.NEXT_PUBLIC_MAPBOX_USERNAME}.${id}/tilequery/${longitude},${latitude}.json?radius=6000&limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
          );
          if (!response.ok) {
            if (response.status === 404) {
              return { date: date, "PM2.5": 0 };
            }
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          return {
            date: date,
            "PM2.5": data.features[0] ? parseFloat(data.features[0].properties.PM25.toFixed(1)) : 0,
          };
        } catch (error) {
          return { date: date, "PM2.5": 0 };
        }
      });
      const forecast = await Promise.all(promises);
      return Response.json({ 
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        forecast 
      }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}