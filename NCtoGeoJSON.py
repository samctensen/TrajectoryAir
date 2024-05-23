import netCDF4 as nc
import json

def nc_to_json(nc_file, json_file):
    # Open the NetCDF file
    ds = nc.Dataset(nc_file, 'r')

    # Extract longitude, latitude, and PM25 data
    lon = ds.variables['lon'][:]
    lat = ds.variables['lat'][:]
    pm25 = ds.variables['PM25'][:]

    features = []
    feature_id = 1
    # Iterate over the lon, lat, and PM25 arrays and combine them into features
    for i in range(len(lon)):
        for j in range(len(lat)):
            pm25_value = float(pm25[j, i])
            # Filter PM25 values between 10 and 200
            if 10 <= pm25_value <= 200:
                feature = {
                    "type": "Feature",
                    "properties": {
                        "id": str(feature_id),
                        "PM25": pm25_value
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [float(lon[i]), float(lat[j]), 0]
                    }
                }
                features.append(feature)
                feature_id += 1

    # Create the final GeoJSON structure
    geojson_header = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        }
    }

    # Start writing the JSON file
    with open(json_file, 'w') as f:
        f.write('{\n')
        f.write('"type": "FeatureCollection",\n')
        f.write('"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },\n')
        f.write('"features": [\n')

        # Write each feature in one line
        for idx, feature in enumerate(features):
            feature_str = json.dumps(feature)
            if idx < len(features) - 1:
                feature_str += ','
            f.write(feature_str + '\n')

        # End the JSON file
        f.write(']\n')
        f.write('}\n')

    # Close the NetCDF file
    ds.close()

# Example usage
nc_file = '2024-05-19_05.nc'
json_file = '2024-05-19_05.geojson'
nc_to_json(nc_file, json_file)
