const { ethers } = require("hardhat");

async function main() {
    proxyAddress = process.env.PROXY_ADDRESS;

    const ToDoContractV2 = await ethers.getContractFactory("ToDoContractV2");

    const contract = ToDoContractV2.attach(proxyAddress);

    const totalTasks = await contract.getTotalTaskCount();
    console.log("Total tasks:", totalTasks.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})