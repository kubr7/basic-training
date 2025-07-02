const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying ToDoContract...");
    const ToDoContract = await ethers.getContractFactory("ToDoContract");
    const todoContract = await ToDoContract.deploy();
    await todoContract.waitForDeployment();
    const todoAddress = await todoContract.getAddress();
    
    return {
        address: todoAddress,
        contract: todoContract,
    };
}

main()
    .then((result) => {
        console.log("\n TodoContract deployment completed!");
        console.log("TodoContract address:", result.address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("TodoContract deployment failed:", error.message);
        process.exit(1);
    });
