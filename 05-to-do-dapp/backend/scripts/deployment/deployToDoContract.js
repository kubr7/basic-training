const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Deploying ToDoContract...");
    const userTaskCountAddress = process.env.USERTASKCOUNT_CONTRACT_ADDRESS;
    const ToDoContract = await ethers.getContractFactory("ToDoContract");
    const todoContract = await ToDoContract.deploy(userTaskCountAddress);
    await todoContract.waitForDeployment();
    const todoAddress = await todoContract.getAddress();
    
    return {
        address: todoAddress,
        contract: todoContract,
        userTaskCountAddress: userTaskCountAddress
    };
}

main()
    .then((result) => {
        console.log("\n TodoContract deployment completed!");
        console.log("TodoContract address:", result.address);
        console.log("UserTaskCount address:", result.userTaskCountAddress);
        process.exit(0);
    })
    .catch((error) => {
        console.error("TodoContract deployment failed:", error.message);
        process.exit(1);
    });
