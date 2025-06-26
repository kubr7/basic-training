const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Interacting with contracts...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;
    const userTaskCountAddress = process.env.USERTASKCOUNT_CONTRACT_ADDRESS;

    // Check for missing environment variables
    if (!contractAddress || !userTaskCountAddress) {
        console.log("Contract addresses are missing in .env file.");
        return;
    }

    console.log("ToDoContract Address:", contractAddress);
    console.log("UserTaskCount Address:", userTaskCountAddress);

    // Get contract instances
    const ToDoContract = await ethers.getContractAt("ToDoContract", contractAddress);
    const UserTaskCountContract = await ethers.getContractAt("UserTaskCount", userTaskCountAddress);

    // Get how many tasks currently exist
    const initialTaskCount = await ToDoContract.taskCount();
    console.log("Initial task count:", initialTaskCount.toString());



    const task1 = await ToDoContract.createTask(process.env.USER_ADDRESS1, "Complete project documentation", 27062025);
    await task1.wait();
    console.log("Task 1 created.");

    const task2 = await ToDoContract.createTask(process.env.USER_ADDRESS4, "Write unit tests", 28062025);
    await task2.wait();
    console.log("Task 2 created.");

    const task3 = await ToDoContract.createTask(process.env.USER_ADDRESS2, "Review interaction script", 27062025);
    await task3.wait();
    console.log("Task 3 created.");


    // Check task count after task creation
    const finalTaskCount = await ToDoContract.taskCount();
    const activeTaskCount = await ToDoContract.getActiveTaskCount();
    console.log("\nTotal tasks created:", finalTaskCount.toString());
    console.log("Active tasks:", activeTaskCount.toString());

    // List all created tasks
    if (finalTaskCount > 0) {
        console.log("\nTasks Details:");
        for (let i = 1; i <= finalTaskCount; i++) {
            const task = await ToDoContract.tasks(i);
            console.log(`Task ${i}:`, {
                id: task.id.toString(),
                creator: task.creator,
                assignedTo: task.assignedTo,
                description: task.description,
                date: task.date.toString(),
                status: task.status.toString() === "0" ? "Pending" : "Completed",
                isDeleted: task.isDeleted,
                isModified: task.isModified
            });
        }
    }

    // Check all users in the system
    console.log("\n Getting all users...");
    const allUsers = await ToDoContract.getAllUsers();
    console.log("All users:", allUsers);

    // Tasks created by each user
    console.log("\n Tasks created by users:");
    for (let user of allUsers) {
        const created = await ToDoContract.getAllTaskByUserAsCreator(user);
        console.log(`User ${user} created ${created.length} task(s)`);
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

    // Tasks assigned to each user
    console.log("\nTasks assigned to users:");
    for (let user of allUsers) {
        const assigned = await ToDoContract.getAllTaskByUserAsAssignee(user);
        console.log(`User ${user} has ${assigned.length} assigned task(s)`);
        assigned.forEach((task, index) => {
            console.log(`  #${index + 1}:`, {
                id: task.id.toString(),
                creator: task.creator,
                description: task.description,
                date: task.date.toString(),
                status: Number(task.status) === 0 ? "Pending" : "Completed"
            });
        });
    }

    // UserTaskCount contract test
    console.log("\nUser task counts:");
    for (let user of allUsers) {
        const count = await UserTaskCountContract.getUserTaskCount(user);
        console.log(`User ${user}: ${count.toString()} task(s)`);
    }

    // Fetch tasks by date
    console.log("\nGetting tasks by date:");
    const tasksOn2606 = await ToDoContract.getTasksByDate(26062025);
    const tasksOn2706 = await ToDoContract.getTasksByDate(27062025);
    console.log("Tasks on 26-06-2025:", tasksOn2606.length);
    console.log("Tasks on 27-06-2025:", tasksOn2706.length);

    // Modify task (by creator)
    if (finalTaskCount >= 1) {
        console.log("\nModifying Task 1...");
        const modifyTx = await ToDoContract.modifyTask(
            2,
            "Updated Task 2 - Write unit tests with all edge cases",
            28062025
        );
        await modifyTx.wait();

        const modified = await ToDoContract.tasks(1);
        console.log(" Task 1 modified:", {
            id: modified.id.toString(),
            description: modified.description,
            date: modified.date.toString(),
            isModified: modified.isModified
        });
    }

    // Update task status (by assignee)
    if (finalTaskCount >= 2) {
        console.log("\nUpdating Task 19 status...");
        const task2 = await ToDoContract.tasks(19);
        const [signer] = await ethers.getSigners();

        console.log("Task 19 assigned to:", task2.assignedTo);
        console.log("Current signer:", signer.address);

        if (signer.address.toLowerCase() === task2.assignedTo.toLowerCase()) {
            const statusTx = await ToDoContract.updateTaskStatus(19, 1);
            await statusTx.wait();
            console.log(" Task 19 marked as completed");
        } else {
            console.log(" Current signer is not the assignee for Task 19, Can't Update");
        }
    }

    console.log("\nFinal Summary:");
    const totalTasks = await ToDoContract.taskCount();
    const activeTasks = await ToDoContract.getActiveTaskCount();
    console.log("Total tasks ever created:", totalTasks.toString());
    console.log("Active tasks (non-deleted):", activeTasks.toString());

    const updatedUsers = await ToDoContract.getAllUsers();
    console.log("All users:", updatedUsers);
}

main()
    .then(() => {
        console.log("\n Done! All contract interactions complete.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error occurred:", err.message);
        process.exit(1);
    });
