import type { CircleLayer } from 'react-map-gl';

export const ParticleMatterLayer: CircleLayer = {
  "id": "2024-05-19-05-5r6pvx",
      "type": "circle",
      "paint": {
        "circle-color": [
          "case",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            1
          ],
          "rgb(255, 255, 255)",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            6
          ],
          "#00e400",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            23.75
          ],
          "#ffff00",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            45.5
          ],
          "#ff7e00",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            103
          ],
          "#ff0000",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            200.5
          ],
          "#8f3f97",
          [
            "<=",
            [
              "get",
              "PM25"
            ],
            0
          ],
          "#000000",
          "#7e0023"
        ],
        "circle-stroke-color": "#ffffff",
        "circle-radius": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0, 1,
          1, 1,
          2, 1,
          3, 1,
          4, 1,
          5, 3,
          6, 10,
          7, 10,
          8, 20,
          9, 30,
          10, 70
        ],
        "circle-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          0, 1,
          10, 0.1
        ],
        "circle-blur": 0.8
      },
};