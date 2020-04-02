export const smoothing = 0.2;
export const preserve = 0.6;
export const nucleusPortion = 0.2;
export const cytoplasmOpacity = 0.5;
export const features = [
         { title: "Endoplasmic Reticulum", key: "endo", solo: true },
         { title: "Golgi Aparatus", key: "golgi", solo: true },
         { title: "Mitochondria", key: "mitochondria", solo: false },
         { title: "Chloroplasts", key: "chloroplasts", solo: false },
         { title: "Vacuoles", key: "vacuoles", solo: false },
         { title: "Ribosomes", key: "ribosomes", solo: false },
         { title: "Microtubules", key: "microtubules", solo: false },
         { title: "Vesicles", key: "vesicles", solo: false },
         { title: "Lysosomes", key: "lysosomes", solo: false },
         { title: "Lipid Granule", key: "lipid", solo: false },
         { title: "Crystals", key: "crystals", solo: false },
         { title: "Magnetosomes", key: "magnetosomes", solo: false },
         { title: "Carboxysomes", key: "carboxysomes", solo: false },
         { title: "Chromatophores", key: "chromatophores", solo: false },
         { title: "Logic Unit", key: "logic", solo: true },
         { title: "RF Array", key: "rf", solo: false },
         { title: "Memory Array", key: "memory", solo: false },
         { title: "PV Junction", key: "pv", solo: false },
         { title: "Balasts", key: "balasts", solo: false },
         { title: "Micro Assembly Mechanism", key: "mam", solo: true },
         { title: "Data Buses", key: "buses", solo: false },
         { title: "Resource Bundles", key: "bundles", solo: false },
         { title: "Anode", key: "anode", solo: true },
         { title: "Cathode", key: "cathode", solo: true },
         { title: "Charger", key: "charger", solo: false },
         { title: "Fuse", key: "fuse", solo: false },
         { title: "Separator", key: "separator", solo: false },
         { title: "Electrolyte", key: "electrolyte", solo: false },
         { title: "Wire", key: "wire", solo: false },
         { title: "Electrons", key: "electrons", solo: false }
       ];
export const families = [
         { title: "Plant", color: "#0f0", features: [0, 1, 2, 3, 4, 5, 6, 7] },
         { title: "Animal", color: "#f00", features: [0, 1, 2, 3, 4, 5, 6, 7] }, // [0, 1, 2, 8, 4, 5, 6, 7]
         { title: "Fungi", color: "#ff0", features: [0, 1, 2, 3, 4, 5, 6, 7] }, // [0, 1, 2, 9, 4, 5, 6, 7]
         {
           title: "Bacteria",
           color: "#00f",
           features: [0, 1, 2, 3, 4, 5, 6, 7] // [(10, 11, 12, 13, 4, 5, 6, 7)]
         },
         {
           title: "Nanite",
           color: "#000",
           features: [0, 1, 2, 3, 4, 5, 6, 7] // [14, 15, 16, 17, 18, 19, 20, 21]
         },
         {
           title: "Battery",
           color: "#fff",
           features: [0, 1, 2, 3, 4, 5, 6, 7] // [22, 23, 24, 25, 26, 27, 28, 29]
         },
         { title: "Amoeba", color: "#0ff", features: [0, 1, 2, 3, 4, 5, 6, 7] }, // [10, 9, 8, 3, 4, 5, 6, 7]
         { title: "Protist", color: "#f0f", features: [0, 1, 2, 3, 4, 5, 6, 7] } // [10, 9, 8, 3, 4, 5, 6, 7]
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
