const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter, address;

  beforeEach(async function () {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();

    address = await counter.getAddress();
  });

  it("should deploy successfully", async function () {
    expect(address).to.not.equal(0);
    expect(address).to.not.equal(undefined);
    expect(address).to.not.equal(null);
  });

  it("count should be 0 at start", async function () {
    expect(await counter.count()).to.equal(0);
  });

  it("inc() should increases by 1", async function () {
    await counter.inc();
    expect(await counter.count()).to.equal(1);
  });

  it("should emit Increment event", async function () {
    await counter.inc();
    expect(await counter.inc())
      .to.emit(counter, "Increment")
      .withArgs(1);
  });

  it("dec() should decreases by 1", async function () {
    await counter.inc();
    await counter.dec();
    expect(await counter.count()).to.equal(0);
  });

  it("should emit Decrement event", async function () {
    await counter.inc();
    await counter.inc();
    expect(await counter.dec())
      .to.emit(counter, "Decrement")
      .withArgs(1);
  });

  it("should revert when dec() called at 0", async function () {
    await expect(counter.dec()).to.be.reverted;
  });

  it("should return correct count", async function () {
    await counter.inc();
    await counter.inc();
    const count1 = await counter.get();
    const count2 = await counter.count();
    expect(count1).to.equal(count2);
  });
});
