<template lang="pug">
  .shape(:class="[shapeID]")
</template>

<script>
import Vue from "vue";
import { SVG } from "@svgdotjs/svg.js";
import cellUtils from "@/mixins/cellUtils";
import cellRender from "@/mixins/cellRender";

export default Vue.extend({
  name: "Cell",
  mixins: [cellUtils, cellRender],
  props: ["id", "data"],
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
    size: 300,
    margin: 10,
    preserve: 0.6,
    features: {},
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
    featureBase: {
      mitochondria: {
        locations: [
          [-30, 35, 35],
          [-10, -20, 0],
          [80, -20, 158],
          [75, 65, 287],
          [-25, -15, 187],
          [-15, 75, 77]
        ],
        size: [10, 18],
      },
      chloroplasts: {
        locations: [
          [50, -45, 145],
          [-35, -3, 95],
          [48, 73, 277],
          [85, 39, 13]
        ],
        size: [8, 16],
      },
      vacuoles: {
        locations: [
          [80, 10, 23],
          [-40, -30, 312]
        ],
        size: [20, 28],
      },
      ribosomes: {
        locations: [
          [-12, 54, 285],
          [-32, 20, 85],
          [75, -32, 165],
          [70, -5, 57]
        ],
        size: [4, 10],
      },
      microtubules: {
        locations: [
          [-12, 54, 285],
          [-32, 20, 85],
          [75, -32, 165],
          [70, -5, 57]
        ],
        size: [1, 15],
      },
      vesicles: {
        locations: [
          [-12, 54, 285],
          [-32, 20, 85],
          [75, -32, 165],
          [70, -5, 57]
        ],
        size: [4, 4],
      },
    }
  }),
  async mounted() {
    this.features = this.parseData(this.data, this.waves);
    this.drawCell(
      this.wave,
      this.level(this.data.mass),
      this.size,
      "." + this.shapeID,
    );
  },
  methods: {
    wallRange(shape) {
      return shape.reduce(
        function(result, cords) {
          const [x, y] = cords;
          const [lX, lY] = result;
          return [
            [lX[0] < x ? lX[0] : x, lX[1] > x ? lX[1] : x],
            [lY[0] < y ? lY[0] : y, lY[1] > y ? lY[1] : y]
          ];
        },
        [ [0, 0], [0, 0] ]
      );
    },
    drawBody(draw, waveform, count, size) {
      // plot shape from wave
      const shape = this.plotShape(
        size,
        waveform,
        count,
        this.preserve
      );

      const [[minX, maxX],[minY, maxY]] = this.wallRange(shape);
      const w = maxX - minX;
      const h = maxY - minY;

      // gradient
      const gradient = draw.gradient(
        "radial",
        function(add) {
          for (const c in this.gradientStops) add.stop(this.gradientStops[c]);
        }.bind(this)
      );

      // body - draw cell wall and fill
      const body = this.features.body.rounded
        ? draw.path(this.svgPath(shape, this.bezierCommand))
        : draw.polygon(shape);
      body
        .move(
          this.margin + (size - w) / 2,
          this.margin + (size - h) / 2
        )
        .fill(gradient)
        .stroke({
          width: 3,
          color: this.features.body.color,
          linecap: "round",
          linejoin: "round"
        });

      return shape;
    },
    drawEndo(draw, size, center) {
      // endoplasmic reticulum
      const layers = [
        { path: "10 70", dashes: "5,3,9" },
        { path: "0 80", dashes: "3,9,7" },
        { path: "-5 85", dashes: "2,7,5" }
      ];
      const endoStroke = {
        width: 3,
        color: this.features.endo.color,
        linecap: "round",
        linejoin: "round"
      };
      const erScale = (1 / 55) * size;
      if (this.features.endo.count) {
        for (let i = 0; i < layers.length; i++) {
          endoStroke.dasharray = layers[i].dashes;
          const angle = 35 + 5 * i;
          const layerPath = `M ${layers[i].path} A ${angle} ${angle} -45 0 1 70 50`;
          const ER = draw.path(layerPath);
          ER.move(center.x - erScale * (i + 1), center.y - erScale * (i + 1))
            .stroke(endoStroke)
            .fill("none");
        }
      }
    },
    drawNucleus(draw, size, center) {
      draw
          .ellipse(size, size)
          .fill(this.features.nucleus.color)
          .move(center.x, center.y)
          .stroke({
            width: 3,
            color: this.features.body.color,
            linecap: "round",
            linejoin: "round"
          });
    },
    drawCell(waveform, count, size, target) {
      // draw, style and position the SVG path
      const draw = SVG()
        .addTo(target)
        .size(size + this.margin * 2, size + this.margin * 2);

      const shape = this.drawBody(draw, waveform, count, size);

      // find cell range and center
      const [[minX, maxX],[minY, maxY]] = this.wallRange(shape);
      const w = maxX - minX;
      const h = maxY - minY;
      const nucleusSize = 0.2 * size;
      const findCenter = d => ((d - nucleusSize) / 2 + this.margin + (size - d) / 2);
      const center = {
        x: findCenter(w),
        y: findCenter(h),
      };

      if (!this.features.nucleus.hidden) this.drawNucleus(draw, nucleusSize, center); // nucleus

      this.drawEndo(draw, size, center); // endoplasmic reticulum

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
        center,
        {fill: pattern, count: this.features.mitochondria.count},
        this.featureBase.mitochondria,
      );

      // chloroplasts
      this.drawFeature(
        draw,
        center,
        this.features.chloroplasts,
        this.featureBase.chloroplasts
      );

      // vacuoles
      this.drawFeature(
        draw,
        center,
        this.features.vacuoles,
        this.featureBase.vacuoles,
      );

      // ribosomes
      this.drawFeature(
        draw,
        center,
        this.features.ribosomes,
        this.featureBase.ribosomes,
      );

      // microtubules
      this.drawFeature(
        draw,
        center,
        this.features.microtubules,
        this.featureBase.microtubules,
      );

      // vesicles
      this.drawFeature(
        draw,
        center,
        this.features.vesicles,
        this.featureBase.vesicles,
      );
    },
  }
});
</script>
