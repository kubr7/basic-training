const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Comprehensive ToDo Contract Demonstration");
    console.log("=".repeat(60));

    // Contract Setup and Validation
    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.log("❌ To-Do Contract address is missing in .env file.");
        return;
    }

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);
    const userTaskCount = await toDoContract.userTaskCountContract();

    console.log("\n📋 Contract Information:");
    console.log("- To-Do Contract Address:", contractAddress);
    console.log("- UserTaskCount Address:", userTaskCount);
    
    // Initial Status Check
    const initialActiveTaskCount = await toDoContract.getActiveTaskCount();
    const initialTaskCount = await toDoContract.taskCount();
    console.log("\n📊 Initial Status:");
    console.log("- Total Tasks (Ever Created):", initialTaskCount.toString());
    console.log("- Active Tasks (Non-deleted):", initialActiveTaskCount.toString());

    console.log("\n" + "=".repeat(60));
    console.log("🆕 CREATING SAMPLE TASKS");
    console.log("=".repeat(60));

    // Create multiple tasks to demonstrate functionality
    console.log("\n📝 Creating sample tasks...");
    
    const taskData = [
        {
            assignee: process.env.USER_ADDRESS1 || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            description: "Complete project documentation and user guide",
            date: 28062025
        },
        {
            assignee: process.env.USER_ADDRESS2 || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
            description: "Write comprehensive unit tests for all functions",
            date: 29062025
        },
        {
            assignee: process.env.USER_ADDRESS3 || "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
            description: "Review and optimize smart contract gas usage",
            date: 30062025
        },
        {
            assignee: process.env.USER_ADDRESS4 || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
            description: "Deploy to testnet and perform integration testing",
            date: 1072025
        },
        {
            assignee: process.env.USER_ADDRESS1 || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            description: "Prepare presentation materials for demo",
            date: 2072025
        }
    ];

    // Create tasks
    for (let i = 0; i < taskData.length; i++) {
        const task = taskData[i];
        console.log(`\n  Creating Task ${i + 1}: "${task.description}"`);
        console.log(`  Assigned to: ${task.assignee}`);
        console.log(`  Due date: ${task.date}`);
        
        const tx = await toDoContract.createTask(task.assignee, task.description, task.date);
        await tx.wait();
        console.log(`  ✅ Task ${i + 1} created successfully!`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 QUERYING AND LISTING TASKS");
    console.log("=".repeat(60));

    // Get updated counts
    const currentTaskCount = await toDoContract.taskCount();
    const currentActiveTaskCount = await toDoContract.getActiveTaskCount();
    
    console.log("\n📈 Updated Status:");
    console.log("- Total Tasks Created:", currentTaskCount.toString());
    console.log("- Active Tasks:", currentActiveTaskCount.toString());

    // List all tasks
    console.log("\n📋 All Tasks Details:");
    if (currentTaskCount > 0) {
        for (let i = 1; i <= currentTaskCount; i++) {
            const task = await toDoContract.tasks(i);
            console.log(`\n  Task ${i}:`, {
                id: task.id.toString(),
                creator: task.creator,
                assignedTo: task.assignedTo,
                description: task.description,
                date: task.date.toString(),
                status: Number(task.status) === 0 ? "Pending" : "Completed",
                isDeleted: task.isDeleted,
                isModified: task.isModified
            });
        }
    }

    // List active tasks only
    console.log("\n🔄 Active Tasks (Non-deleted):");
    const activeTasksList = await toDoContract.getActiveTasks();
    if (activeTasksList.length > 0) {
        activeTasksList.forEach((task, index) => {
            console.log(`\n  Active Task ${index + 1}:`, {
                id: task.id.toString(),
                creator: task.creator,
                assignedTo: task.assignedTo,
                description: task.description,
                date: task.date.toString(),
                status: Number(task.status) === 0 ? "Pending" : "Completed",
                isModified: task.isModified
            });
        });
    }

    // User Management
    console.log("\n👥 User Management:");
    const allUsers = await toDoContract.getAllUsers();
    console.log("- All Users in System:", allUsers);
    console.log("- Total Users:", allUsers.length);

    // Tasks by Creator
    console.log("\n👤 Tasks Grouped by Creator:");
    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        const createdTasks = await toDoContract.getAllTaskByUserAsCreator(user);
        console.log(`\n  User ${user} created ${createdTasks.length} task(s):`);
        createdTasks.forEach((task, index) => {
            console.log(`    #${index + 1}: ID ${task.id.toString()} - "${task.description}" (${Number(task.status) === 0 ? "Pending" : "Completed"})`);
        });
    }

    // Tasks by Assignee
    console.log("\n🎯 Tasks Grouped by Assignee:");
    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        const assignedTasks = await toDoContract.getAllTaskByUserAsAssignee(user);
        console.log(`\n  User ${user} has ${assignedTasks.length} assigned task(s):`);
        assignedTasks.forEach((task, index) => {
            console.log(`    #${index + 1}: ID ${task.id.toString()} - "${task.description}" (${Number(task.status) === 0 ? "Pending" : "Completed"})`);
        });
    }

    // User Task Counts
    console.log("\n🔢 User Task Counts:");
    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        const count = await toDoContract.getUserTaskCount(user);
        console.log(`  ${i + 1}. User ${user}: ${count.toString()} task(s)`);
    }

    // Tasks by Date
    console.log("\n📅 Tasks by Date:");
    const dates = [28062025, 29062025, 30062025, 1072025, 2072025];
    for (const date of dates) {
        const tasksOnDate = await toDoContract.getTasksByDate(date);
        const dateStr = date.toString();
        const formattedDate = `${dateStr.slice(0,2)}-${dateStr.slice(2,4)}-${dateStr.slice(4)}`;
        console.log(`  ${formattedDate}: ${tasksOnDate.length} task(s)`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✏️  MODIFYING TASKS");
    console.log("=".repeat(60));

    // Modify a task
    if (currentTaskCount >= 2) {
        console.log("\n📝 Modifying Task 2...");
        const taskToModify = 2;
        const originalTask = await toDoContract.tasks(taskToModify);
        console.log("  Original:", {
            description: originalTask.description,
            date: originalTask.date.toString(),
            isModified: originalTask.isModified
        });

        const newDescription = "UPDATED: Write comprehensive unit tests with full coverage and edge cases";
        const newDate = 30062025;
        
        const modifyTx = await toDoContract.modifyTask(taskToModify, newDescription, newDate);
        await modifyTx.wait();

        const modifiedTask = await toDoContract.tasks(taskToModify);
        console.log("  ✅ Modified to:", {
            description: modifiedTask.description,
            date: modifiedTask.date.toString(),
            isModified: modifiedTask.isModified
        });
    }

    console.log("\n" + "=".repeat(60));
    console.log("🔄 UPDATING TASK STATUS");
    console.log("=".repeat(60));

    // Update task status (complete a task)
    if (currentTaskCount >= 1) {
        console.log("\n✅ Updating Task Status...");
        const taskToComplete = 1;
        const taskDetails = await toDoContract.tasks(taskToComplete);
        const [signer] = await ethers.getSigners();

        console.log(`  Task ${taskToComplete} Details:`);
        console.log("  - Assigned to:", taskDetails.assignedTo);
        console.log("  - Current signer:", signer.address);
        console.log(`  - Current status: ${Number(taskDetails.status) === 0 ? "Pending" : "Completed"}`);

        if (signer.address.toLowerCase() === taskDetails.assignedTo.toLowerCase()) {
            const statusTx = await toDoContract.updateTaskStatus(taskToComplete, 1);
            await statusTx.wait();
            console.log(`  ✅ Task ${taskToComplete} marked as completed!`);
        } else {
            console.log(`  ⚠️  Current signer is not the assignee for Task ${taskToComplete}. Cannot update status.`);
            console.log("  Note: In a real scenario, you would need to use the correct signer/account.");
        }
    }

    // Show pending vs completed task statistics
    console.log("\n📊 Task Status Analysis:");
    const updatedActiveTasksList = await toDoContract.getActiveTasks();
    let pendingCount = 0;
    let completedCount = 0;
    let modifiedCount = 0;

    for (const task of updatedActiveTasksList) {
        if (Number(task.status) === 0) {
            pendingCount++;
        } else {
            completedCount++;
        }
        if (task.isModified) {
            modifiedCount++;
        }
    }

    console.log("  - Pending Tasks:", pendingCount);
    console.log("  - Completed Tasks:", completedCount);
    console.log("  - Modified Tasks:", modifiedCount);

    console.log("\n" + "=".repeat(60));
    console.log("🗑️  DELETING TASK");
    console.log("=".repeat(60));

    // Delete a task
    if (currentTaskCount >= 3) {
        const taskToDelete = 3;
        console.log(`\n🗑️  Deleting Task ${taskToDelete}...`);
        
        const taskBeforeDelete = await toDoContract.tasks(taskToDelete);
        console.log("  Task to delete:", {
            id: taskBeforeDelete.id.toString(),
            description: taskBeforeDelete.description,
            isDeleted: taskBeforeDelete.isDeleted
        });

        const deleteTx = await toDoContract.deleteTask(taskToDelete);
        await deleteTx.wait();
        console.log(`  ✅ Task ${taskToDelete} has been deleted!`);

        // Verify deletion
        const taskAfterDelete = await toDoContract.tasks(taskToDelete);
        console.log("  Verification - isDeleted:", taskAfterDelete.isDeleted);
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 FINAL COMPREHENSIVE SUMMARY");
    console.log("=".repeat(60));

    // Final comprehensive summary
    const finalTaskCount = await toDoContract.taskCount();
    const finalActiveTaskCount = await toDoContract.getActiveTaskCount();
    const finalActiveTasksList = await toDoContract.getActiveTasks();

    console.log("\n📈 Overall Statistics:");
    console.log("- Total Tasks Ever Created:", finalTaskCount.toString());
    console.log("- Active Tasks (Non-deleted):", finalActiveTaskCount.toString());
    console.log("- Deleted Tasks:", (finalTaskCount - finalActiveTaskCount).toString());

    // Recalculate final stats
    let finalPendingCount = 0;
    let finalCompletedCount = 0;
    let finalModifiedCount = 0;

    for (const task of finalActiveTasksList) {
        if (Number(task.status) === 0) {
            finalPendingCount++;
        } else {
            finalCompletedCount++;
        }
        if (task.isModified) {
            finalModifiedCount++;
        }
    }

    console.log("\n📊 Active Task Breakdown:");
    console.log("- Pending Tasks:", finalPendingCount);
    console.log("- Completed Tasks:", finalCompletedCount);
    console.log("- Modified Tasks:", finalModifiedCount);

    // Final user statistics
    const finalUsers = await toDoContract.getAllUsers();
    console.log("\n👥 User Statistics:");
    console.log("- Total Users:", finalUsers.length);
    
    for (let i = 0; i < finalUsers.length; i++) {
        const user = finalUsers[i];
        const userCreatedTasks = await toDoContract.getAllTaskByUserAsCreator(user);
        const userAssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(user);
        const userTaskCount = await toDoContract.getUserTaskCount(user);
        
        console.log(`\n  User ${i + 1}: ${user}`);
        console.log(`    - Created: ${userCreatedTasks.length} task(s)`);
        console.log(`    - Assigned: ${userAssignedTasks.length} task(s)`);
        console.log(`    - Total Count: ${userTaskCount.toString()} task(s)`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEMONSTRATION COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n✨ This demonstration showcased:");
    console.log("  ✅ Task Creation (CRUD - Create)");
    console.log("  ✅ Task Modification (CRUD - Update)");
    console.log("  ✅ Task Status Updates");
    console.log("  ✅ Task Deletion (CRUD - Delete)");
    console.log("  ✅ Task Querying (CRUD - Read)");
    console.log("  ✅ User Management");
    console.log("  ✅ Statistics and Analytics");
    console.log("  ✅ Date-based Filtering");
    console.log("  ✅ Status-based Filtering");
    console.log("  ✅ Contract State Management");
}

main()
    .then(() => {
        console.log("\n🚀 All contract interactions completed successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("\n❌ Error occurred:", err.message);
        console.error("Stack:", err.stack);
        process.exit(1);
    });
