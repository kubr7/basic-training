const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Testing getActiveTasks function...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.log("To-Do Contract address is missing in .env file.");
        return;
    }

    console.log("\nTo-Do Contract Address:", contractAddress);

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);

    try {
        // First, let's check basic info
        const totalTasks = await toDoContract.taskCount();
        console.log("Total tasks:", totalTasks.toString());

        const activeTaskCount = await toDoContract.getActiveTaskCount();
        console.log("Active task count:", activeTaskCount.toString());

        // Test if we can get individual tasks
        console.log("\nTesting individual task access:");
        for (let i = 1; i <= Math.min(totalTasks, 3); i++) {
            const task = await toDoContract.tasks(i);
            console.log(`Task ${i}:`, {
                id: task.id.toString(),
                isDeleted: task.isDeleted,
                description: task.description.substring(0, 20) + "..."
            });
        }

        // Now try to call getActiveTasks with gas limit
        console.log("\nTrying to call getActiveTasks with gas limit...");
        const activeTasks = await toDoContract.getActiveTasks({
            gasLimit: 1000000 // 1M gas limit
        });
        
        console.log("Success! Number of active tasks returned:", activeTasks.length);
        
        // Display first few tasks
        const maxDisplay = Math.min(activeTasks.length, 3);
        for (let i = 0; i < maxDisplay; i++) {
            const task = activeTasks[i];
            console.log(`Active Task ${i + 1}:`, {
                id: task.id.toString(),
                creator: task.creator,
                assignedTo: task.assignedTo,
                description: task.description,
                status: Number(task.status) === 0 ? "Pending" : "Completed",
                isDeleted: task.isDeleted
            });
        }

    } catch (error) {
        console.error("Error details:", error.message);
        
        // If the main function fails, let's try to get the error reason
        if (error.message.includes("execution reverted")) {
            console.log("\nTrying to get more specific error...");
            try {
                // Try with call static to get more details
                const result = await toDoContract.callStatic.getActiveTasks();
                console.log("Call static succeeded, result length:", result.length);
            } catch (staticError) {
                console.error("Static call also failed:", staticError.message);
            }
        }
    }
}

main()
    .then(() => {
        console.log("\nTest complete.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Test failed:", err.message);
        process.exit(1);
    }); 