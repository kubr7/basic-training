const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloSolidity", function () {
  let helloSolidity, address;

  beforeEach(async function () {
    const HelloSolidity = await ethers.getContractFactory("HelloSolidity");
    helloSolidity = await HelloSolidity.deploy();
    await helloSolidity.waitForDeployment();

    address = await helloSolidity.getAddress();
  });

  it("should return correct greeting", async function () {
    const greeting = await helloSolidity.greet();
    expect(greeting).to.equal("Hello Solidity");
  });

  it("should deploy successfully", async function () {
    expect(address).to.not.equal(0);
    expect(address).to.not.equal(undefined);
    expect(address).to.not.equal(null);
  });
});
