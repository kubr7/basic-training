require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;

  const ToDoContractV2 = await ethers.getContractFactory("ToDoContractV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ToDoContractV2);

  console.log("Upgrade completed. Proxy address:", upgraded.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
