import type { HeatmapLayer } from 'react-map-gl';

export const HeatMap: HeatmapLayer = {
  id: 'heatmap',
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on PM25
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'PM25'],
        0, 0,
        1, 0.00333333,
        6, 0.02,
        23.75, 0.07916667,
        45.5, 0.15166667,
        103, 0.34333333,
        200.5, 0.66833333,
        300, 1
      ],
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 1,
        9, 1 // Keep intensity constant to avoid color changes on zoom
      ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
        0, 'rgba(0, 0, 0, 0)', // transparent
        0.02, 'rgb(0, 228, 0)', // green
        0.07916667, 'rgb(255, 255, 0)', // yellow
        0.15166667, 'rgb(255, 126, 0)', // orange
        0.34333333, 'rgb(255, 0, 0)', // red
        0.66833333, 'rgb(143, 63, 151)', // purple
        1, 'rgb(126, 0, 35)', // brown  
    ],
    // Set heatmap-radius to a constant value to maintain detail
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      1, 6, // radius at zoom level 0
      9, 1 // radius at zoom level 9
    ],
    // Transition from heatmap to circle layer by zoom level
  }
};