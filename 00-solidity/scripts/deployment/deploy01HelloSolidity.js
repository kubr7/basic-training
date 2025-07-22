const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contract...");
  const HelloSolidity = await ethers.getContractFactory("HelloSolidity");
  const helloSolidity = await HelloSolidity.deploy();
  await helloSolidity.waitForDeployment();

  const helloSolidityAddress = await helloSolidity.getAddress();

  return {
    address: helloSolidityAddress,
    contract: helloSolidity,
  };
}

main()
  .then((result) => {
    console.log("\nDeployment is completed!");
    console.log("Contract Address:", result.address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Hello Solidity Contract Deployment is Failed.");
    process.exit(1);
  });
