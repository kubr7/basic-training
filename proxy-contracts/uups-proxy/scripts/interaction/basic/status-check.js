const { ethers } = require("hardhat");

async function main() {
  console.log("\nInteracting with contracts...");

  const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.log("To-Do Contract address is missing in .env file.");
    return;
  }

  const toDoContract = await ethers.getContractAt(
    "ToDoContract",
    contractAddress
  );

  console.log("\nContract Addresses:");
  console.log("- To-Do Contract Address:", contractAddress);

  const activeTaskCount = await toDoContract.getActiveTaskCount();
  console.log("\nStatus:");
  console.log("- Active tasks:", activeTaskCount.toString());

  console.log("\nFinal Summary:");
  const totalTasks = await toDoContract.taskCount();
  console.log("- Total Tasks [Ever created]:", totalTasks.toString());
  console.log("- Active Tasks [Non-deleted]:", activeTaskCount.toString());

  const activeTasksList = await toDoContract.getActiveTasks();

  let modifiedCount = 0;
  for (const task of activeTasksList) {
    if (task.isModified) {
      modifiedCount++;
    }
  }
  console.log("- Modified Tasks [Active]:", modifiedCount);
}

main()
  .then(() => {
    console.log("\nDone! All contract interactions complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error occurred:", err.message);
    process.exit(1);
  });
