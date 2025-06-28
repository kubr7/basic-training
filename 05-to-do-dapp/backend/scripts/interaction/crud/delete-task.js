const { ethers } = require("hardhat");
require("dotenv").config();
const readline = require("readline");

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
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

    const total = await toDoContract.taskCount();
    const active = await toDoContract.getActiveTaskCount();
    console.log("Total tasks created:", total.toString());
    console.log("Active tasks:", active.toString());

    const taskIdStr = await askQuestion("\nEnter Task ID to delete: ");
    const taskId = parseInt(taskIdStr);
    if (isNaN(taskId)) {
        console.log("Invalid Task ID.");
        return;
    }

    console.log(`\nDeleting Task ${taskId}...`);
    const tx = await toDoContract.deleteTask(taskId);
    const receipt = await tx.wait();
    console.log(`Task ${taskId} has been deleted.`);

    console.log("\nFinal Summary:");
    const totalTasks = await toDoContract.taskCount();
    console.log("Total tasks ever created:", totalTasks.toString());
    const activeTasks = await toDoContract.getActiveTaskCount();
    console.log("Active tasks (non-deleted):", activeTasks.toString());
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
