<template lang="pug">
  .shape
</template>

<script>
import Vue from "vue";
import { SVG } from "@svgdotjs/svg.js";

export default Vue.extend({
  name: "Cell",
  data: () => ({
    tao: 2 * Math.PI,
    diameter: 300,
    margin: 10,
    smoothing: 0.2,
    bitDepthMax: 2 ** 5,
    preserve: 0.6,
    waves: [
      [31, 23, 15, 7, 0, 7, 15, 23],
      [31, 31, 0, 0, 31, 31, 0, 0],
      [0, 7, 15, 23, 31, 23, 15, 7],
      [31, 22, 14, 8, 16, 7, 16, 4, 32, 8, 22],
      [0, 0, 0, 0, 0, 0, 31],
      [0, 31, 0, 16],
      [31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]
    ],
    waveform: 5,
    level: 8,
    rounded: true,
    gradientStops: [
      { offset: 0.1, color: "#ffffff" },
      { offset: 0.5, color: "#770002" },
      { offset: 0.9, color: "#77ff00" }
    ],
    nucleusColor: "#f56",
    nucleusSize: 60,
    mitocondriaColor: "#f41",
    mitoArray: [
      [-30, 35, 35],
      [-10, -20, 0],
      [80, -20, 158],
      [75, 65, 287],
      [-15, 75, 77]
    ],
    chloroplastColor: "#3f5",
    chloroArray: [
      [50, -45, 145],
      [-35, -3, 95],
      [48, 73, 277],
      [85, 39, 13]
    ],
    lisosomeColor: "#ff0",
    lisosomeArray: [[80, 10, 23]],
    ribosomeColor: "#cdf",
    ribosomeArray: [
      [-12, 54, 285],
      [70, -5, 57]
    ],
    stroke: { width: 3, color: "#ee77ff", linecap: "round", linejoin: "round" }
  }),
  mounted() {
    this.drawCell(
      this.waves[this.waveform],
      this.level,
      ".shape",
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
      const maxX = shape.reduce(function(max, cords) {
        return max > cords[0] ? max : cords[0];
      }, 0);
      const minX = shape.reduce(function(min, cords) {
        return min < cords[0] ? min : cords[0];
      }, 0);
      const maxY = shape.reduce(function(max, cords) {
        return max > cords[1] ? max : cords[1];
      }, 0);
      const minY = shape.reduce(function(min, cords) {
        return min < cords[1] ? min : cords[1];
      }, 0);

      // gradient
      const gradient = draw.gradient(
        "radial",
        function(add) {
          add.stop(this.gradientStops[0]);
          add.stop(this.gradientStops[1]);
          for (const c in this.gradientStops) {
            add.stop(this.gradientStops[c]);
          }
        }.bind(this)
      );

      // placement, fill, stroke of SVG
      const svg = this.rounded
        ? draw.path(this.svgPath(shape, this.bezierCommand))
        : draw.polygon(shape);
      svg
        .move(this.margin, this.margin)
        .fill(gradient)
        .stroke(this.stroke);

      // nucleus
      const x = (maxX - minX - this.nucleusSize) / 2 + this.margin;
      const y = (maxY - minY - this.nucleusSize) / 2 + this.margin;
      draw
        .ellipse(this.nucleusSize, this.nucleusSize)
        .fill(this.nucleusColor)
        .move(x, y)
        .stroke(this.stroke);

      // endoplasmic reticulum
      const ER1 = draw.path("M 10 70 A 35 35 -45 0 1 70 50");
      ER1.move(x - 5, y - 5)
        .stroke({
          width: 3,
          color: "#00f",
          dasharray: "5,3,9",
          linecap: "round",
          linejoin: "round"
        })
        .fill("none");
      const ER2 = draw.path("M 0 80 A 40 40 -45 0 1 70 50");
      ER2.move(x - 10, y - 10)
        .stroke({
          width: 3,
          color: "#00f",
          dasharray: "3,9,7",
          linecap: "round",
          linejoin: "round"
        })
        .fill("none");
      const ER3 = draw.path("M -5 85 A 45 45 -45 0 1 70 50");
      ER3.move(x - 15, y - 15)
        .stroke({
          width: 3,
          color: "#00f",
          dasharray: "2,7,5",
          linecap: "round",
          linejoin: "round"
        })
        .fill("none");

      // golgi aparatus

      // mitocondria
      const pattern = draw.pattern(10, 10, function(add) {
        add.rect(10, 10).fill("#f33");
        add
          .rect(10, 2)
          .move(5, 5)
          .fill("#fff");
        add
          .rect(7, 2)
          .move(0, 0)
          .fill("#fff");
      });
      for (let i = 0; i < this.mitoArray.length; i++) {
        draw
          .ellipse(10, 18)
          .fill(pattern)
          .move(x + this.mitoArray[i][0], y + this.mitoArray[i][1])
          .transform({ rotate: this.mitoArray[i][2] })
          .stroke("none");
      }

      // chloroplasts
      for (let i = 0; i < this.chloroArray.length; i++) {
        draw
          .ellipse(8, 16)
          .fill(this.chloroplastColor)
          .move(x + this.chloroArray[i][0], y + this.chloroArray[i][1])
          .transform({ rotate: this.chloroArray[i][2] })
          .stroke("none");
      }

      // lisosome
      for (let i = 0; i < this.lisosomeArray.length; i++) {
        draw
          .ellipse(20, 28)
          .fill(this.lisosomeColor)
          .move(x + this.lisosomeArray[i][0], y + this.lisosomeArray[i][1])
          .transform({ rotate: this.lisosomeArray[i][2] })
          .stroke("none");
      }

      // ribosomes
      for (let i = 0; i < this.ribosomeArray.length; i++) {
        draw
          .ellipse(4, 10)
          .fill(this.ribosomeColor)
          .move(x + this.ribosomeArray[i][0], y + this.ribosomeArray[i][1])
          .transform({ rotate: this.ribosomeArray[i][2] })
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

    radialPlotter(i, segments, scale) {
      const x = Math.round(Math.sin((this.tao * i) / segments) * scale);
      const y = Math.round(Math.cos((this.tao * i) / segments) * scale * -1);
      return [x, y];
    },

    radialWavePlotter(i, radius, mod, wave, segments) {
      const scale =
        radius * mod +
        radius * (1 - mod) * (wave[i % wave.length] / (this.bitDepthMax - 1));
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
    }
  }
});
</script>
