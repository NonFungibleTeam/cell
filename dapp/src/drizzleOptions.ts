import Cell from "@/contracts/Cell.json";

const options: any = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://rinkeby.infura.io/v3/36c17feb3c2d44208df78f3772f9f59a"
    }
  },

  // The contracts to monitor
  contracts: [Cell],
  // events: {
  //   // monitor Cell.Mint events
  //   Cell: ["Mint"]
  // },
  polls: {
    // check accounts ever 15 seconds
    accounts: 15000
  }
};

export default options;
