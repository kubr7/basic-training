const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying UserTaskCount...");

    const UserTaskCount = await ethers.getContractFactory("UserTaskCount");
    
    console.log("Deploying UserTaskCount contract...");
    const userTaskCount = await UserTaskCount.deploy();
    
    await userTaskCount.waitForDeployment();
    const userTaskCountAddress = await userTaskCount.getAddress();
    
    console.log("UserTaskCount deployed successfully!");
    console.log("Contract address:", userTaskCountAddress);
    
    return {
        address: userTaskCountAddress,
        contract: userTaskCount
    };
}

main()
    .then((result) => {
        console.log("\n UserTaskCount deployment completed!");
        console.log("Contract address:", result.address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("UserTaskCount deployment failed:", error.message);
        process.exit(1);
    });
