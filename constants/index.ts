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

export const MILLISECONDS_IN_A_DAY = 86400000;

export const LAYER_OPACITY = 0.1;

export const LAYER_RADIUS: mapboxgl.Expression = 
[
    'interpolate',
    [
      'linear'
    ],
    [
      'zoom'
    ],
    2, 1,
    3, 2,
    4, 8,
    5, 10,
    6, 15,
    7, 25,
    8, 60,
    9, 100,
    10, 160,
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
    2, 0.2,
    3, 0.3,
    4, 0.4,
    5, 0.5,
    6, 0.6,
    7, 0.7,
    8, 0.8,
    9, 0.9,
    10, 1,
]