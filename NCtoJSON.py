import netCDF4 as nc
import json

def nc_to_json(nc_file, json_file):
    # Open the NetCDF file
    ds = nc.Dataset(nc_file, 'r')

    # Extract longitude, latitude, and PM25 data
    lon = ds.variables['lon'][:]
    lat = ds.variables['lat'][:]
    pm25 = ds.variables['PM25'][:]

    data_list = []

    # Iterate over the lon, lat, and PM25 arrays and combine them into a list of dictionaries
    for i in range(len(lon)):
        for j in range(len(lat)):
            data_point = {
                'lon': float(lon[i]),      # Convert to native Python float
                'lat': float(lat[j]),      # Convert to native Python float
                'PM25': float(pm25[j, i])  # Convert to native Python float
            }
            # Filter PM25 values between 10 and 200
            if float(pm25[j, i]) >= 10 and float(pm25[j, i]) <= 200:
                data_list.append(data_point)

    # Write the list to a JSON file
    with open(json_file, 'w') as f:
        json.dump(data_list, f, indent=4)

    # Close the NetCDF file
    ds.close()

nc_file = '2024-05-19_05.nc'
json_file = 'output.json'
nc_to_json(nc_file, json_file)