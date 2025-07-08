require("dotenv").config();
const { ethers, upgrades } = require("hardhat");


async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  const ToDoContractV2 = await ethers.getContractFactory("ToDoContractV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ToDoContractV2);
  console.log("Contract upgraded.. New implementation at:", upgraded.address);
  
  const newImplAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("New implementation logic address:", newImplAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
