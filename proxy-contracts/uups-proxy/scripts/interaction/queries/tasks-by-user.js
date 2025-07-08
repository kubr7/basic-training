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

  const [signer] = await ethers.getSigners();
  const userAddress = signer.address;

  console.log("\nGetting tasks by user:");
  const tasks = await toDoContract.getAllTasksByUser(userAddress);

  if (tasks.length === 0) {
    console.log(`No tasks found for you.`);
  } else {
    console.log(`Found ${tasks.length} task(s) for you.`);
    tasks.forEach((task, i) => {
      console.log(`  #${i + 1}:`, {
        id: task.id.toString(),
        creator: task.creator,
        assignedTo: task.assignedTo,
        description: task.description,
        status: task.status === 0 ? "Pending" : "Completed",
        modified: task.isModified,
      });
    });
  }

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
