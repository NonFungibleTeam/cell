<template lang="pug">
  .shape(:class="[shapeID]")
</template>

<script>
import Vue from "vue";
import { SVG } from "@svgdotjs/svg.js";
import cellUtils from "@/mixins/cellUtils";

export default Vue.extend({
  name: "Cell",
  mixins: [cellUtils],
  props: ["id", "mass", "features"],
  computed: {
    shapeID() {
      return "shape-" + this.id;
    },
    wave() {
      //return this.mergeWaves(this.features.body.waves.map(i => this.waves[i]));
      return this.waves[this.features.body.waves[0]].map(
        s => s / (this.bitDepthMax - 1)
      );
    },
    gradientStops() {
      return [
        { offset: 0.1, color: this.features.body.gradient[0] },
        { offset: 0.5, color: this.features.body.gradient[1] },
        { offset: 0.9, color: this.features.body.gradient[2] }
      ];
    }
  },
  data: () => ({
    tao: 2 * Math.PI,
    diameter: 300,
    margin: 10,
    smoothing: 0.2,
    bitDepthMax: 2 ** 5,
    preserve: 0.6,
    waves: [
      [31, 23, 15, 7, 3, 0, 3, 7, 15, 23],
      [0, 7, 15, 23, 31, 23, 15, 7],
      [0, 3, 7, 15, 23, 31, 0],
      [31, 22, 14, 8, 16, 7, 16, 4, 32, 8, 22, 29],
      [31, 31, 0, 0, 31, 31, 0, 0],
      [0, 31, 0, 15],
      [0, 31],
      [0, 0, 0, 31]
    ],
    locations: {
      mitochondria: [
        [-30, 35, 35],
        [-10, -20, 0],
        [80, -20, 158],
        [75, 65, 287],
        [-25, -15, 187],
        [-15, 75, 77]
      ],
      chloroplasts: [
        [50, -45, 145],
        [-35, -3, 95],
        [48, 73, 277],
        [85, 39, 13]
      ],
      lisosomes: [
        [80, 10, 23],
        [-40, -30, 312]
      ],
      ribosomes: [
        [-12, 54, 285],
        [-32, 20, 85],
        [75, -32, 165],
        [70, -5, 57]
      ]
    }
  }),
  mounted() {
    this.drawCell(
      this.wave,
      this.level(this.mass),
      "." + this.shapeID,
      this.diameter,
      this.diameter
    );
  },
  methods: {
    drawCell(waveform, count, target, width, height) {
      // draw, style and position the SVG path
      const draw = SVG()
        .addTo(target)
        .size(width + this.margin * 2, height + this.margin * 2);

      // plot shape from wave
      const shape = this.plotShape(
        this.diameter,
        waveform,
        count,
        this.preserve
      );

      // center varaible sized body
      const [xRange, yRange] = shape.reduce(
        function(result, cords) {
          const [x, y] = cords;
          const [lX, lY] = result;
          return [
            [lX[0] < x ? lX[0] : x, lX[1] > x ? lX[1] : x],
            [lY[0] < y ? lY[0] : y, lY[1] > y ? lY[1] : y]
          ];
        },
        [
          [0, 0],
          [0, 0]
        ]
      );
      const [minX, maxX] = xRange;
      const [minY, maxY] = yRange;
      const w = maxX - minX;
      const h = maxY - minY;

      // gradient
      const gradient = draw.gradient(
        "radial",
        function(add) {
          for (const c in this.gradientStops) add.stop(this.gradientStops[c]);
        }.bind(this)
      );

      // placement, fill, stroke of body
      const svg = this.features.body.rounded
        ? draw.path(this.svgPath(shape, this.bezierCommand))
        : draw.polygon(shape);
      svg
        .move(
          this.margin + (this.diameter - w) / 2,
          this.margin + (this.diameter - h) / 2
        )
        .fill(gradient)
        .stroke({
          width: 3,
          color: this.features.body.color,
          linecap: "round",
          linejoin: "round"
        });

      // nucleus
      const nucleusSize = 0.2 * this.diameter;
      const x =
        (maxX - minX - nucleusSize) / 2 + this.margin + (this.diameter - w) / 2;
      const y =
        (maxY - minY - nucleusSize) / 2 + this.margin + (this.diameter - h) / 2;
      if (this.features.nucleus.count)
        draw
          .ellipse(nucleusSize, nucleusSize)
          .fill(this.features.nucleus.color)
          .move(x, y)
          .stroke(this.stroke);

      // endoplasmic reticulum
      const layers = [
        {
          path: "10 70",
          dashes: "5,3,9"
        },
        {
          path: "0 80",
          dashes: "3,9,7"
        },
        {
          path: "-5 85",
          dashes: "2,7,5"
        }
      ];
      const endoStroke = {
        width: 3,
        color: this.features.endo.color,
        linecap: "round",
        linejoin: "round"
      };
      const erScale = (1 / 55) * this.diameter;
      if (this.features.endo.count) {
        for (let i = 0; i < layers.length; i++) {
          const angle = 35 + 5 * i;
          const layerPath = `M ${layers[i].path} A ${angle} ${angle} -45 0 1 70 50`;
          const ER = draw.path(layerPath);
          const layerStroke = endoStroke;
          layerStroke.dasharray = layers[i].dashes;
          ER.move(x - erScale * (i + 1), y - erScale * (i + 1))
            .stroke(layerStroke)
            .fill("none");
        }
      }

      // golgi aparatus

      // mitochondria
      const pattern = draw.pattern(
        10,
        10,
        function(add) {
          add.rect(10, 10).fill(this.features.mitochondria.color);
          add
            .rect(10, 2)
            .move(5, 5)
            .fill("#fff");
          add
            .rect(7, 2)
            .move(0, 0)
            .fill("#fff");
        }.bind(this)
      );
      this.drawFeature(
        draw,
        this.locations.mitochondria,
        pattern,
        this.features.mitochondria.count,
        x,
        y,
        10,
        18
      );

      // chloroplasts
      this.drawFeature(
        draw,
        this.locations.chloroplasts,
        this.features.chloroplasts.color,
        this.features.chloroplasts.count,
        x,
        y,
        8,
        16
      );

      // lisosome
      this.drawFeature(
        draw,
        this.locations.lisosomes,
        this.features.lisosomes.color,
        this.features.lisosomes.count,
        x,
        y,
        20,
        28
      );

      // ribosomes
      this.drawFeature(
        draw,
        this.locations.ribosomes,
        this.features.ribosomes.color,
        this.features.ribosomes.count,
        x,
        y,
        4,
        10
      );
    },

    mergeWaves(waves) {
      const waveLengths = waves.map(w => w.length);
      const lcm = this.lcmNumbers(waveLengths); // least common multiple of the length of the wave arrays
      let compoundWave;
      for (let i = 0; i < lcm; i++) {
        compoundWave[i] = 0;
        for (const wave in waves) {
          const j = Math.floor(i / (lcm / wave.length));
          compoundWave[i] += wave[j] / (this.bitDepthMax - 1);
        }
      }
      return compoundWave;
    },

    drawFeature(draw, positions, fill, count, x, y, w, h) {
      for (let i = 0; i < count; i++) {
        draw
          .ellipse(w, h)
          .fill(fill)
          .move(x + positions[i][0], y + positions[i][1])
          .transform({ rotate: positions[i][2] })
          .stroke("none");
      }
    },

    // function parameters ( size, wave, repeat, mod )
    // returns an array of points for a polygon
    plotShape(size, wave, repeat, mod) {
      const radius = size / 2;
      const segments = repeat * wave.length;
      const points = [];
      for (let i = 0; i <= segments; i++)
        points[i] = this.radialWavePlotter(i, radius, mod, wave, segments);
      return points;
    },

    radialWavePlotter(i, radius, mod, wave, segments) {
      const scale = radius * mod + radius * (1 - mod) * wave[i % wave.length];
      const x = Math.round(Math.sin((this.tao * i) / segments) * scale);
      const y = Math.round(Math.cos((this.tao * i) / segments) * scale * -1);
      return [x, y];
    },

    // Properties of a line
    // I:  - pointA (array) [x,y]: coordinates
    //     - pointB (array) [x,y]: coordinates
    // O:  - (object) { length: l, angle: a }: properties of the line
    line(pointA, pointB) {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      };
    },

    // Position of a control point
    // I:  - current (array) [x, y]: current point coordinates
    //     - previous (array) [x, y]: previous point coordinates
    //     - next (array) [x, y]: next point coordinates
    //     - reverse (boolean, optional): sets the direction
    // O:  - (array) [x,y]: a tuple of coordinates
    controlPoint(current, previous, next, reverse) {
      // When 'current' is the first or last point of the array
      // 'previous' or 'next' don't exist.
      // Replace with 'current'
      const p = previous || current;
      const n = next || current;

      // Properties of the opposed-line
      const o = this.line(p, n);

      // If is end-control-point, add PI to the angle to go backward
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * this.smoothing;

      // The control point position is relative to the current point
      const x = current[0] + Math.cos(angle) * length;
      const y = current[1] + Math.sin(angle) * length;
      return [x, y];
    },

    // Create the bezier curve command
    // I:  - point (array) [x,y]: current point coordinates
    //     - i (integer): index of 'point' in the array 'a'
    //     - a (array): complete array of points coordinates
    // O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
    bezierCommand(point, i, a) {
      // start control point
      const cps = this.controlPoint(a[i - 1], a[i - 2], point);

      // end control point
      const cpe = this.controlPoint(point, a[i - 1], a[i + 1], true);
      return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
    },

    // Render the svg <path> element
    // I:  - points (array): points coordinates
    //     - command (function)
    //       I:  - point (array) [x,y]: current point coordinates
    //           - i (integer): index of 'point' in the array 'a'
    //           - a (array): complete array of points coordinates
    //       O:  - (string) a svg path command
    // O:  - (string): a Svg <path> element
    svgPath(points, command) {
      // build the d attributes by looping over the points
      const d = points.reduce(
        (acc, point, i, a) =>
          i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`,
        ""
      );
      return d;
    },

    lcmNumbers(inputArray) {
      if (toString.call(inputArray) !== "[object Array]") return false;
      let r1 = 0,
        r2 = 0;
      const l = inputArray.length;
      for (let i = 0; i < l; i++) {
        r1 = inputArray[i] % inputArray[i + 1];
        if (r1 === 0) {
          inputArray[i + 1] =
            (inputArray[i] * inputArray[i + 1]) / inputArray[i + 1];
        } else {
          r2 = inputArray[i + 1] % r1;
          if (r2 === 0) {
            inputArray[i + 1] = (inputArray[i] * inputArray[i + 1]) / r1;
          } else {
            inputArray[i + 1] = (inputArray[i] * inputArray[i + 1]) / r2;
          }
        }
      }
      return inputArray[l - 1];
    }
  }
});
</script>
