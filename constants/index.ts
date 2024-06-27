import type { LngLatBoundsLike } from 'react-map-gl';

export const U_OF_U_DEFAULT_COORDS = {
    lat: 40.7649,
    lon: -111.8421,
}

export const MAP_BOUNDARY: LngLatBoundsLike = [
    [-140, 24], // Southwest coordinates
    [-60, 70] // Northeast coordinates
];

export const TILESET_IDS = ['8qc1eprt', '34y2u5uc', '29euf63c', '4xypovov', 'd2l79qqt', '5h9d0q4k', 'dikpv503', '0mn4ug6q', '6o79lhuu', 'dzol0hae', 'bcai9r53', '5no547qp', '26jrmzsk', 'drlq1w1s', '2xem3olx', '6cmz1al2', '4gb41vgr', '7wdilb01', 'dk5yamze', '1pyv4lto', '41l6e1ep', '3mmgtky9', '7g0vfb27', '00mygjde',
    '4ebm4bbk', 'bxt4bumt', '6hrq2axa', '53gnqjd9', '0vcjdtqx', 'b2mwxltz',
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