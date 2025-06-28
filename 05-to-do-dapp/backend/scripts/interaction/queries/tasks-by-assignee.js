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

    const userTaskCount = await toDoContract.userTaskCountContract();
    console.log("UserTaskCount Address:", userTaskCount);

    const initialTaskCount = await toDoContract.taskCount();
    console.log("\nInitial task count:", initialTaskCount.toString());

    const finalTaskCount = await toDoContract.taskCount();
    console.log("Total Task after Creation:", finalTaskCount.toString());

    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks:", activeTaskCount.toString());
    
    console.log("\nTasks assigned to users:");
    const allUsers = await toDoContract.getAllUsers();

    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        const created = await toDoContract.getAllTaskByUserAsAssignee(user);
        console.log(`\n${i + 1}.User ${user} created ${created.length} task(s)`);
        
        created.forEach((task, index) => {
            console.log(`  #${index + 1}:`, {
                id: task.id.toString(),
                assignedTo: task.assignedTo,
                description: task.description,
                date: task.date.toString(),
                status: Number(task.status) === 0 ? "Pending" : "Completed"
            });
        });
    }

    console.log("\nFinal Summary:");
    const totalTasks = await toDoContract.taskCount();
    console.log("\nTotal tasks ever created:", totalTasks.toString());
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
