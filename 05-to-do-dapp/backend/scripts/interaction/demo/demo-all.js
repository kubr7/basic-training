const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Interacting with contracts...");

    const contractAddress = process.env.TODO_CONTRACT_ADDRESS;

    if (!contractAddress) {
        console.log("To-Do Contract address is missing in .env file.");
        return;
    }

    console.log("To-Do Contract Address:", contractAddress);

    const toDoContract = await ethers.getContractAt("ToDoContract", contractAddress);

    const userTaskCount = await toDoContract.userTaskCountContract();
    console.log("UserTaskCount Address:", userTaskCount);

    
    console.log("________________________________________________________");

    const initialTaskCount = await toDoContract.taskCount();
    console.log("Initial task count:", initialTaskCount.toString());

    console.log("________________________________________________________");

    console.log("Creating tasks...");

    const task1 = await toDoContract.createTask(process.env.USER_ADDRESS1, "Complete project documentation", 28062025);
    await task1.wait();
    console.log("Task 1 created.");

    const task2 = await toDoContract.createTask(process.env.USER_ADDRESS4, "Write unit tests", 28062025);
    await task2.wait();
    console.log("Task 2 created.");

    const task3 = await toDoContract.createTask(process.env.USER_ADDRESS2, "Review interaction script", 29062025);
    await task3.wait();
    console.log("Task 3 created.");

    console.log("________________________________________________________");

    const finalTaskCount = await toDoContract.taskCount();
    console.log("Total Task after Creation:", finalTaskCount.toString());

    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks:", activeTaskCount.toString());
    
    console.log("________________________________________________________");
    // List all created tasks
    if (finalTaskCount > 0) {
        console.log("\nTasks Details:");
        for (let i = 1; i <= finalTaskCount; i++) {
            const task = await toDoContract.tasks(i);
            console.log(`Task ${i}:`, {
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

    console.log("________________________________________________________");

    console.log("\n Getting all users...");
    const allUsers = await toDoContract.getAllUsers();
    console.log("All users:", allUsers);

    console.log("\n Tasks created by users:");
    for (let user of allUsers) {
        const created = await toDoContract.getAllTaskByUserAsCreator(user);
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

    console.log("________________________________________________________");

    console.log("\nTasks assigned to users:");
    for (let user of allUsers) {
        const assigned = await toDoContract.getAllTaskByUserAsAssignee(user);
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

    console.log("________________________________________________________");

    // User task counts (via toDoContract)
    console.log("\nUser task counts:");
    for (let user of allUsers) {
        const count = await toDoContract.getUserTaskCount(user);
        console.log(`User ${user}: ${count.toString()} task(s)`);
    }

    console.log("________________________________________________________");

    console.log("\nGetting tasks by date:");
    const tasksOn2606 = await toDoContract.getTasksByDate(26062025);
    const tasksOn2706 = await toDoContract.getTasksByDate(27062025);
    console.log("Tasks on 26-06-2025:", tasksOn2606.length);
    console.log("Tasks on 27-06-2025:", tasksOn2706.length);

    if (finalTaskCount >= 1) {
        console.log("\nModifying Task 1...");
        const modifyTx = await toDoContract.modifyTask(
            2,
            "Updated Task 2 - Write unit tests with all edge cases",
            28062025
        );
        await modifyTx.wait();

        const modified = await toDoContract.tasks(1);
        console.log(" Task 1 modified:", {
            id: modified.id.toString(),
            description: modified.description,
            date: modified.date.toString(),
            isModified: modified.isModified
        });
    }

    console.log("________________________________________________________");

    if (finalTaskCount >= 2) {
        console.log("\nUpdating Task 1 status...");
        const task1 = await toDoContract.tasks(1);
        const [signer] = await ethers.getSigners();

        console.log("Task 1 assigned to:", task1.assignedTo);
        console.log("Current signer:", signer.address);

        if (signer.address.toLowerCase() === task1.assignedTo.toLowerCase()) {
            const statusTx = await toDoContract.updateTaskStatus(1, 1);
            await statusTx.wait();
            console.log(" Task 19 marked as completed");
        } else {
            console.log(" Current signer is not the assignee for Task 19, Can't Update");
        }
    }

    console.log("________________________________________________________");


    console.log("\nDeleting Task");
    const taskId = 1;
    const tx = await toDoContract.deleteTask(taskId);
    const receipt = await tx.wait();
    console.log(`Task ${taskId} has been deleted.`);

    for (const event of receipt.events) {
        try {
            const parsed = toDoContract.interface.parseLog(event);
            if (parsed.name === "TaskDeleted") {
                console.log("Event Emitted -> TaskDeleted:", parsed.args);
            }
        } catch (err) {
            console.log("Error", err.message);
        }
    }

    console.log("________________________________________________________");


    console.log("\nFinal Summary:");
    const totalTasks = await toDoContract.taskCount();
    const activeTasks = await toDoContract.getActiveTaskCount();
    console.log("Total tasks ever created:", totalTasks.toString());
    console.log("Active tasks (non-deleted):", activeTasks.toString());

    const updatedUsers = await toDoContract.getAllUsers();
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
