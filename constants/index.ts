import type { LngLatBoundsLike } from 'react-map-gl';

export const U_OF_U_DEFAULT_COORDS = {
    lat: 40.7649,
    lon: -111.8421,
}

export const MAP_BOUNDARY: LngLatBoundsLike = [
    [-140, 24], // Southwest coordinates
    [-60, 70] // Northeast coordinates
];

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const LAYER_OPACITY: mapboxgl.Expression = 
[
    'interpolate',
    [
      'linear'
    ],
    [
      'zoom'
    ],
    2, 0.01,
    3, 0.018,
    4, 0.018,
    6, 0.04,
    10, 0.1,
]

export const LAYER_RADIUS: mapboxgl.Expression = 
[
    'interpolate',
    [
      'linear'
    ],
    [
      'zoom'
    ],
    2, 2,
    3, 3,
    4, 8,
    6, 15,
    7, 20,
    8, 25,
    9, 50,
    10, 130,
]

export const LAYER_BLUR: mapboxgl.Expression = 
[
    'interpolate',
    [
      'linear'
    ],
    [
      'zoom'
    ],
    2, 0,
    4, 0,
    6, 0.2,
    7, 0.6,
    8, 0.7,
    9, 0.8,
    10, 0.9,
]