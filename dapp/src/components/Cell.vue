<template lang="pug">
  v-container
    v-row.text-center
      v-col(cols="10")
        v-card
          .shape
</template>

<script lang="ts">
import Vue from "vue";
import { SVG } from "@svgdotjs/svg.js";

export default Vue.extend({
  name: "Cell",
  data: () => ({
    tao: 2 * Math.PI,
    diameter: 300,
    margin: 10,
    smoothing: 0.2,
    bitDepth: 5,
    bitDepthMax: 2 ** this.bitDepth,
    preserve: 0.5,
    waves: [
      [31, 23, 15, 7, 0, 7, 15, 23],
      [31, 31, 0, 0, 31, 31, 0, 0],
      [0, 7, 15, 23, 31, 23, 15, 7],
      [31, 22, 14, 8, 16, 7, 16, 4, 32, 8, 22],
      [0, 0, 0, 0, 0, 0, 31],
      [0, 31, 0, 16],
      [31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]
    ],
    waveform: this.waves[4],
    level: 4,
    rounded: false,
    gradientStops: [
      { offset: 0.1, color: "#ffffff" },
      { offset: 0.5, color: "#770002" },
      { offset: 0.9, color: "#77ff00" }
    ],
    nucleusColor: "#f56",
    nucleusSize: 60,
    stroke: { width: 3, color: "#ee77ff", linecap: "round", linejoin: "round" }
  }),
  mounted() {
    // draw the wave and shape plots in the .shape div
    //drawSVG(waveform, i, ".shape", diameter, diameter/4, 'linear');
    this.drawCell(
      this.waveform,
      this.level,
      ".shape",
      this.diameter,
      this.diameter,
      "radial"
    );
  },
  methods: {
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
        " z"
      );
      return d;
    },

    // Parameters: target div, width, height, type, fill, stroke
    drawCell(waveform, count, target, width, height, type) {
      // draw, style and position the SVG path
      const draw = SVG()
        .addTo(target)
        .size(width * 2 + this.margin, height * 2 + this.margin);
      // gradient
      const gradient = draw.gradient("radial", function(add) {
        for (const c in this.gradientStops) {
          add.stop(this.gradientStops[c]);
        }
      });

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
      }, -width / 2);
      const minX = shape.reduce(function(min, cords) {
        return min < cords[0] ? min : cords[0];
      }, -height / 2);
      const maxY = shape.reduce(function(max, cords) {
        return max > cords[1] ? max : cords[1];
      }, -height / 2);
      const minY = shape.reduce(function(min, cords) {
        return min < cords[1] ? min : cords[1];
      }, -height / 2);

      // placement, fill, stroke of SVG
      const svg = this.rounded
        ? draw.path(this.svgPath(shape, this.bezierCommand))
        : draw.polygon(shape);
      // min - max = diameter
      svg.move(this.margin, this.margin);
      svg.fill(gradient);
      svg.stroke(this.stroke);

      // parts
      const x = (maxX - minX - this.nucleusSize) / 2 + this.margin;
      const y = (maxY - minY - this.nucleusSize) / 2 + this.margin;
      draw
        .ellipse(this.nucleusSize, this.nucleusSize)
        .fill(this.nucleusColor)
        .move(x, y)
        .stroke(this.stroke);
    },

    // function parameters ( size, wave, repeat, mod )
    // returns an array of points for a polygon
    plotShape(size, wave, repeat, mod) {
      const radius = size / 2;
      const segments = repeat * wave.length;
      const points = [];
      for (let i = 0; i <= segments; i++)
        points[i] = this.radialPlotter(i, radius, mod, wave, segments);
      return points;
    },

    radialPlotter(i, radius, mod, wave, segments) {
      const scale =
        radius * mod +
        radius * (1 - mod) * (wave[i % wave.length] / (this.bitDepthMax - 1));
      const x = Math.round(Math.sin((this.tao * i) / segments) * scale);
      const y = Math.round(Math.cos((this.tao * i) / segments) * scale * -1);
      return [x, y];
    }
  }
});
</script>
