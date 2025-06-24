const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("Deploying TodoContract...");

    const userTaskCountAddress = process.env.USERTASKCOUNT_CONTRACT_ADDRESS;
    

    console.log("UserTaskCount address:", userTaskCountAddress);
    console.log("Source:", process.env.USERTASKCOUNT_CONTRACT_ADDRESS ? "Environment variable" : "Unknown");

    const TodoContract = await ethers.getContractFactory("TodoContract");
    
    console.log("Deploying TodoContract...");
    const todoContract = await TodoContract.deploy(userTaskCountAddress);
    
    await todoContract.waitForDeployment();
    const todoAddress = await todoContract.getAddress();
    
    console.log("TodoContract deployed successfully!");
    console.log("Contract address:", todoAddress);
    
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
