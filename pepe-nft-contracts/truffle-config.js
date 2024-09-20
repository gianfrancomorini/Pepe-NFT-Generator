const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 11155111, // Sepolia's network id
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },


  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: 'WY68T1NXDVUMPW9NHSC7FNEQ7T9IVYBH94'
  },

  compilers: {
    solc: {
      version: "0.8.20",  // Updated this line
    }
  }
  
};