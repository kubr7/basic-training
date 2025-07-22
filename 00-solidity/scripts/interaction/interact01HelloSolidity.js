const { ethers } = require("hardhat");
require("dotenv").config();


async function main() {
    console.log("Interacting with HelloSolidity Smart Contract...");
    const contractAddress = process.env.HELLO_SOLIDITY_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("HELLO_SOLIDITY_CONTRACT_ADDRESS not found in environment variables");
    }
    console.log("HelloSolidity Address:", contractAddress);
    const helloSolidity = await ethers.getContractAt("HelloSolidity", contractAddress);

    // Get greetings
    const greet = await helloSolidity.greet();
    console.log("Greet:", greet);
}


main()
    .then(() => {
        console.log("\nContract interaction completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Contract interaction failed:", error.message);
        process.exit(1);
    });

