const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying counter contract...");
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  await counter.waitForDeployment();
  const counterAddress = await counter.getAddress();

  return {
    address: counterAddress,
    contract: counter,
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
