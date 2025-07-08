const { ethers, upgrades } = require("hardhat");

async function main() {
  const Contract1 = await ethers.getContractFactory("Contract1");

  const contract = await upgrades.deployProxy(Contract1, [], {
    kind: "uups", // IMPORTANT: specify UUPS
    initializer: "initialize",
  });

  await contract.waitForDeployment();

  console.log("UUPS Proxy deployed at:", contract.target);
  console.log("Initial value:", await contract.retrieve());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
