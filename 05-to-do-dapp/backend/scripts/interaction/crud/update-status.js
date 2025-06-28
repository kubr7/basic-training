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

    console.log("\nTo-Do Contract Address:", contractAddress);

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);

    const userTaskCount = await toDoContract.userTaskCountContract();
    console.log("UserTaskCount Address:", userTaskCount);

    const initialTaskCount = await toDoContract.taskCount();
    console.log("Initial task count:", initialTaskCount.toString());

    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks:", activeTaskCount.toString());

    const taskIdStr = await askQuestion("\nEnter the Task ID you want to update: ");
    const taskId = parseInt(taskIdStr);
    if (isNaN(taskId)) {
        console.log("Invalid task ID entered.");
        return;
    }

    const newStatusStr = await askQuestion("Enter new status code (0 for Pending, 1 for Completed): ");
    const newStatus = parseInt(newStatusStr);
    if (isNaN(newStatus) || (newStatus !== 0 && newStatus !== 1)) {
        console.log("Invalid status code. Must be 0 or 1.");
        return;
    }

    const task = await toDoContract.tasks(taskId);
    const [signer] = await ethers.getSigners();

    console.log("Task assigned to:", task.assignedTo);
    console.log("Current signer:", signer.address);

    if (signer.address.toLowerCase() === task.assignedTo.toLowerCase()) {
        console.log(`\nUpdating Task ${taskId} status to ${newStatus}...`);
        const updateTx = await toDoContract.updateTaskStatus(taskId, newStatus);
        await updateTx.wait();
        console.log(`Task ${taskId} status updated successfully.`);
    } else {
        console.log("Current signer is not the assignee of this task. Cannot update status.");
    }

    // Final Summary
    console.log("\nFinal Summary:");
    const totalTasks = await toDoContract.taskCount();
    console.log("Total tasks ever created:", totalTasks.toString());
    const activeTasks = await toDoContract.getActiveTaskCount();
    console.log("Active tasks (non-deleted):", activeTasks.toString());

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
