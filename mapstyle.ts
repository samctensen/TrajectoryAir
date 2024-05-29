import type { HeatmapLayer } from 'react-map-gl';

const MAX_ZOOM_LEVEL = 9;

export const heatmapLayer: HeatmapLayer = {
  id: 'heatmap',
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on PM25
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'PM25'],
        0, 0,
        25, 0.125,
        40, 0.2,
        60, 0.3,
        80, 0.4,
        100, 0.5,
        120, 0.6,
        140, 0.7,
        160, 0.8,
        180, 0.9,
        200, 1
      ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
        0, 'rgba(0, 0, 0, 0)', 
        0.125, 'rgb(254, 243, 231)',    
        0.2, 'rgb(251, 234, 212)',
        0.3, 'rgb(248, 217, 179)',
        0.4, 'rgb(246, 194, 137)',
        0.5, 'rgb(243, 166, 96)',
        0.6, 'rgb(239, 141, 62)',
        0.7, 'rgb(227, 112, 36)',
        0.8, 'rgb(207, 86, 25)',
        0.9, 'rgb(169, 69, 18)',
        1.0, 'rgb(135, 53, 14)'     
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};