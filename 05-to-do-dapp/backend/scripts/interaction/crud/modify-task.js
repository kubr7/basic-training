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
    console.log("\nInteracting with contracts...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.log("To-Do Contract address is missing in .env file.");
        return;
    }

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);
    const userTaskCount = await toDoContract.userTaskCountContract();

    console.log("\nContract Addresses:")
    console.log("- To-Do Contract Address:", contractAddress);
    console.log("- UserTaskCount Address:", userTaskCount);
    
    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("\nStatus:");
    console.log("- Active tasks:", activeTaskCount.toString());

    const taskIdStr = await askQuestion("\nEnter the Task ID you want to modify: ");
    const taskId = parseInt(taskIdStr);
    if (isNaN(taskId)) {
        console.log("Invalid task ID entered.");
        return;
    }

    const newDesc = await askQuestion("Enter new description: ");
    const newDateStr = await askQuestion("Enter new date (DDMMYYYY): ");
    const newDate = parseInt(newDateStr);

    console.log(`\nModifying Task ${taskId}...`);
    const modifyTx = await toDoContract.modifyTask(taskId, newDesc, newDate);
    await modifyTx.wait();

    const modified = await toDoContract.tasks(taskId);
    console.log(`Task ${taskId} modified:`, {
        id: modified.id.toString(),
        description: modified.description,
        date: modified.date.toString(),
        isModified: modified.isModified
    });

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
