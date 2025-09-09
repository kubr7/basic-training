require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  console.log("\nInteracting with ToDoContractV2 via UUPS Proxy...");
  console.log("Proxy address:", proxyAddress);

  const toDoContract = await ethers.getContractAt(
    "ToDoContractV2",
    proxyAddress
  );

  const totalTaskCount = await toDoContract.getTotalTaskCount();
  console.log("Total Task Count V2 Function:", totalTaskCount.toString());

  const taskCount = await toDoContract.taskCount();
  console.log("TaskCount V1 Function:", taskCount.toString());

  console.log("\nDone interacting with ToDoContractV2.");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
