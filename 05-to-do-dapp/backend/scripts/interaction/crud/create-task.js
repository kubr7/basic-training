const { ethers } = require("hardhat");
require("dotenv").config();
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
    console.log("Interacting with contracts...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.log("To-Do Contract address is missing in .env file.");
        return;
    }

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);
    console.log("\nTo-Do Contract Address:", contractAddress);

    const userTaskCount = await toDoContract.userTaskCountContract();
    console.log("UserTaskCount Address:", userTaskCount);

    const initialTaskCount = await toDoContract.taskCount();
    console.log("Initial task count:", initialTaskCount.toString());

    console.log("\n--- Create New Task ---");

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
    const finalTaskCount = await toDoContract.taskCount();
    console.log("Total tasks ever created:", finalTaskCount.toString());
    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks (non-deleted):", activeTaskCount.toString());

    const activeTasksList = await toDoContract.getActiveTasks();

    let modifiedCount = 0;
    for (const task of activeTasksList) {
        if (task.isModified) {
            modifiedCount++;
        }
    }

    console.log("Modified active task count:", modifiedCount);
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
