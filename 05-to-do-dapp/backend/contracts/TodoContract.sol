// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TodoContract {
    enum TaskStatus {
        NotStarted,
        Started,
        Pending,
        Completed
    }

    struct Task {
        uint256 id;
        address creator;
        address assignedTo;
        string description;
        uint32 date;
        TaskStatus status;
        bool isDeleted;
        bool isModified;
    }
    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userTaskIds;
    mapping(uint32 => uint256[]) public dateTaskIds;
    mapping(address => uint256) public userTaskCount;

    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        address indexed assignedTo,
        uint32 date,
        TaskStatus status,
        uint256 timestamp
    );

    event TaskModified(
        uint256 indexed taskId,
        address indexed modifiedBy,
        string oldDescription,
        string newDescription,
        uint32 newDate,
        uint256 timestamp
    );

    event TaskDeleted(
        uint256 indexed taskId,
        address indexed deletedBy,
        uint256 timestamp
    );

    event TaskStatusUpdated(
        uint256 indexed taskId,
        address updatedBy,
        string oldStatus,
        string newStatus,
        uint256 timestamp
    );

    modifier onlyCreator(uint256 taskId) {
        require(tasks[taskId].creator == msg.sender, "Only creator can call this");
        _;
    }

    modifier onlyAssigned(uint256 taskId) {
        require(tasks[taskId].assignedTo == msg.sender, "Only assign can call this");
        _;
    }

    modifier taskExists(uint256 taskId) {
        require(taskId > 0 && taskId < taskCount, "Invalid task id.");
        require(!tasks[taskId].isDeleted, "Task is deleted, doesn't exist.");
        _;
    }

    function createTask(address assignedTo, string memory description, uint32 date) external {
        require(assignedTo != address(0), "Assigned address can not be zero");
        uint256 expectedTimestamp = convertDateToTimestamp(date);
        require(
            expectedTimestamp >= block.timestamp,
            "Date can not be in past"
        );
        uint256 taskId = taskCount++;
        Task memory newTask = Task({
            id: taskId,
            creator: msg.sender,
            assignedTo: assignedTo,
            description: description,
            date: date,
            status: TaskStatus.NotStarted,
            isDeleted: false,
            isModified: false
        });

        tasks[taskId] = newTask;
        userTaskIds[msg.sender].push(taskId);
        userTaskIds[assignedTo].push(taskId);
        dateTaskIds[date].push(taskId);
        userTaskCount[msg.sender]++;

        emit TaskCreated(
            taskId,
            msg.sender,
            assignedTo,
            date,
            TaskStatus.NotStarted,
            block.timestamp
        );
    }

    function modifyTask(uint256 taskId, string newDescription, uint32 newDate) external taskExists(taskId) onlyCreator(taskId){
        Task storage task = tasks[taskId];
        require(task.status != TaskStatus.Completed, "Can not modify completed task");

    }

    function removeTaskId(uint256[] storage arr, uint256 taskIdToRemove) internal {
        for(uint i = 0; i < arr.length; i++){
            if(arr[i] == taskIdToRemove){
                uint256 temp = arr[i];
                arr[i] = arr[arr.length - 1];
                arr[arr.length -1] = temp;
                arr.pop();
                break;
            }
        }
    }

    function convertDateToTimestamp(uint32 ddmmyyyy) public pure returns (uint256) {
        uint256 day = ddmmyyyy / 1e6; // DD
        uint256 month = (ddmmyyyy / 1e4) % 100; // MM
        uint256 year = ddmmyyyy % 10000; // YYYY

        require(month >= 1 && month <= 12, "Invalid month");
        require(day >= 1 && day <= 31, "Invalid day");
        require(year >= 1970, "Year must be >= 1970");

        // Days calculation using Julian Day Number algorithm
        uint256 a = (14 - month) / 12;
        uint256 y = year + 4800 - a;
        uint256 m = month + 12 * a - 3;

        uint256 julianDay = day +
            ((153 * m + 2) / 5) +
            (365 * y) +
            (y / 4) -
            (y / 100) +
            (y / 400) -
            32045;

        // Convert JDN to Unix timestamp (Epoch JDN is 2440588)
        uint256 timestamp = (julianDay - 2440588) * 86400;

        return timestamp;
    }

    function re
}
