require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Optional for live ETH price
    showTimeSpent: true,
    excludeContracts: [], // Optional: list contract names to skip
    outputFile: "gas-report.txt", // Optional: write report to file
    noColors: true, // Useful for CI logs
  },
};
