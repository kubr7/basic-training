const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Deploying ToDoContract...");
  const ToDoContract = await ethers.getContractFactory("ToDoContract");
  const proxy = await upgrades.deployProxy(ToDoContract, [], {
    initializer: "initialize",
    kind: "transparent",
  });

  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();

  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
  console.log("ProxyAdmin address:", adminAddress);

  const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Logic/Implementation deployed at:", impl);

  return {
    proxyAddress: proxyAddress,
    contract: proxy,
  };
}

main()
  .then((result) => {
    console.log("\n TodoContract deployment completed!");
    console.log("Proxy address:", result.proxyAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Proxy deployment failed:", error.message);
    process.exit(1);
  });
