import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL || "",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""]
    }
  }
};

export default config;
