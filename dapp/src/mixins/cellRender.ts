const tao = 2 * Math.PI;
const smoothing = 0.2;
const bitDepthMax = 2 ** 5;

const cellRender: any = {
  methods: {
    parseData(data: any, waves: Array<Array<number>>) {
      const cell = data;
      const types = [
        "endo",
        "golgi",
        "mitochondria",
        "chloroplasts",
        "ribosomes",
        "vacuoles",
        "microtubules",
        "vesicles",
      ];
      const features = {
        body: {
          rounded: cell.wallRound,
          waves: [(cell.wallWave % waves.length), 1, 2, 3],
          color: cell.wallColor,
          gradient: ["#ccddcc", "#9999ff", "#449944"]
        },
        nucleus: {
          color: this.intToColor(cell.nucleusColor),
          hidden: cell.nucleusHidden,
        },
        endo: {
          color: "#00f",
          count: 0
        },
        golgi: {
          color: "#66f",
          count: 4
        },
        mitochondria: {
          color: "#f33",
          count: 6
        },
        chloroplasts: {
          color: "#3f5",
          count: 4
        },
        ribosomes: {
          color: "#66f",
          count: 4
        },
        vacuoles: {
          color: "#66f",
          count: 1
        },
        microtubules: {
          color: "#ff0",
          count: 4
        },
        vesicles: {
          color: "#66f",
          count: 4
        },
      };
      return features;
    },

    intToColor: function (intnumber: number) {
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

    mergeWaves(waves: Array<Array<number>>) {
      const waveLengths = waves.map(w => w.length);
      const lcm = this.lcmNumbers(waveLengths); // least common multiple of the length of the wave arrays
      const compoundWave: Array<number> = [];
      for (let i = 0; i < lcm; i++) {
        compoundWave[i] = 0;
        for (const wave in waves) {
          const j = Math.floor(i / (lcm / wave.length));
          compoundWave[i] += wave[j] / (bitDepthMax - 1);
        }
      }
      return compoundWave;
    },

    lcmNumbers(inputArray: Array<number>) {
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
    },

    drawFeature(draw: any, center: { x: number, y: number }, features: { count: number, fill: object }, base: { positions: Array<Array<number>>, size: Array<number> }) {
      const { fill, count } = features;
      const { positions, size } = base;
      const [w, h] = size;
      for (let i = 0; i < count; i++) {
        draw
          .ellipse(w, h)
          .fill(fill)
          .move(center.x + positions[i][0], center.y + positions[i][1])
          .transform({ rotate: positions[i][2] })
          .stroke("none");
      }
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

    radialWavePlotter(i: number, radius: number, mod: number, wave: Array<number>, segments: number) {
      const scale = radius * mod + radius * (1 - mod) * wave[i % wave.length];
      const x = Math.round(Math.sin((tao * i) / segments) * scale);
      const y = Math.round(Math.cos((tao * i) / segments) * scale * -1);
      return [x, y];
    },

    // -- Polygon To Curve Functions --

    // Properties of a line
    // I:  - pointA (array) [x,y]: coordinates
    //     - pointB (array) [x,y]: coordinates
    // O:  - (object) { length: l, angle: a }: properties of the line
    line(pointA: Array<number>, pointB: Array<number>): object {
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
    controlPoint(current: Array<number>, previous: Array<number>, next: Array<number>, reverse: boolean): Array<number> {
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
    bezierCommand(point: Array<number>, i: number, a: Array<Array<number>>): string {
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
    svgPath(points: Array<Array<number>>, command: any): string {
      // build the d attributes by looping over the points
      const d = points.reduce(
        (acc: string, point: Array<number>, i: number, a: Array<Array<number>>) =>
          i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`,
        ""
      );
      return d;
    },
  }
};

export default cellRender;
