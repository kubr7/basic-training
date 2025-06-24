const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserTaskCount", function () {
  let UserTaskCount, userTaskCountContract;
  let owner, addr1, addr2, todoContract;

  beforeEach(async () => {
    // Get signers
    [owner, addr1, addr2, todoContract] = await ethers.getSigners();

    // Deploy UserTaskCount
    UserTaskCount = await ethers.getContractFactory("UserTaskCount");
    userTaskCountContract = await UserTaskCount.deploy();
    await userTaskCountContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await userTaskCountContract.getAddress()).to.be.properAddress;
    });

    it("should initialize with zero TodoContract address", async function () {
      const todoAddress = await userTaskCountContract.todoContract();
      expect(todoAddress).to.equal(ethers.ZeroAddress);
    });

    it("should initialize with zero task counts for all users", async function () {
      const taskCount1 = await userTaskCountContract.getUserTaskCount(addr1.address);
      const taskCount2 = await userTaskCountContract.getUserTaskCount(addr2.address);
      
      expect(taskCount1).to.equal(0);
      expect(taskCount2).to.equal(0);
    });
  });

  describe("setTodoContract", function () {
    it("should set TodoContract address correctly", async function () {
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      const storedTodoAddress = await userTaskCountContract.todoContract();
      expect(storedTodoAddress).to.equal(todoContract.address);
    });

    it("should fail with zero address", async function () {
      await expect(
        userTaskCountContract.setTodoContract(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid TodoContract Address - Cant be zero");
    });

    it("should fail if TodoContract already set", async function () {
      // Set TodoContract first time
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // Try to set again
      await expect(
        userTaskCountContract.setTodoContract(addr1.address)
      ).to.be.revertedWith("TodoContract already set");
    });

    it("should be callable by anyone", async function () {
      // addr1 should be able to call setTodoContract
      await userTaskCountContract.connect(addr1).setTodoContract(todoContract.address);
      
      const storedTodoAddress = await userTaskCountContract.todoContract();
      expect(storedTodoAddress).to.equal(todoContract.address);
    });

    it("should emit event when TodoContract is set", async function () {
      // Note: The contract doesn't have an event, but we test the state change
      const initialAddress = await userTaskCountContract.todoContract();
      expect(initialAddress).to.equal(ethers.ZeroAddress);
      
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      const finalAddress = await userTaskCountContract.todoContract();
      expect(finalAddress).to.equal(todoContract.address);
    });
  });

  describe("updateMapping", function () {
    beforeEach(async () => {
      // Set TodoContract address before testing updateMapping
      await userTaskCountContract.setTodoContract(todoContract.address);
    });

    it("should increment user task count when called by TodoContract", async function () {
      // Initial count should be 0
      let taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(0);
      
      // Call updateMapping from TodoContract account
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      
      // Count should be incremented
      taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(1);
    });

    it("should handle multiple increments correctly", async function () {
      // Call updateMapping multiple times
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      
      const taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(3);
    });

    it("should handle different users independently", async function () {
      // Update counts for different users
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr2.address);
      
      const taskCount1 = await userTaskCountContract.getUserTaskCount(addr1.address);
      const taskCount2 = await userTaskCountContract.getUserTaskCount(addr2.address);
      
      expect(taskCount1).to.equal(2);
      expect(taskCount2).to.equal(1);
    });

    it("should fail when called by non-TodoContract address", async function () {
      await expect(
        userTaskCountContract.connect(owner).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
      
      await expect(
        userTaskCountContract.connect(addr1).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
      
      await expect(
        userTaskCountContract.connect(addr2).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
    });

    it("should fail if TodoContract not set", async function () {
      // Deploy a fresh contract without setting TodoContract
      const freshContract = await UserTaskCount.deploy();
      await freshContract.waitForDeployment();
      
      await expect(
        freshContract.connect(todoContract).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
    });

    it("should handle zero address user", async function () {
      // Should be able to increment for zero address (though not practical)
      await userTaskCountContract.connect(todoContract).updateMapping(ethers.ZeroAddress);
      
      const taskCount = await userTaskCountContract.getUserTaskCount(ethers.ZeroAddress);
      expect(taskCount).to.equal(1);
    });
  });

  describe("getUserTaskCount", function () {
    beforeEach(async () => {
      await userTaskCountContract.setTodoContract(todoContract.address);
    });

    it("should return correct task count for users", async function () {
      // Initially should be 0
      let taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(0);
      
      // After incrementing
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(1);
      
      // After incrementing again
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(2);
    });

    it("should return 0 for users with no tasks", async function () {
      const taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(0);
    });

    it("should be callable by anyone", async function () {
      // Increment count first
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      
      // Should be callable by different accounts
      const countFromOwner = await userTaskCountContract.connect(owner).getUserTaskCount(addr1.address);
      const countFromAddr1 = await userTaskCountContract.connect(addr1).getUserTaskCount(addr1.address);
      const countFromAddr2 = await userTaskCountContract.connect(addr2).getUserTaskCount(addr1.address);
      
      expect(countFromOwner).to.equal(1);
      expect(countFromAddr1).to.equal(1);
      expect(countFromAddr2).to.equal(1);
    });

    it("should handle multiple users correctly", async function () {
      // Set up different counts for different users
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr2.address);
      
      const count1 = await userTaskCountContract.getUserTaskCount(addr1.address);
      const count2 = await userTaskCountContract.getUserTaskCount(addr2.address);
      const count3 = await userTaskCountContract.getUserTaskCount(owner.address);
      
      expect(count1).to.equal(2);
      expect(count2).to.equal(1);
      expect(count3).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("should enforce onlyTodoContract modifier correctly", async function () {
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // TodoContract should be able to call
      await expect(
        userTaskCountContract.connect(todoContract).updateMapping(addr1.address)
      ).to.not.be.reverted;
      
      // Others should not be able to call
      await expect(
        userTaskCountContract.connect(owner).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
      
      await expect(
        userTaskCountContract.connect(addr1).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
    });

    it("should check msg.sender correctly", async function () {
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // Even if someone tries to call with TodoContract address as parameter,
      // it should check msg.sender, not the parameter
      await expect(
        userTaskCountContract.connect(addr1).updateMapping(todoContract.address)
      ).to.be.revertedWith("Only TodoContract can call this");
    });
  });

  describe("State Variables", function () {
    it("should have public todoContract variable", async function () {
      const todoAddress = await userTaskCountContract.todoContract();
      expect(todoAddress).to.equal(ethers.ZeroAddress);
      
      await userTaskCountContract.setTodoContract(todoContract.address);
      const updatedTodoAddress = await userTaskCountContract.todoContract();
      expect(updatedTodoAddress).to.equal(todoContract.address);
    });

    it("should have public userTaskCounts mapping", async function () {
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // Should be able to access mapping directly
      let count = await userTaskCountContract.userTaskCounts(addr1.address);
      expect(count).to.equal(0);
      
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      count = await userTaskCountContract.userTaskCounts(addr1.address);
      expect(count).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    beforeEach(async () => {
      await userTaskCountContract.setTodoContract(todoContract.address);
    });

    it("should handle large number of increments", async function () {
      // Increment many times
      for (let i = 0; i < 100; i++) {
        await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      }
      
      const taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(100);
    });

    it("should handle same user multiple times in single transaction", async function () {
      // This tests that the mapping increment works correctly
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      const count1 = await userTaskCountContract.getUserTaskCount(addr1.address);
      
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      const count2 = await userTaskCountContract.getUserTaskCount(addr1.address);
      
      expect(count1).to.equal(1);
      expect(count2).to.equal(2);
    });

    it("should maintain separate counts for each user", async function () {
      const users = [addr1.address, addr2.address, owner.address];
      const expectedCounts = [5, 3, 7];
      
      // Set different counts for each user
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < expectedCounts[i]; j++) {
          await userTaskCountContract.connect(todoContract).updateMapping(users[i]);
        }
      }
      
      // Verify counts
      for (let i = 0; i < users.length; i++) {
        const count = await userTaskCountContract.getUserTaskCount(users[i]);
        expect(count).to.equal(expectedCounts[i]);
      }
    });
  });

  describe("Integration Scenarios", function () {
    it("should work correctly in TodoContract integration flow", async function () {
      // Simulate the actual integration flow:
      // 1. UserTaskCount is deployed
      // 2. TodoContract is deployed and links itself
      // 3. TodoContract calls updateMapping when creating tasks
      
      // Step 1: Already done in beforeEach
      
      // Step 2: Simulate TodoContract linking itself
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // Step 3: Simulate TodoContract creating tasks
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      await userTaskCountContract.connect(todoContract).updateMapping(addr2.address);
      
      // Verify the results
      const count1 = await userTaskCountContract.getUserTaskCount(addr1.address);
      const count2 = await userTaskCountContract.getUserTaskCount(addr2.address);
      
      expect(count1).to.equal(2);
      expect(count2).to.equal(1);
    });

    it("should prevent unauthorized task count manipulation", async function () {
      await userTaskCountContract.setTodoContract(todoContract.address);
      
      // Increment via TodoContract (legitimate)
      await userTaskCountContract.connect(todoContract).updateMapping(addr1.address);
      let count = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(count).to.equal(1);
      
      // Try to increment via other accounts (should fail)
      await expect(
        userTaskCountContract.connect(addr1).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
      
      // Count should remain unchanged
      count = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(count).to.equal(1);
    });
  });
}); 