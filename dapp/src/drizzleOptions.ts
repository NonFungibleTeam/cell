//import Cell from "./contracts/Cell.json";

const options: any = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545"
    }
  },

  // The contracts to monitor
  // contracts: [Cell],
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
