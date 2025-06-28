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

    const initialTaskCount = await toDoContract.taskCount();
    console.log("Initial task count:", initialTaskCount.toString());

    const finalTaskCount = await toDoContract.taskCount();
    console.log("Total Task after Creation:", finalTaskCount.toString());

    const activeTaskCount = await toDoContract.getActiveTaskCount();
    console.log("Active tasks:", activeTaskCount.toString());



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
