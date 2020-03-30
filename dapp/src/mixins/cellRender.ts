// Cell Renderer Functions
// draw a cell tokens SVG art from its genetic information
// Authored by Skyler Fly-Wilson 2020
import { SVG, Pattern } from "@svgdotjs/svg.js";
import {
  preserve,
  features,
  cytoplasmOpacity,
  families,
  featureBase
} from "./renderSettings";
import { svgPath } from "./polyToCurve";

const tao = 2 * Math.PI;

const cellRender: any = {
  methods: {
    intToColor(intnumber: number) {
      // bit shift color channel components
      const red = (intnumber & 0x0000ff) << 16;
      const green = intnumber & 0x00ff00;
      const blue = (intnumber & 0xff0000) >>> 16;

      // mask out each color and reverse the order
      intnumber = red | green | blue;

      // convert number to a hexstring, zero fill on left & add a #
      const HTMLcolor = intnumber.toString(16);
      const template = "#000000";
      return template.substring(0, 7 - HTMLcolor.length) + HTMLcolor;
    },

    getRandomInt(max: number) {
      return Math.floor(Math.random() * Math.floor(max));
    },

    contrastingColor(hex: string) {
      const [R, G, B] = [0, 1, 2].map(i =>
        parseInt(hex.substring(i * 2 + 1, i * 2 + 3), 16)
      );
      const cBrightness = (R * 299 + G * 587 + B * 114) / 1000;
      const threshold = 100; /* about half of 256. Lower threshold equals more dark text on dark background  */
      return cBrightness > threshold ? "#000000" : "#ffffff";
    },

    mergeWaves(waves: Array<Array<number>>, bitDepthMax: number) {
      const waveLengths = waves.map(w => w.length);
      const lcm = this.lcmNumbers(waveLengths); // least common multiple of the length of the wave arrays
      const compoundWave: Array<number> = [];
      for (let i = 0; i < lcm; i++) {
        compoundWave[i] = 0;
        for (const wave of waves) {
          const j = Math.floor(i / (lcm / wave.length));
          compoundWave[i] += wave[j] / (bitDepthMax - 1);
        }
      }
      return compoundWave;
    },

    lcmNumbers(inputArray: Array<number>): number {
      if (toString.call(inputArray) !== "[object Array]") return -1;
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
    },

    drawCell(
      data: any,
      waveform: Array<number>,
      level: number,
      size: number,
      margin: number,
      target: string
    ) {
      // draw, style and position the SVG path
      const draw = SVG()
        .addTo(target)
        .size(size + margin * 2, size + margin * 2);

      const shape = this.drawBody(draw, waveform, level, size, data, margin);

      // find cell range and center
      const [[minX, maxX], [minY, maxY]] = this.wallRange(shape);
      const w = maxX - minX;
      const h = maxY - minY;
      const nucleusSize = 0.2 * size;
      const findCenter = (d: number) =>
        (d - nucleusSize) / 2 + margin + (size - d) / 2;
      const center = {
        x: findCenter(w),
        y: findCenter(h)
      };

      if (!data.nucleusHidden)
        this.drawNucleus(draw, nucleusSize, data, center); // nucleus

      const mitoPattern = (baseColor: string) =>
        draw.pattern(10, 10, (add: any) => {
          add.rect(10, 10).fill(baseColor);
          add
            .rect(10, 2)
            .move(5, 5)
            .fill(this.contrastingColor(baseColor));
          add
            .rect(7, 2)
            .move(0, 0)
            .fill(this.contrastingColor(baseColor));
        });

      // render features
      for (let i = 0; i < 8; i++) {
        const c = data.featureCategories[i];
        const f = data.featureFamilies[i];
        const color = this.intToColor(data.featureColors[i]);
        const feature = {
          count: data.featureCounts[i] as number,
          fill: c === "2" ? mitoPattern(color) : color
        };
        if (c === "0") {
          this.drawEndo(draw, feature, center, size);
        }
        // endoplasmic reticulum
        else if (c === "1") {
          this.drawGolgi(draw, feature, center, size);
        }
        // golgi apparatus
        else {
          // this should be abstracted into a feature drawing function
          const type = this.getFeatureType(c, 0).key; // TODO - change to use family id as second arg, once art is ready
          this.drawFeature(draw, center, feature, featureBase[type]);
        }
      }
    },

    getFeatureType(i: number, f: number): any {
      return features[families[f].features[i]];
    },

    getFeatureFamily(i: number): string {
      return families[i].title;
    },

    countList(list: Array<any>) {
      // count and sort by family with most features
      return list.reduce((count: any, f: string) => {
        count[parseInt(f)] ? count[parseInt(f)]++ : (count[parseInt(f)] = 1);
        return count;
      }, {});
    },

    sortObject(counts: any) {
      return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    },

    drawBody(
      draw: any,
      waveform: Array<number>,
      count: number,
      size: number,
      data: any,
      margin: number
    ) {
      // plot shape from wave
      const shape = this.plotShape(size, waveform, count, preserve);

      const [[minX, maxX], [minY, maxY]] = this.wallRange(shape);
      const w = maxX - minX;
      const h = maxY - minY;

      // calculate gradient
      const counts = this.countList(data.featureFamilies);
      const sorted = this.sortObject(counts);
      const gradient = draw.gradient("radial", function(add: any) {
        let a = 0;
        for (const i of sorted) {
          a += counts[i];
          add.stop({
            offset: a / 10 + 0.25,
            color: families[parseInt(i)].color,
            opacity: cytoplasmOpacity
          });
        }
      });

      // body - draw cell wall and fill
      const body = data.wallRound
        ? draw.path(svgPath(shape))
        : draw.polygon(shape);
      body
        .move(margin + (size - w) / 2, margin + (size - h) / 2)
        .fill(gradient)
        .stroke({
          width: 3,
          color: this.intToColor(data.wallColor),
          linecap: "round",
          linejoin: "round"
        });

      return shape;
    },

    drawNucleus(
      draw: any,
      size: number,
      data: any,
      center: { x: number; y: number }
    ) {
      draw
        .ellipse(size, size)
        .fill(this.intToColor(data.nucleusColor))
        .move(center.x, center.y)
        .stroke({
          width: 2,
          color: this.intToColor(data.wallColor),
          linecap: "round",
          linejoin: "round"
        });
    },

    drawGolgi(
      draw: any,
      feature: { count: number; fill: string | Pattern },
      center: { x: number; y: number },
      size: number
    ) {
      for (let i = 0; i < feature.count; i++) {
        draw
          .ellipse(30, 8)
          .fill(feature.fill)
          .move(center.x + 70 + (i % 6) * 5, center.y + 50 + (i % 3) * 8)
          .transform({ rotate: 165 })
          .stroke("none");
      }
    },

    drawEndo(
      draw: any,
      feature: { count: number; fill: string | Pattern },
      center: { x: number; y: number },
      size: number
    ) {
      // endoplasmic reticulum
      const layers = [
        { path: "10 70", dashes: "5,3,9" },
        { path: "0 80", dashes: "3,9,7" },
        { path: "-5 85", dashes: "2,7,5" }
      ];
      const endoStroke = {
        width: 3,
        color: feature.fill, // find endo entry with largest count and use that color
        linecap: "round",
        linejoin: "round",
        dasharray: ""
      };
      const erScale = (1 / 55) * size;
      for (let i = 0; i < feature.count >> 2; i++) {
        endoStroke.dasharray = layers[i].dashes;
        const angle = 35 + 5 * i;
        const layerPath = `M ${layers[i].path} A ${angle} ${angle} -45 0 1 70 50`;
        const ER = draw.path(layerPath);
        ER.move(center.x - erScale * (i + 1), center.y - erScale * (i + 1))
          .stroke(endoStroke)
          .fill("none");
      }
    },

    drawFeature(
      draw: any,
      center: { x: number; y: number },
      features: { count: number; fill: string | Pattern },
      base: { locations: Array<Array<number>>; size: Array<number> }
    ) {
      const [w, h] = base.size;
      for (let i = 0; i < features.count; i++) {
        const location = [this.getRandomInt(180)-70, this.getRandomInt(180)-70];
        draw
          .ellipse(w, h)
          .fill(features.fill)
          .move(center.x + location[0], center.y + location[1])
          .transform({ rotate: this.getRandomInt(359) })
          .stroke("none");
      }
    },

    wallRange(shape: Array<Array<number>>) {
      return shape.reduce(
        function(result: Array<Array<number>>, cords: Array<number>) {
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
    },

    // function parameters ( size, wave, repeat, mod )
    // returns an array of points for a polygon
    plotShape(size: number, wave: Array<number>, repeat: number, mod: number) {
      const radius = size / 2;
      const segments = repeat * wave.length;
      const points = [];
      for (let i = 0; i <= segments; i++)
        points[i] = this.radialWavePlotter(i, radius, mod, wave, segments);
      return points;
    },

    radialWavePlotter(
      i: number,
      radius: number,
      mod: number,
      wave: Array<number>,
      segments: number
    ) {
      const scale = radius * mod + radius * (1 - mod) * wave[i % wave.length];
      const x = Math.round(Math.sin((tao * i) / segments) * scale);
      const y = Math.round(Math.cos((tao * i) / segments) * scale * -1);
      return [x, y];
    },

    radialPlotter(
      i: number,
      radius: number,
      mod: number,
      out: number,
      segments: number
    ) {
      const scale = radius * mod * out;
      const x = Math.round(Math.sin((tao * i) / segments) * scale);
      const y = Math.round(Math.cos((tao * i) / segments) * scale * -1);
      return [x, y];
    },
  }
};

export default cellRender;
