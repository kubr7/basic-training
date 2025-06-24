// test/TodoContract.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoContract", function () {
  let TodoContract, UserTaskCount, todoContract, userTaskCountContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    // Get signers
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy UserTaskCount first
    UserTaskCount = await ethers.getContractFactory("UserTaskCount");
    userTaskCountContract = await UserTaskCount.deploy();
    await userTaskCountContract.waitForDeployment();

    // Deploy TodoContract with UserTaskCount address (auto-links)
    TodoContract = await ethers.getContractFactory("TodoContract");
    todoContract = await TodoContract.deploy(await userTaskCountContract.getAddress());
    await todoContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should deploy TodoContract with correct UserTaskCount link", async function () {
      const linkedAddress = await todoContract.userTaskCountContract();
      expect(linkedAddress).to.equal(await userTaskCountContract.getAddress());
    });

    it("should auto-link TodoContract in UserTaskCount", async function () {
      const linkedTodoAddress = await userTaskCountContract.todoContract();
      expect(linkedTodoAddress).to.equal(await todoContract.getAddress());
    });

    it("should initialize task count to 0", async function () {
      expect(await todoContract.taskCount()).to.equal(0);
    });

    it("should reject deployment with zero address", async function () {
      await expect(
        TodoContract.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid UserTaskCount address");
    });
  });

  describe("createTask", function () {
    const futureDate = 25122025; // DD/MM/YYYY format
    
    it("should create a task with correct details", async function () {
      const tx = await todoContract.createTask(addr1.address, "Test Task", futureDate);
      const receipt = await tx.wait();

      await expect(tx)
        .to.emit(todoContract, "TaskCreated");

      const task = await todoContract.tasks(1);
      expect(task.id).to.equal(1);
      expect(task.description).to.equal("Test Task");
      expect(task.creator).to.equal(owner.address);
      expect(task.assignedTo).to.equal(addr1.address);
      expect(task.date).to.equal(futureDate);
      expect(task.status).to.equal(0); // Pending
      expect(task.isDeleted).to.equal(false);
      expect(task.isModified).to.equal(false);
    });

    it("should increment task count", async function () {
      await todoContract.createTask(addr1.address, "Task 1", futureDate);
      expect(await todoContract.taskCount()).to.equal(1);
      
      await todoContract.createTask(addr2.address, "Task 2", futureDate);
      expect(await todoContract.taskCount()).to.equal(2);
    });

    it("should update UserTaskCount for assigned user", async function () {
      await todoContract.createTask(addr1.address, "Task for addr1", futureDate);
      const taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(1);
    });

    it("should add users to userList", async function () {
      await todoContract.createTask(addr1.address, "Task 1", futureDate);
      await todoContract.createTask(addr2.address, "Task 2", futureDate);
      
      const users = await todoContract.getAllUsers();
      expect(users).to.include(owner.address); // creator
      expect(users).to.include(addr1.address); // assigned
      expect(users).to.include(addr2.address); // assigned
    });

    it("should fail if assigned address is zero", async function () {
      await expect(
        todoContract.createTask(ethers.ZeroAddress, "Bad Task", futureDate)
      ).to.be.revertedWith("Assigned address can not be zero");
    });

    it("should fail if date is in the past", async function () {
      const pastDate = 1012020; // Past date (DD/MM/YYYY)
      await expect(
        todoContract.createTask(addr1.address, "Past Task", pastDate)
      ).to.be.revertedWith("Date can not be in past");
    });
  });

  describe("modifyTask", function () {
    const futureDate = 25122025;
    const newDate = 26122025;

    beforeEach(async () => {
      await todoContract.createTask(addr1.address, "Original Task", futureDate);
    });

    it("should modify task description and date", async function () {
      const tx = await todoContract.modifyTask(1, "Updated Task", newDate);
      
      await expect(tx)
        .to.emit(todoContract, "TaskModified");

      const task = await todoContract.tasks(1);
      expect(task.description).to.equal("Updated Task");
      expect(task.date).to.equal(newDate);
      expect(task.isModified).to.equal(true);
    });

    it("should fail if called by non-creator", async function () {
      await expect(
        todoContract.connect(addr1).modifyTask(1, "Hack Task", newDate)
      ).to.be.revertedWith("Only creator can call this");
    });

    it("should fail if task is completed", async function () {
      // Complete the task first
      await todoContract.connect(addr1).updateTaskStatus(1, 1);
      
      await expect(
        todoContract.modifyTask(1, "Should Fail", newDate)
      ).to.be.revertedWith("Can not modify completed task");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        todoContract.modifyTask(999, "Non-existent", newDate)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("deleteTask", function () {
    const futureDate = 25122025;

    beforeEach(async () => {
      await todoContract.createTask(addr1.address, "To Delete", futureDate);
    });

    it("should delete task by creator", async function () {
      const tx = await todoContract.deleteTask(1);
      await expect(tx)
        .to.emit(todoContract, "TaskDeleted");
    });

    it("should fail if called by non-creator", async function () {
      await expect(
        todoContract.connect(addr1).deleteTask(1)
      ).to.be.revertedWith("Only creator can call this");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        todoContract.deleteTask(999)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("updateTaskStatus", function () {
    const futureDate = 25122025;

    beforeEach(async () => {
      await todoContract.createTask(addr1.address, "Status Task", futureDate);
    });

    it("should allow assigned user to complete task", async function () {
      const tx = await todoContract.connect(addr1).updateTaskStatus(1, 1);
      
      await expect(tx)
        .to.emit(todoContract, "TaskStatusUpdated");

      const task = await todoContract.tasks(1);
      expect(task.status).to.equal(1); // Completed
    });

    it("should fail if task already completed", async function () {
      await todoContract.connect(addr1).updateTaskStatus(1, 1);

      await expect(
        todoContract.connect(addr1).updateTaskStatus(1, 1)
      ).to.be.revertedWith("Cannot change status from Completed");
    });

    it("should fail with invalid status transition", async function () {
      await expect(
        todoContract.connect(addr1).updateTaskStatus(1, 0)
      ).to.be.revertedWith("Only allowed: Pending -> Completed");
    });

    it("should fail if not called by assigned user", async function () {
      await expect(
        todoContract.connect(owner).updateTaskStatus(1, 1)
      ).to.be.revertedWith("Only assign can call this");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        todoContract.connect(addr1).updateTaskStatus(999, 1)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("View Functions", function () {
    const futureDate = 25122025;
    const anotherDate = 26122025;

    beforeEach(async () => {
      // Create multiple tasks
      await todoContract.createTask(addr1.address, "Task 1", futureDate);
      await todoContract.createTask(addr1.address, "Task 2", futureDate);
      await todoContract.createTask(addr2.address, "Task 3", anotherDate);
      await todoContract.createTask(addr1.address, "Task 4", anotherDate);
      
      // Complete one task (task ID 2, the second task assigned to addr1)
      await todoContract.connect(addr1).updateTaskStatus(2, 1);
    });

    describe("getAllTaskByUser", function () {
      it("should return all tasks for a user", async function () {
        const ownerTasks = await todoContract.getAllTaskByUser(owner.address);
        expect(ownerTasks.length).to.equal(4); // creator of all tasks
        
        const addr1Tasks = await todoContract.getAllTaskByUser(addr1.address);
        expect(addr1Tasks.length).to.equal(3); // assigned to 3 tasks
        
        const addr2Tasks = await todoContract.getAllTaskByUser(addr2.address);
        expect(addr2Tasks.length).to.equal(1); // assigned to 1 task
      });
    });

    describe("getTasksByDate", function () {
      it("should return tasks for specific date", async function () {
        const tasksForDate1 = await todoContract.getTasksByDate(futureDate);
        expect(tasksForDate1.length).to.equal(2);
        
        const tasksForDate2 = await todoContract.getTasksByDate(anotherDate);
        expect(tasksForDate2.length).to.equal(2);
      });
    });

    describe("getAllUserTasksByDate", function () {
      it("should return user's tasks for specific date", async function () {
        const addr1TasksOnDate1 = await todoContract.getAllUserTasksByDate(addr1.address, futureDate);
        expect(addr1TasksOnDate1.length).to.equal(2);
        
        const addr1TasksOnDate2 = await todoContract.getAllUserTasksByDate(addr1.address, anotherDate);
        expect(addr1TasksOnDate2.length).to.equal(1);
      });
    });

    describe("getPendingTasks", function () {
      it("should return only pending tasks for user", async function () {
        const pendingTasks = await todoContract.getPendingTasks(addr1.address);
        expect(pendingTasks.length).to.equal(2); // 3 total - 1 completed = 2 pending
        
        for (const task of pendingTasks) {
          expect(task.status).to.equal(0); // Pending
          expect(task.isDeleted).to.equal(false);
        }
      });
    });

    describe("getCompletedTasks", function () {
      it("should return only completed tasks for user", async function () {
        const completedTasks = await todoContract.getCompletedTasks(addr1.address);
        expect(completedTasks.length).to.equal(1);
        
        expect(completedTasks[0].status).to.equal(1); // Completed
        expect(completedTasks[0].isDeleted).to.equal(false);
      });
    });

    describe("getTasksByStatus", function () {
      it("should return tasks filtered by status", async function () {
        const pendingTasks = await todoContract.getTasksByStatus(addr1.address, 0);
        expect(pendingTasks.length).to.equal(2);
        
        const completedTasks = await todoContract.getTasksByStatus(addr1.address, 1);
        expect(completedTasks.length).to.equal(1);
      });
    });

    describe("getAllUsers", function () {
      it("should return all unique users", async function () {
        const users = await todoContract.getAllUsers();
        expect(users).to.include(owner.address);
        expect(users).to.include(addr1.address);
        expect(users).to.include(addr2.address);
        expect(users.length).to.be.at.least(3);
      });
    });
  });

  describe("Date Conversion", function () {
    it("should correctly convert date format", async function () {
      const timestamp = await todoContract.convertDateToTimestamp(1012023);
      expect(timestamp).to.be.a('bigint');
      expect(timestamp).to.be.greaterThan(0);
    });

    it("should fail with invalid month", async function () {
      await expect(
        todoContract.convertDateToTimestamp(1132023)
      ).to.be.revertedWith("Invalid month");
    });

    it("should fail with invalid day", async function () {
      await expect(
        todoContract.convertDateToTimestamp(32012023)
      ).to.be.revertedWith("Invalid day");
    });

    it("should fail with invalid year", async function () {
      await expect(
        todoContract.convertDateToTimestamp(1011969)
      ).to.be.revertedWith("Year must be >= 1970");
    });
  });

  describe("UserTaskCount Integration", function () {
    const futureDate = 25122025;

    it("should increment user task count when creating tasks", async function () {
      await todoContract.createTask(addr1.address, "Task 1", futureDate);
      await todoContract.createTask(addr1.address, "Task 2", futureDate);
      
      const taskCount = await userTaskCountContract.getUserTaskCount(addr1.address);
      expect(taskCount).to.equal(2);
    });

    it("should allow only TodoContract to update UserTaskCount", async function () {
      await expect(
        userTaskCountContract.connect(addr1).updateMapping(addr1.address)
      ).to.be.revertedWith("Only TodoContract can call this");
    });
  });
});

// Utility function to get next block timestamp
async function getNextBlockTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp + 1;
}
