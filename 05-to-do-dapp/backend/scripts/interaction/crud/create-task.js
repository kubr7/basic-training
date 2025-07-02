const { ethers } = require("hardhat");
const readline = require("readline");

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

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

  console.log("\nCreate New Task");

  const assignedTo = await askQuestion("Enter assignee address: ");
  const description = await askQuestion("Enter task description: ");
  if (!description || description.trim().length === 0) {
    console.log("Description cannot be empty.");
    return;
  }
  const dateStr = await askQuestion("Enter task date (DDMMYYYY): ");
  const date = parseInt(dateStr);
  if (isNaN(date) || dateStr.length !== 8) {
    console.log("Invalid date format.");
    return;
  }

  console.log("\nCreating task...");
  const tx = await toDoContract.createTask(assignedTo, description, date);
  await tx.wait();
  console.log("Task created successfully!");

  console.log("\nFinal Summary:");
  const totalTasks = await toDoContract.taskCount();
  console.log("- Total tasks ever created:", totalTasks.toString());
  console.log("- Active tasks (non-deleted):", activeTaskCount.toString());

  const activeTasksList = await toDoContract.getActiveTasks();

  let modifiedCount = 0;
  for (const task of activeTasksList) {
    if (task.isModified) {
      modifiedCount++;
    }
  }
  console.log("- Modified active task count:", modifiedCount);
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
