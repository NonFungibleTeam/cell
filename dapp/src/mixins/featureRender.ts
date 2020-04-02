import {
  preserve,
  nucleusPortion,
  features,
  cytoplasmOpacity,
  families,
  featureBase
} from "./renderSettings";

const tao = 2 * Math.PI;

function randomRadialPlotter(
  radius: number,
  nucleus: boolean,
  buffer: number,
  segments: number,
  rand: any,
) {
    const angle = rand(segments);
    // mask inner portion for nucleus
    const inner = nucleus ? nucleusPortion * radius + buffer / radius : buffer / radius;
    // randomly place in band from inner to preserve portion
    const range = nucleus ? preserve - nucleusPortion : preserve - buffer / radius;
    const exp = 10000;
    const scale =
      inner + radius * range * (1 - (rand(exp) * rand(exp)) / (exp ** 2));
    const p = (tao * angle) / segments;
    return [Math.sin(p), -Math.cos(p)].map(c => Math.round(c * scale));
};

function contrastingColor(hex: string) {
  const [R, G, B] = [0, 1, 2].map(i =>
    parseInt(hex.substring(i * 2 + 1, i * 2 + 3), 16)
  );
  const cBrightness = (R * 299 + G * 587 + B * 114) / 1000;
  const threshold = 100; /* about half of 256. Lower threshold equals more dark text on dark background  */
  return cBrightness > threshold ? "#000000" : "#ffffff";
};


function drawMitochndria(
  draw: any,
  feature: any,
  center: Array<number>,
  size: number,
  base: { locations: Array<Array<number>>; size: Array<number> },
  nucleus: boolean,
  rand: any
) {
  const mitoPattern = (baseColor: string) =>
    draw.pattern(10, 10, (add: any) => {
      add.rect(10, 10).fill(baseColor);
      add
        .rect(10, 2)
        .move(5, 5)
        .fill(contrastingColor(baseColor));
      add
        .rect(7, 2)
        .move(0, 0)
        .fill(contrastingColor(baseColor));
    });
  const radius = size / 2;
  const [w, h] = base.size;
  for (let i = 0; i < feature.count; i++) {
    const location = randomRadialPlotter(radius, nucleus, h, 90, rand); // radius, buffer, segments, random
    draw
      .ellipse(w, h)
      .fill(mitoPattern(feature.color))
      .move(center[0] + 20 + location[0], center[1] + 20 + location[1])
      .transform({ rotate: rand(359) })
      .stroke("none");
  }
};


function drawGolgi(
  draw: any,
  feature: any,
  center: Array<number>,
  size: number,
  base: { locations: Array<Array<number>>; size: Array<number> },
  nucleus: boolean,
  rand: any
) {
  for (let i = 0; i < feature.count; i++) {
    draw
      .ellipse(30, 8)
      .fill(feature.color)
      .move(center[0] + 70 + (i % 6) * 5, center[1] + 50 + (i % 3) * 8)
      .transform({ rotate: 165 })
      .stroke("none");
  }
};

function drawEndo(
  draw: any,
  feature: any,
  center: Array<number>,
  size: number,
  base: { locations: Array<Array<number>>; size: Array<number> },
  nucleus: boolean,
  rand: any
) {
  // endoplasmic reticulum
  const layers = [
    { path: "10 70", dashes: "5,3,9" },
    { path: "0 80", dashes: "3,9,7" },
    { path: "-5 85", dashes: "2,7,5" }
  ];
  const endoStroke = {
    width: 3,
    color: feature.color, // find endo entry with largest count and use that color
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
    ER.move(center[0] - erScale * (i + 1), center[1] - erScale * (i + 1))
      .stroke(endoStroke)
      .fill("none");
  }
};

function defaultRenderer(
  draw: any,
  feature: any,
  center: Array<number>,
  size: number,
  base: { locations: Array<Array<number>>; size: Array<number> },
  nucleus: boolean,
  rand: any
) {
  const radius = size / 2;
  const [w, h] = base.size;
  for (let i = 0; i < feature.count; i++) {
    const location = randomRadialPlotter(radius, nucleus, h, 90, rand); // radius, buffer, segments, random
    draw
      .ellipse(w, h)
      .fill(feature.color)
      .move(center[0] + 20 + location[0], center[1] + 20 + location[1])
      .transform({ rotate: rand(359) })
      .stroke("none");
  }
};

const featureRenderers: any = {
  endo: drawEndo,
  golgi: drawGolgi,
  mitochondria: drawMitochndria,
  chloroplasts: defaultRenderer,
  vacuoles: defaultRenderer,
  ribosomes: defaultRenderer,
  microtubules: defaultRenderer,
  vesicles: defaultRenderer,
  lysosomes: defaultRenderer,
  lipid: defaultRenderer,
  crystals: defaultRenderer,
  magnetosomes: defaultRenderer,
  carboxysomes: defaultRenderer,
  chromatophores: defaultRenderer,
  logic: defaultRenderer,
  rf: defaultRenderer,
  memory: defaultRenderer,
  pv: defaultRenderer,
  balasts: defaultRenderer,
  mam: defaultRenderer,
  buses: defaultRenderer,
  bundles: defaultRenderer,
  anode: defaultRenderer,
  cathode: defaultRenderer,
  charger: defaultRenderer,
  fuse: defaultRenderer,
  separator: defaultRenderer,
  electrolyte: defaultRenderer,
  wire: defaultRenderer,
  electrons: defaultRenderer
};

export default featureRenderers;