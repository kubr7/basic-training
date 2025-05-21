// scripts/deploy.ts
import { ethers, run } from "hardhat";

const main = async (): Promise<void> => {
    await run("compile"); // Compile the contract
    console.log("Deploying contract...");

    const ContractFactory = await ethers.getContractFactory("RPSGameContract");
    const contract = await ContractFactory.deploy();

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("Contract deployed to:", address);

    // Wait for a few block confirmations before verifying
    console.log("Waiting for block confirmations...");
    await contract.deploymentTransaction()?.wait(5);

    // Verify the contract on Etherscan
    console.log("Verifying contract on Etherscan...");
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: [],
        });
        console.log("Contract verified successfully");
    } catch (error) {
        console.error("Error verifying contract:", error);
    }
};

const runMain = async (): Promise<void> => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
};

runMain();
