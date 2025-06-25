const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying UserTaskCount...");
    const UserTaskCount = await ethers.getContractFactory("UserTaskCount");
    const userTaskCount = await UserTaskCount.deploy();
    await userTaskCount.waitForDeployment();
    const userTaskCountAddress = await userTaskCount.getAddress();
    
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
