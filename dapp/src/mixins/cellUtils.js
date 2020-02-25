const cellUtils = {
  methods: {
    level(c) {
      return Math.floor(Math.log2(c.mass)) - 2;
    },
    levelProgress(c) {
      const baseMass = 2 ** Math.floor(Math.log2(c.mass));
      return ((c.mass - baseMass) / baseMass) * 100;
    }
  }
};

export default cellUtils;
