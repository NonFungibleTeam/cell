export const smoothing = 0.2;
export const preserve = 0.6;
export const nucleusPortion = 0.2;
export const cytoplasmOpacity = 0.75;
export const features = [
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
  { title: "Electrons", key: "electrons" }
];
export const families = [
  { title: "Plant", color: "#3c3", features: [0, 1, 2, 3, 4, 5, 6, 7] },
  { title: "Animal", color: "#c33", features: [0, 1, 2, 8, 4, 5, 6, 7] },
  { title: "Fungi", color: "#cc3", features: [0, 1, 2, 9, 4, 5, 6, 7] },
  { title: "Bacteria", color: "#33c", features: [10, 11, 12, 13, 4, 5, 6, 7] },
  {
    title: "Nanite",
    color: "#333",
    features: [14, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    title: "Battery",
    color: "#ccc",
    features: [22, 23, 24, 25, 26, 27, 28, 29]
  },
  { title: "Amoeba", color: "#3cc", features: [10, 9, 8, 3, 4, 5, 6, 7] },
  { title: "Protist", color: "#c3c", features: [10, 9, 8, 3, 4, 5, 6, 7] }
];
export const featureBase: any = {
  mitochondria: {
    size: [10, 18]
  },
  chloroplasts: {
    size: [8, 16]
  },
  vacuoles: {
    size: [20, 28]
  },
  ribosomes: {
    size: [4, 10]
  },
  microtubules: {
    size: [2, 20]
  },
  vesicles: {
    size: [5, 5]
  }
};
