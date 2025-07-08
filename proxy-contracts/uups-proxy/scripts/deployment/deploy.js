const { ethers, upgrades} = require("hardhat");

async function main() {
    console.log("Deploying ToDoContract with UUPS Proxy...");
    const ToDoContract = await ethers.getContractFactory("ToDoContract");
    const proxy = await upgrades.deployProxy(ToDoContract, [], {
        initializer: "initialize",
        kind: "uups",
    });
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    console.log("UUPS Proxy deployed at:", proxyAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})