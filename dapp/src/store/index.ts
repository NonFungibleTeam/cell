import Vue from "vue";
import Vuex from "vuex";
import Web3 from "web3";
import { cellAddress, cellABI } from "../ContractAddresses";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentAccount: "",
    web3Status: "loading",
    web3: null,
    contracts: {
      cells: null
    }
  },
  mutations: {
    setFaces(state, faces) {
      state.faces = faces;
    },
    setContract(state, payload) {
      state.contracts[payload.id] = payload.contract;
    },
    setWeb3(state, instance) {
      state.web3 = instance;
    },
    setWeb3Status(state, status) {
      state.web3Status = status;
    },
    setAccount(state, address) {
      state.currentAccount = address;
    }
  },
  actions: {
    async initialize(context, dispatch) {
      await context.dispatch("loadWeb3");
      await context.dispatch("loadAccount");
      await context.dispatch("registerContracts");
    },
    loadWeb3(context) {
      return new Promise((resolve, reject) => {
        if (window.ethereum) {
          context.commit("setWeb3", new Web3(window.ethereum));
          try {
            // Request account access if needed
            window.ethereum.enable().then(() => {
              context.commit("setWeb3Status", "active");
              resolve();
            });
          } catch (error) {
            context.commit("setWeb3Status", "denied");
            resolve();
          }
        } else if (window.web3) {
          // Legacy dapp browsers...
          context.commit("setWeb3", new Web3(window.web3.currentProvider));
          context.commit("setWeb3Status", "active");
          resolve();
        } else {
          // Non-dapp browsers...
          context.commit("setWeb3Status", "inactive");
          resolve();
        }
      });
    },
    registerContracts(context) {
      return new Promise((resolve, reject) => {
        context.commit("setContract", {
          id: "cell",
          contract: new context.state.web3.eth.Contract(cellABI, cellAddress)
        });
        resolve();
      });
    },
    loadAccount(context) {
      return new Promise((resolve, reject) => {
        context.state.web3.eth.getAccounts((err, resp) => {
          if (err) reject(err);
          else {
            context.commit("setAccount", resp[0]);
            resolve(resp[0]);
          }
        });
      });
    }
  },
  getters: {
    currentAccount: state => {
      return state.currentAccount;
    },
    web3Status: state => {
      return state.web3Status;
    }
  }
});

export default store;
