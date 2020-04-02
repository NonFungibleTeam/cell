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

function defaultRenderer(
  draw: any,
  center: { x: number; y: number },
  feature: any,
  base: { locations: Array<Array<number>>; size: Array<number> },
  radius: number,
  nucleus: boolean,
  rand: any
) {
  const [w, h] = base.size;
  for (let i = 0; i < feature.count; i++) {
    const location = randomRadialPlotter(radius, nucleus, h, 90, rand); // radius, buffer, segments, random
    draw
      .ellipse(w, h)
      .fill(feature.color)
      .move(center.x + 20 + location[0], center.y + 20 + location[1])
      .transform({ rotate: rand(359) })
      .stroke("none");
  }
};

const featureRenderers: any = {
  "endo": defaultRenderer,
  "golgi": defaultRenderer,
  "mitochondria": defaultRenderer,
  "chloroplasts": defaultRenderer,
  "vacuoles": defaultRenderer,
  "ribosomes": defaultRenderer,
  "microtubules": defaultRenderer,
  "vesicles": defaultRenderer,
  "lysosomes": defaultRenderer,
  "lipid": defaultRenderer,
  "crystals": defaultRenderer,
  "magnetosomes": defaultRenderer,
  "carboxysomes": defaultRenderer,
  "chromatophores": defaultRenderer,
  "logic": defaultRenderer,
  "rf": defaultRenderer,
  "memory": defaultRenderer,
  "pv": defaultRenderer,
  "balasts": defaultRenderer,
  "mam": defaultRenderer,
  "buses": defaultRenderer,
  "bundles": defaultRenderer,
  "anode": defaultRenderer,
  "cathode": defaultRenderer,
  "charger": defaultRenderer,
  "fuse": defaultRenderer,
  "separator": defaultRenderer,
  "electrolyte": defaultRenderer,
  "wire": defaultRenderer,
  "electrons": defaultRenderer,
};

export default featureRenderers;