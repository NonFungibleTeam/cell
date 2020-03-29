// Cell Renderer Functions
// draw a cell tokens SVG art from its genetic information
// Authored by Skyler Fly-Wilson 2020
import { SVG, Pattern } from "@svgdotjs/svg.js";

const tao = 2 * Math.PI;
const smoothing = 0.2;
const preserve = 0.6;
const features = [
  { title: "Endoplasmic Reticulum", key: "endo" },
  { title: "Golgi Aparatus", key: "golgi" },
  { title: "Mitochondria", key: "mitochondria" },
  { title: "Chloroplasts", key: "chloroplasts" },
  { title: "Vacuoles", key: "vacuoles" },
  { title: "Ribosomes", key: "ribosomes" },
  { title: "Microtubules", key: "microtubules" },
  { title: "Vesicles", key: "vesicles" },
  { title: "Lysosomes", key: "lysosomes" },
  { title: "Lipid Granule", key: "lipid" },
  { title: "Crystals", key: "crystals" },
  { title: "Magnetosomes", key: "magnetosomes" },
  { title: "Carboxysomes", key: "carboxysomes" },
  { title: "Chromatophores", key: "chromatophores" },
  { title: "Logic Unit", key: "logic" },
  { title: "RF Array", key: "rf" },
  { title: "Memory Array", key: "memory" },
  { title: "PV Junction", key: "pv" },
  { title: "Balasts", key: "balasts" },
  { title: "Micro Assembly Mechanism", key: "mam" },
  { title: "Data Buses", key: "buses" },
  { title: "Resource Bundles", key: "bundles" },
  { title: "Anode", key: "anode" },
  { title: "Cathode", key: "cathode" },
  { title: "Charger", key: "charger" },
  { title: "Fuse", key: "fuse" },
  { title: "Separator", key: "separator" },
  { title: "Electrolyte", key: "electrolyte" },
  { title: "Wire", key: "wire" },
  { title: "Electrons", key: "electrons" },
];
const families = [
  { title: "Plant", color: "#3c3", features: [0, 1, 2, 3, 4, 5, 6, 7] },
  { title: "Animal", color: "#c33", features: [0, 1, 2, 8, 4, 5, 6, 7] },
  { title: "Fungi", color: "#cc3", features: [0, 1, 2, 9, 4, 5, 6, 7] },
  { title: "Bacteria", color: "#33c", features: [10, 11, 12, 13, 4, 5, 6, 7] },
  { title: "Nanite", color: "#333", features: [14, 15, 16, 17, 18, 19, 20, 21] },
  { title: "Battery", color: "#ccc", features: [22, 23, 24, 25, 26, 27, 28, 29] },
  { title: "Amoeba", color: "#3cc", features: [10, 9, 8, 3, 4, 5, 6, 7] },
  { title: "Protist", color: "#c3c", features: [10, 9, 8, 3, 4, 5, 6, 7] },
];
const featureBase: any = {
  mitochondria: {
    locations: [
      [-30, 35, 35],
      [-10, -20, 0],
      [80, -20, 158],
      [75, 65, 287],
      [-25, -15, 187],
      [-15, 75, 77]
    ],
    size: [10, 18]
  },
  chloroplasts: {
    locations: [
      [50, -45, 145],
      [-35, -3, 95],
      [48, 73, 277],
      [85, 39, 13]
    ],
    size: [8, 16]
  },
  vacuoles: {
    locations: [
      [80, 10, 23],
      [-40, -30, 312]
    ],
    size: [20, 28]
  },
  ribosomes: {
    locations: [
      [-12, 54, 285],
      [-32, 20, 85],
      [75, -32, 165],
      [70, -5, 57]
    ],
    size: [4, 10]
  },
  microtubules: {
    locations: [
      [-42, 34, 185],
      [20, -50, 85],
      [25, 70, 165],
      [85, -5, 57]
    ],
    size: [2, 20]
  },
  vesicles: {
    locations: [
      [52, 90, 285],
      [10, -32, 85],
      [75, 85, 165],
      [90, 45, 57],
      [-23, 63, 185],
      [-40, 5, 25],
      [70, -32, 233],
      [75, -5, 215]
    ],
    size: [5, 5]
  }
};

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
        if (c === "0") this.drawEndo(draw, feature, center, size);
        // endoplasmic reticulum
        else if (c === "1") this.drawGolgi(draw, feature, center, size);
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
      const gradient = draw.gradient("radial", function(add: any) {
        // sort by family with most features
        for (let i = 0; i < 8; i++) {
          const f = parseInt(data.featureFamilies[i]);
          add.stop({ offset: i / 10 + 0.25, color: families[f].color });
        }
      });

      // body - draw cell wall and fill
      const body = data.wallRound
        ? draw.path(this.svgPath(shape, this.bezierCommand))
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
        const location = base.locations[i % base.locations.length];
        draw
          .ellipse(w, h)
          .fill(features.fill)
          .move(center.x + location[0], center.y + location[1])
          .transform({ rotate: location[2] })
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

    // -- Polygon To Curve Functions --
    // credit to @francoisromain
    // https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74

    // Properties of a line
    // I:  - pointA (array) [x,y]: coordinates
    //     - pointB (array) [x,y]: coordinates
    // O:  - (object) { length: l, angle: a }: properties of the line
    line(
      pointA: Array<number>,
      pointB: Array<number>
    ): { angle: number; length: number } {
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
    controlPoint(
      current: Array<number>,
      previous: Array<number>,
      next: Array<number>,
      reverse: boolean
    ): Array<number> {
      // When 'current' is the first or last point of the array
      // 'previous' or 'next' don't exist.
      // Replace with 'current'
      const p = previous || current;
      const n = next || current;

      // Properties of the opposed-line
      const o = this.line(p, n);

      // If is end-control-point, add PI to the angle to go backward
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;

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
    bezierCommand(
      point: Array<number>,
      i: number,
      a: Array<Array<number>>
    ): string {
      // start control point
      const cps = this.controlPoint(a[i - 1], a[i - 2], point, false);

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
    svgPath(points: Array<Array<number>>, command: any): string {
      // build the d attributes by looping over the points
      const d = points.reduce(
        (
          acc: string,
          point: Array<number>,
          i: number,
          a: Array<Array<number>>
        ) =>
          i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`,
        ""
      );
      return d;
    }
  }
};

export default cellRender;
