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

  const allTasksByUser = await toDoContract.getAllTasksByUser(userAddress);

  const pendingTasks = allTasksByUser.filter(
    (task) => Number(task.status) === 0 && task.assignedTo === userAddress
  );

  const completedTasks = allTasksByUser.filter(
    (task) => Number(task.status) === 1 && task.assignedTo === userAddress
  );

  console.log(`\nTask Summary for assignee ${userAddress}:\n`);

  if (pendingTasks.length > 0) {
    console.log(`Pending tasks (${pendingTasks.length}):`);
    pendingTasks.forEach((task, i) => {
      console.log(`- Pending Task ${i + 1}:`, {
        id: task.id.toString(),
        creator: task.creator,
        assignedTo: task.assignedTo,
        description: task.description,
        date: task.date.toString(),
        isModified: task.isModified,
      });
    });
  } else {
    console.log("No pending tasks found.");
  }

  if (completedTasks.length > 0) {
    console.log(`\nCompleted tasks (${completedTasks.length}):`);
    completedTasks.forEach((task, i) => {
      console.log(`- Completed Task ${i + 1}:`, {
        id: task.id.toString(),
        description: task.description,
        date: task.date.toString(),
        isModified: task.isModified,
      });
    });
  } else {
    console.log("No completed tasks found.");
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
