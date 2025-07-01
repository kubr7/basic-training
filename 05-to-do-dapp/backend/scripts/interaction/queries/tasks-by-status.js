const { ethers } = require("hardhat");
require("dotenv").config();

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

    const [signer] = await ethers.getSigners();
    const userAddress = signer.address;

    // Fetch all tasks assigned to current user (non-deleted)
    const assignedTasks = await toDoContract.getAllTaskByUserAsAssignee(userAddress);

    // Filter into pending and completed locally
    const pendingTasks = assignedTasks.filter(task => Number(task.status) === 0);
    const completedTasks = assignedTasks.filter(task => Number(task.status) === 1);

    // Print results
    console.log(`\nTask Summary for assignee ${userAddress}:\n`);

    if (pendingTasks.length > 0) {
        console.log(`Pending tasks (${pendingTasks.length}):`);
        pendingTasks.forEach((task, i) => {
            console.log(`- Pending Task ${i + 1}:`, {
                id: task.id.toString(),
                description: task.description,
                date: task.date.toString(),
                isModified: task.isModified,
            });
        });
    } else {
        console.log("No tasks (pending or completed) assigned to this user.");
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
        console.log("No tasks (pending or completed) assigned to this user.");
    }


    // const [signer] = await ethers.getSigners();
    // const userAddress = signer.address;

    // const TaskStatus = { Pending: 0, Completed: 1 };

    // // Fetch tasks by status
    // const pendingTasksRaw = await toDoContract.getTasksByStatus(userAddress, TaskStatus.Pending);
    // const completedTasksRaw = await toDoContract.getTasksByStatus(userAddress, TaskStatus.Completed);

    // // Filter tasks assigned to the current user (signer)
    // const pendingTasks = pendingTasksRaw.filter(
    //     (task) => task.assignedTo.toLowerCase() === userAddress.toLowerCase()
    // );
    // const completedTasks = completedTasksRaw.filter(
    //     (task) => task.assignedTo.toLowerCase() === userAddress.toLowerCase()
    // );

    // // Print summary
    // console.log(`\n📋 Task Summary for user ${userAddress}:\n`);

    // if (pendingTasks.length > 0) {
    //     console.log(`🕐 Pending tasks assigned to you (${pendingTasks.length}):`);
    //     pendingTasks.forEach((task, i) => {
    //         console.log(`- Pending Task ${i + 1}:`, {
    //             id: task.id.toString(),
    //             description: task.description,
    //             date: task.date.toString(),
    //             isModified: task.isModified,
    //         });
    //     });
    // } else if (completedTasks.length > 0) {
    //     console.log(`✅ No pending tasks found.`);
    //     console.log(`🎉 Completed tasks assigned to you (${completedTasks.length}):`);
    //     completedTasks.forEach((task, i) => {
    //         console.log(`- Completed Task ${i + 1}:`, {
    //             id: task.id.toString(),
    //             description: task.description,
    //             date: task.date.toString(),
    //             isModified: task.isModified,
    //         });
    //     });
    // } else {
    //     console.log("❌ No pending or completed tasks assigned to you.");
    // }


    // const [signer] = await ethers.getSigners();
    // const userAddress = signer.address;

    // const TaskStatus = { Pending: 0, Completed: 1 };
    // const pendingTasks = await toDoContract.getTasksByStatus(userAddress, TaskStatus.Pending);
    // const completedTasks = await toDoContract.getTasksByStatus(userAddress, TaskStatus.Completed);


    // console.log(`\n📋 Task Summary for user ${userAddress}:\n`);

    // if (pendingTasks.length > 0) {
    //     console.log(`Pending tasks (${pendingTasks.length}):`);
    //     pendingTasks.forEach((task, i) => {
    //         console.log(`- Pending Task ${i + 1}:`, {
    //             id: task.id.toString(),
    //             description: task.description,
    //             date: task.date.toString(),
    //             isModified: task.isModified,
    //         });
    //     });
    // } else if (completedTasks.length > 0) {
    //     console.log(`No pending tasks found.`);
    //     console.log(`Completed tasks (${completedTasks.length}):`);
    //     completedTasks.forEach((task, i) => {
    //         console.log(`- Completed Task ${i + 1}:`, {
    //             id: task.id.toString(),
    //             description: task.description,
    //             date: task.date.toString(),
    //             isModified: task.isModified,
    //         });
    //     });
    // } else {
    //     console.log("No tasks (pending or completed) found for this user.");
    // }
    // console.log(`\nCompleted tasks for user ${userAddress}: ${completedTasks.length}`);
    // completedTasks.forEach((task, i) => {
    //     console.log(`- Task ${i + 1}:`, {
    //         id: task.id.toString(),
    //         description: task.description,
    //         date: task.date.toString(),
    //         isModified: task.isModified,
    //     });
    // });

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
