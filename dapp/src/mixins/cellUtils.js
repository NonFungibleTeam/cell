const cellUtils = {
  methods: {
    level(mass) {
      return Math.floor(Math.log2(mass)) - 2;
    },
    levelProgress(mass) {
      const baseMass = 2 ** Math.floor(Math.log2(mass));
      return ((mass - baseMass) / baseMass) * 100;
    }
  }
};

export default cellUtils;
