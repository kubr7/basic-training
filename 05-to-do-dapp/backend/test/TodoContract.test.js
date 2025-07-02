// test/ToDoContract.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ToDoContract", function () {
  let ToDoContract, toDoContract;
  // let UserTaskCount, userTaskCountContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // UserTaskCount = await ethers.getContractFactory("UserTaskCount");
    // userTaskCountContract = await UserTaskCount.deploy();
    // await userTaskCountContract.waitForDeployment();

    // Deploy TodoContract with UserTaskCount address (auto-links)
    ToDoContract = await ethers.getContractFactory("ToDoContract");
    toDoContract = await ToDoContract.deploy();
    // toDoContract = await ToDoContract.deploy(await userTaskCountContract.getAddress());
    await toDoContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should initialize task count to 0", async function () {
      expect(await toDoContract.taskCount()).to.equal(0);
    });
  });

  describe("createTask", function () {
    const futureDate = 25122025;

    it("should create a task with correct details", async function () {
      const tx = await toDoContract.createTask(addr1.address, "Test Task", futureDate);
      const receipt = await tx.wait();

      await expect(tx)
        .to.emit(toDoContract, "TaskCreated");

      const task = await toDoContract.tasks(1);
      expect(task.id).to.equal(1);
      expect(task.description).to.equal("Test Task");
      expect(task.creator).to.equal(owner.address);
      expect(task.assignedTo).to.equal(addr1.address);
      expect(task.date).to.equal(futureDate);
      expect(Number(task.status)).to.equal(0);
      expect(task.isDeleted).to.equal(false);
      expect(task.isModified).to.equal(false);
    });

    it("should increment task count", async function () {
      await toDoContract.createTask(addr1.address, "Task 1", futureDate);
      expect(await toDoContract.taskCount()).to.equal(1);

      await toDoContract.createTask(addr2.address, "Task 2", futureDate);
      expect(await toDoContract.taskCount()).to.equal(2);
    });

    // it("should update UserTaskCount for assigned user", async function () {
    //   await toDoContract.createTask(addr1.address, "Task for addr1", futureDate);
    //   const taskCount = await toDoContract.getUserTaskCount(addr1.address);
    //   expect(taskCount).to.equal(1);
    // });

    // it("should add users to userList", async function () {
    //   await toDoContract.createTask(addr1.address, "Task 1", futureDate);
    //   await toDoContract.createTask(addr2.address, "Task 2", futureDate);

    //   const users = await toDoContract.getAllUsers();
    //   expect(users).to.include(owner.address);
    //   expect(users).to.include(addr1.address);
    //   expect(users).to.include(addr2.address);
    // });

    it("should fail if assigned address is zero", async function () {
      await expect(
        toDoContract.createTask(ethers.ZeroAddress, "Bad Task", futureDate)
      ).to.be.revertedWith("Assigned address can not be zero");
    });

    it("should fail if date is in the past", async function () {
      const pastDate = 27062025;
      await expect(
        toDoContract.createTask(addr1.address, "Past Task", pastDate)
      ).to.be.revertedWith("Date can not be in past");
    });
  });

  describe("modifyTask", function () {
    const futureDate = 25122025;
    const newDate = 26122025;

    beforeEach(async () => {
      await toDoContract.createTask(addr1.address, "Original Task", futureDate);
    });

    it("should modify task description and date", async function () {
      const tx = await toDoContract.modifyTask(1, "Updated Task", newDate);

      await expect(tx)
        .to.emit(toDoContract, "TaskModified");

      const task = await toDoContract.tasks(1);
      expect(task.description).to.equal("Updated Task");
      expect(task.date).to.equal(newDate);
      expect(task.isModified).to.equal(true);
    });

    it("should fail if called by non-creator", async function () {
      await expect(
        toDoContract.connect(addr1).modifyTask(1, "Hack Task", newDate)
      ).to.be.revertedWith("Only creator can call this");
    });

    it("should fail if task is completed", async function () {
      await toDoContract.connect(addr1).updateTaskStatus(1, 1);

      await expect(
        toDoContract.modifyTask(1, "Should Fail", newDate)
      ).to.be.revertedWith("Can not modify completed task");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        toDoContract.modifyTask(999, "Non-existent", newDate)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("deleteTask", function () {
    const futureDate = 25122025;

    beforeEach(async () => {
      await toDoContract.createTask(addr1.address, "To Delete", futureDate);
    });

    it("should delete task by creator", async function () {
      const tx = await toDoContract.deleteTask(1);
      await expect(tx)
        .to.emit(toDoContract, "TaskDeleted");
    });

    it("should fail if called by non-creator", async function () {
      await expect(
        toDoContract.connect(addr1).deleteTask(1)
      ).to.be.revertedWith("Only creator can call this");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        toDoContract.deleteTask(999)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("updateTaskStatus", function () {
    const futureDate = 25122025;

    beforeEach(async () => {
      await toDoContract.createTask(addr1.address, "Status Task", futureDate);
    });

    it("should allow assigned user to complete task", async function () {
      const tx = await toDoContract.connect(addr1).updateTaskStatus(1, 1);

      await expect(tx)
        .to.emit(toDoContract, "TaskStatusUpdated");

      const task = await toDoContract.tasks(1);
      expect(Number(task.status)).to.equal(1);
    });

    it("should fail if task already completed", async function () {
      await toDoContract.connect(addr1).updateTaskStatus(1, 1);

      await expect(
        toDoContract.connect(addr1).updateTaskStatus(1, 1)
      ).to.be.revertedWith("Cannot change status from Completed");
    });

    it("should fail with invalid status transition", async function () {
      await expect(
        toDoContract.connect(addr1).updateTaskStatus(1, 0)
      ).to.be.revertedWith("Only allowed: Pending -> Completed");
    });

    it("should fail if not called by assigned user", async function () {
      await expect(
        toDoContract.connect(owner).updateTaskStatus(1, 1)
      ).to.be.revertedWith("Only assign can call this");
    });

    it("should fail if task doesn't exist", async function () {
      await expect(
        toDoContract.connect(addr1).updateTaskStatus(999, 1)
      ).to.be.revertedWith("Invalid task id.");
    });
  });

  describe("View Functions", function () {
    const futureDate = 25122025;
    const anotherDate = 26122025;

    beforeEach(async () => {
      await toDoContract.createTask(addr1.address, "Task 1", futureDate);
      await toDoContract.createTask(addr1.address, "Task 2", futureDate);
      await toDoContract.createTask(addr2.address, "Task 3", anotherDate);
      await toDoContract.createTask(addr1.address, "Task 4", anotherDate);

      await toDoContract.connect(addr1).updateTaskStatus(2, 1);
    });

    describe("getAllTasksByUser", function () {
      it("should return all tasks for a user", async function () {
        const ownerTasks = await toDoContract.getAllTasksByUser(owner.address);
        expect(ownerTasks.length).to.equal(4);

        const addr1Tasks = await toDoContract.getAllTasksByUser(addr1.address);
        expect(addr1Tasks.length).to.equal(3);

        const addr2Tasks = await toDoContract.getAllTasksByUser(addr2.address);
        expect(addr2Tasks.length).to.equal(1);
      });
    });

    // describe("getAllTaskByUserAsCreator", function () {
    //   it("should return only tasks created by the user", async function () {
    //     const ownerCreatedTasks = await toDoContract.getAllTaskByUserAsCreator(owner.address);
    //     expect(ownerCreatedTasks.length).to.equal(4);

    //     for (const task of ownerCreatedTasks) {
    //       expect(task.creator).to.equal(owner.address);
    //       expect(task.isDeleted).to.equal(false);
    //     }

    //     const addr1CreatedTasks = await toDoContract.getAllTaskByUserAsCreator(addr1.address);
    //     expect(addr1CreatedTasks.length).to.equal(0);

    //     const addr2CreatedTasks = await toDoContract.getAllTaskByUserAsCreator(addr2.address);
    //     expect(addr2CreatedTasks.length).to.equal(0);
    //   });

    //   it("should return empty array for user with no created tasks", async function () {
    //     const addr3CreatedTasks = await toDoContract.getAllTaskByUserAsCreator(addr3.address);
    //     expect(addr3CreatedTasks.length).to.equal(0);
    //   });
    // });

    // describe("getAllTaskByUserAsAssignee", function () {
    //   it("should return only tasks assigned to the user", async function () {
    //     const ownerAssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(owner.address);
    //     expect(ownerAssignedTasks.length).to.equal(0);

    //     const addr1AssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(addr1.address);
    //     expect(addr1AssignedTasks.length).to.equal(3);

    //     for (const task of addr1AssignedTasks) {
    //       expect(task.assignedTo).to.equal(addr1.address);
    //       expect(task.isDeleted).to.equal(false);
    //     }

    //     const addr2AssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(addr2.address);
    //     expect(addr2AssignedTasks.length).to.equal(1);

    //     expect(addr2AssignedTasks[0].assignedTo).to.equal(addr2.address);
    //     expect(addr2AssignedTasks[0].isDeleted).to.equal(false);
    //   });

    //   it("should return empty array for user with no assigned tasks", async function () {
    //     const addr3AssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(addr3.address);
    //     expect(addr3AssignedTasks.length).to.equal(0);
    //   });

    //   it("should handle completed tasks correctly", async function () {
    //     const addr1AssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(addr1.address);

    //     expect(addr1AssignedTasks.length).to.equal(3);

    //     const completedTasks = addr1AssignedTasks.filter(task => Number(task.status) === 1);
    //     const pendingTasks = addr1AssignedTasks.filter(task => Number(task.status) === 0);

    //     expect(completedTasks.length).to.equal(1);
    //     expect(pendingTasks.length).to.equal(2);

    //     const completedTask = completedTasks[0];
    //     expect(completedTask.assignedTo).to.equal(addr1.address);
    //     expect(Number(completedTask.status)).to.equal(1);
    //     expect(completedTask.isDeleted).to.equal(false);
    //   });
    // });

    // describe("Creator vs Assignee distinction", function () {
    //   beforeEach(async () => {
    //     await toDoContract.connect(addr1).createTask(addr1.address, "Self-assigned task", futureDate);
    //   });

    //   it("should distinguish between creator and assignee roles", async function () {
    //     const addr1CreatedTasks = await toDoContract.getAllTaskByUserAsCreator(addr1.address);
    //     expect(addr1CreatedTasks.length).to.equal(1);

    //     const addr1AssignedTasks = await toDoContract.getAllTaskByUserAsAssignee(addr1.address);
    //     expect(addr1AssignedTasks.length).to.equal(4);

    //     // The self-assigned task should appear in both lists but be the same task
    //     const selfAssignedTaskAsCreator = addr1CreatedTasks.find(task =>
    //       task.creator === addr1.address && task.assignedTo === addr1.address
    //     );
    //     const selfAssignedTaskAsAssignee = addr1AssignedTasks.find(task =>
    //       task.creator === addr1.address && task.assignedTo === addr1.address
    //     );

    //     expect(selfAssignedTaskAsCreator).to.not.be.undefined;
    //     expect(selfAssignedTaskAsAssignee).to.not.be.undefined;
    //     expect(selfAssignedTaskAsCreator.id).to.equal(selfAssignedTaskAsAssignee.id);
    //   });
    // });

    describe("getTasksByDate", function () {
      it("should return tasks for specific date", async function () {
        const tasksForDate1 = await toDoContract.getTasksByDate(futureDate);
        expect(tasksForDate1.length).to.equal(2);

        const tasksForDate2 = await toDoContract.getTasksByDate(anotherDate);
        expect(tasksForDate2.length).to.equal(2);
      });
    });

    describe("getUserTasksByDate", function () {
      it("should return user's tasks for specific date", async function () {
        const addr1TasksOnDate1 = await toDoContract.getUserTasksByDate(addr1.address, futureDate);
        expect(addr1TasksOnDate1.length).to.equal(2);

        const addr1TasksOnDate2 = await toDoContract.getUserTasksByDate(addr1.address, anotherDate);
        expect(addr1TasksOnDate2.length).to.equal(1);
      });
    });

    describe("getTasksByStatus", function () {
      it("should return tasks filtered by status", async function () {
        const pendingTasks = await toDoContract.getTasksByStatus(addr1.address, 0);
        expect(pendingTasks.length).to.equal(2);

        const completedTasks = await toDoContract.getTasksByStatus(addr1.address, 1);
        expect(completedTasks.length).to.equal(1);
      });
    });

    // describe("getAllUsers", function () {
    //   it("should return all unique users", async function () {
    //     const users = await toDoContract.getAllUsers();
    //     expect(users).to.include(owner.address);
    //     expect(users).to.include(addr1.address);
    //     expect(users).to.include(addr2.address);
    //     expect(users.length).to.be.at.least(3);
    //   });
    // });

    describe("getActiveTaskCount", function () {
      it("should return correct active task count before any deletions", async function () {
        const totalTasks = await toDoContract.taskCount();
        const activeTasks = await toDoContract.getActiveTaskCount();

        expect(totalTasks).to.equal(4); // 4 tasks were created in beforeEach
        expect(activeTasks).to.equal(4); // All tasks are active initially
      });

      it("should decrease active count after task deletion", async function () {
        // Delete task 1 (created by owner)
        await toDoContract.deleteTask(1);

        const totalTasks = await toDoContract.taskCount();
        const activeTasks = await toDoContract.getActiveTaskCount();

        expect(totalTasks).to.equal(4); // Total tasks never decreases
        expect(activeTasks).to.equal(3); // Active tasks decrease after deletion

        // Verify the deleted task is marked as deleted
        const deletedTask = await toDoContract.tasks(1);
        expect(deletedTask.isDeleted).to.equal(true);
      });

      it("should handle multiple deletions correctly", async function () {
        // Delete multiple tasks
        await toDoContract.deleteTask(1);
        await toDoContract.deleteTask(2);

        const totalTasks = await toDoContract.taskCount();
        const activeTasks = await toDoContract.getActiveTaskCount();

        expect(totalTasks).to.equal(4); // Total tasks never decreases
        expect(activeTasks).to.equal(2); // Only 2 tasks remain active
      });

      it("should return 0 when all tasks are deleted", async function () {
        // Delete all tasks
        await toDoContract.deleteTask(1);
        await toDoContract.deleteTask(2);
        await toDoContract.deleteTask(3);
        await toDoContract.deleteTask(4);

        const totalTasks = await toDoContract.taskCount();
        const activeTasks = await toDoContract.getActiveTaskCount();

        expect(totalTasks).to.equal(4); // Total tasks never decreases
        expect(activeTasks).to.equal(0); // No active tasks remaining
      });

      it("should not be affected by task status changes", async function () {
        // Note: Task 2 is already completed in beforeEach, so let's complete task 1 instead
        await toDoContract.connect(addr1).updateTaskStatus(1, 1); // Complete task 1

        const activeTasks = await toDoContract.getActiveTaskCount();
        expect(activeTasks).to.equal(4); // Completed tasks are still active (not deleted)

        // Now delete a task
        await toDoContract.deleteTask(3); // Delete task 3 instead to avoid conflicts
        const activeTasksAfterDeletion = await toDoContract.getActiveTaskCount();
        expect(activeTasksAfterDeletion).to.equal(3); // Only deletion affects active count
      });
    });

    describe("getActiveTasks", function () {
      it("should return all active tasks initially", async function () {
        const activeTasks = await toDoContract.getActiveTasks();
        
        expect(activeTasks.length).to.equal(4); // All 4 tasks should be active
        
        // Verify each task has correct properties
        for (const task of activeTasks) {
          expect(task.id).to.be.greaterThan(0);
          expect(task.isDeleted).to.equal(false);
          expect(task.creator).to.not.equal(ethers.ZeroAddress);
          expect(task.assignedTo).to.not.equal(ethers.ZeroAddress);
        }
      });

      it("should return correct task details", async function () {
        const activeTasks = await toDoContract.getActiveTasks();
        
        // Find task 1 in the results
        const task1 = activeTasks.find(task => task.id.toString() === "1");
        expect(task1).to.not.be.undefined;
        expect(task1.creator).to.equal(owner.address);
        expect(task1.assignedTo).to.equal(addr1.address);
        expect(task1.description).to.equal("Task 1");
        expect(task1.isDeleted).to.equal(false);
        expect(task1.isModified).to.equal(false);
      });

      it("should exclude deleted tasks", async function () {
        // Delete task 1
        await toDoContract.deleteTask(1);
        
        const activeTasks = await toDoContract.getActiveTasks();
        
        expect(activeTasks.length).to.equal(3); // Should have 3 tasks now
        
        // Verify task 1 is not in the results
        const deletedTask = activeTasks.find(task => task.id.toString() === "1");
        expect(deletedTask).to.be.undefined;
        
        // Verify all returned tasks are not deleted
        for (const task of activeTasks) {
          expect(task.isDeleted).to.equal(false);
        }
      });

      it("should handle multiple task deletions", async function () {
        // Delete tasks 1 and 3
        await toDoContract.deleteTask(1);
        await toDoContract.deleteTask(3);
        
        const activeTasks = await toDoContract.getActiveTasks();
        
        expect(activeTasks.length).to.equal(2); // Should have 2 tasks now
        
        // Verify only tasks 2 and 4 remain
        const remainingTaskIds = activeTasks.map(task => task.id.toString()).sort();
        expect(remainingTaskIds).to.deep.equal(["2", "4"]);
        
        // Verify all returned tasks are not deleted
        for (const task of activeTasks) {
          expect(task.isDeleted).to.equal(false);
        }
      });

      it("should return empty array when all tasks are deleted", async function () {
        // Delete all tasks
        await toDoContract.deleteTask(1);
        await toDoContract.deleteTask(2);
        await toDoContract.deleteTask(3);
        await toDoContract.deleteTask(4);
        
        const activeTasks = await toDoContract.getActiveTasks();
        
        expect(activeTasks.length).to.equal(0);
      });

      it("should include both pending and completed tasks (as long as not deleted)", async function () {
        // Task 2 is already completed from beforeEach
        // Complete task 1 as well
        await toDoContract.connect(addr1).updateTaskStatus(1, 1);
        
        const activeTasks = await toDoContract.getActiveTasks();
        
        expect(activeTasks.length).to.equal(4); // All tasks still active
        
        // Check we have both pending and completed tasks
        const pendingTasks = activeTasks.filter(task => Number(task.status) === 0);
        const completedTasks = activeTasks.filter(task => Number(task.status) === 1);
        
        expect(pendingTasks.length).to.equal(2); // Tasks 3 and 4
        expect(completedTasks.length).to.equal(2); // Tasks 1 and 2
      });

      it("should match getActiveTaskCount result", async function () {
        // Delete some tasks to make it interesting
        await toDoContract.deleteTask(2);
        
        const activeTasks = await toDoContract.getActiveTasks();
        const activeTaskCount = await toDoContract.getActiveTaskCount();
        
        expect(activeTasks.length).to.equal(Number(activeTaskCount));
      });

      // it("should handle empty state correctly", async function () {
      //   // Deploy a fresh contract with no tasks
      //   const UserTaskCount = await ethers.getContractFactory("UserTaskCount");
      //   const userTaskCount = await UserTaskCount.deploy();
      //   await userTaskCount.waitForDeployment();
        
      //   const ToDoContract = await ethers.getContractFactory("ToDoContract");
      //   const freshToDo = await ToDoContract.deploy(await userTaskCount.getAddress());
      //   await freshToDo.waitForDeployment();
        
      //   const activeTasks = await freshToDo.getActiveTasks();
      //   expect(activeTasks.length).to.equal(0);
      // });
    });
  });

  describe("Task Count Consistency", function () {
    const futureDate = 25122025;

    it("should maintain consistency between taskCount and getActiveTaskCount", async function () {
      // Initial state
      const initialTotal = await toDoContract.taskCount();
      const initialActive = await toDoContract.getActiveTaskCount();

      // Create a new task
      await toDoContract.createTask(addr1.address, "New Test Task", futureDate);

      const afterCreateTotal = await toDoContract.taskCount();
      const afterCreateActive = await toDoContract.getActiveTaskCount();

      // Both should increase by 1
      expect(afterCreateTotal).to.equal(initialTotal + 1n);
      expect(afterCreateActive).to.equal(initialActive + 1n);

      // Delete the newly created task
      await toDoContract.deleteTask(afterCreateTotal); // Delete the last task

      const afterDeleteTotal = await toDoContract.taskCount();
      const afterDeleteActive = await toDoContract.getActiveTaskCount();

      // Total should stay the same, active should decrease by 1
      expect(afterDeleteTotal).to.equal(afterCreateTotal);
      expect(afterDeleteActive).to.equal(initialActive);
    });
  });

  describe("Date Conversion", function () {
    it("should correctly convert date format", async function () {
      const timestamp = await toDoContract.dev_convertDateToTimestamp(1012023);
      expect(timestamp).to.be.a('bigint');
      expect(timestamp).to.be.greaterThan(0);
    });

    it("should fail with invalid month", async function () {
      await expect(
        toDoContract.dev_convertDateToTimestamp(1132023)
      ).to.be.revertedWith("Invalid month");
    });

    it("should fail with invalid day", async function () {
      await expect(
        toDoContract.dev_convertDateToTimestamp(32012023)
      ).to.be.revertedWith("Invalid day");
    });

    it("should fail with invalid year", async function () {
      await expect(
        toDoContract.dev_convertDateToTimestamp(1011969)
      ).to.be.revertedWith("Year must be >= 1970");
    });
  });

  // describe("UserTaskCount Integration", function () {
  //   const futureDate = 25122025;

  //   it("should increment user task count when creating tasks", async function () {
  //     await toDoContract.createTask(addr1.address, "Task 1", futureDate);
  //     await toDoContract.createTask(addr1.address, "Task 2", futureDate);

  //     const taskCount = await toDoContract.getUserTaskCount(addr1.address);
  //     expect(taskCount).to.equal(2);
  //   });

  //   it("should allow only TodoContract to update UserTaskCount", async function () {
  //     await expect(
  //       userTaskCountContract.connect(addr1).updateMapping(addr1.address)
  //     ).to.be.revertedWith("Only TodoContract can call this");
  //   });

  //   it("should return correct user task count via ToDoContract", async function () {
  //     // Test that getUserTaskCount properly delegates to UserTaskCount contract
  //     await toDoContract.createTask(addr2.address, "Task for addr2", futureDate);

  //     const taskCountViaToDoContract = await toDoContract.getUserTaskCount(addr2.address);
  //     const taskCountViaUserTaskCount = await userTaskCountContract.getUserTaskCount(addr2.address);

  //     // Both should return the same value
  //     expect(taskCountViaToDoContract).to.equal(taskCountViaUserTaskCount);
  //     expect(taskCountViaToDoContract).to.equal(1);
  //   });

  //   it("should return 0 for users with no tasks", async function () {
  //     const taskCount = await toDoContract.getUserTaskCount(addr3.address);
  //     expect(taskCount).to.equal(0);
  //   });
  // });
});