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

export const LAYER_OPACITY: mapboxgl.Expression = 
[
    'interpolate',
    [
      'linear'
    ],
    [
      'zoom'
    ],
    10, 0.07,
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
    6, 30,
    7, 50,
    8, 75,
    9, 100,
    10, 150,
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