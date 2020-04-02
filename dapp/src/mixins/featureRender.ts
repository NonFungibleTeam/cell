function defaultRenderer(family: string) {
  return;
}

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