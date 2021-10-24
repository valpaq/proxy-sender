require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-ganache");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');

const { mnemonic, ETHSCANAPIKEY, INFURAID } = require('./env.json');

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "vUA53owVmQLVfqEvHBWQwmcRKWU3-ydt";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const Rinkeby_PRIVATE_KEY = "9410cb727fb13cc479ccedbec52732a788060c0fe1d3cea7035708d0f8e0f7fe";


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    testnet: {
      url: `https://rinkeby.infura.io/v3/${INFURAID}`,
      accounts: {mnemonic: mnemonic},
      gas: 20000000
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${Rinkeby_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURAID}`,
      accounts: {mnemonic: mnemonic},
      gas: 20000000
    }
  },
  solidity: {
  version: "0.8.6",
  settings: {
    optimizer: {
      enabled: true
    }
   }
  },
  gasReporter: {
    currency: 'ETH',
    gasPrice: 20
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    apiKey: ETHSCANAPIKEY
  },
};
