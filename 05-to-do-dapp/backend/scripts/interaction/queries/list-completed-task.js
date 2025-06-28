const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Interacting with contracts...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.log("To-Do Contract address is missing in .env file.");
        return;
    }

    console.log("\nTo-Do Contract Address:", contractAddress);

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);

    const [signer] = await ethers.getSigners();
    const userAddress = signer.address;

    const userTaskCount = await toDoContract.userTaskCountContract();
    console.log("UserTaskCount Address:", userTaskCount);

    const initialTaskCount = await toDoContract.taskCount();
    console.log("\nInitial task count:", initialTaskCount.toString());

    const finalTaskCount = await toDoContract.taskCount();
    console.log("Total Task after Creation:", finalTaskCount.toString());

    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks:", activeTaskCount.toString());

    const activeTasksList = await toDoContract.getActiveTasks();

    const userTasksAssigned = activeTasksList.filter(
        (task) => task.assignedTo.toLowerCase() === userAddress.toLowerCase()
    );

    const completedAssignedTasks = userTasksAssigned.filter(
        (task) => Number(task.status) === 1 && !task.isDeleted
    );

    console.log(`\nCompleted tasks assigned to user ${userAddress}: ${completedAssignedTasks.length}`);
    completedAssignedTasks.forEach((task, i) => {
        console.log(`- Completed Task ${i + 1}:`, {
            id: task.id.toString(),
            description: task.description,
            date: task.date.toString(),
        });
    });


    // Final Summary
    console.log("\nFinal Summary:");
    const totalTasks = await toDoContract.taskCount();
    console.log("Total tasks ever created:", totalTasks.toString());
    const activeTasks = await toDoContract.getActiveTaskCount();
    console.log("Active tasks (non-deleted):", activeTasks.toString());
    let modifiedCount = 0;
    for (const task of activeTasksList) {
        if (task.isModified) {
            modifiedCount++;
        }
    }
    console.log("Modified active task count:", modifiedCount);

    let completedCount = 0;
    for (const task of activeTasksList) {
        if (Number(task.status) === 1) {
            completedCount++;
        }
    }
    console.log("Completed Tasks:", completedCount);
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
