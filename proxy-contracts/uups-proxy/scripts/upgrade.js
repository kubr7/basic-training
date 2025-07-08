const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "DEPLOYED_PROXY_ADDRESS";
  const Contract2 = await ethers.getContractFactory("Contract2");

  const upgraded = await upgrades.upgradeProxy(proxyAddress, Contract2);

  console.log("Upgraded to Contract2");
  await upgraded.increment();
  console.log("New value:", await upgraded.retrieve());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
