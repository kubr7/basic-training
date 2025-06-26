// contracts/ToDoContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./UserTaskCount.sol";

contract ToDoContract {
    enum TaskStatus {
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
    address[] public userList;
    mapping(address => bool) public userExists;

    UserTaskCount public userTaskCountContract;

    constructor(address _userTaskCountContract) {
        require(_userTaskCountContract != address(0), "Invalid UserTaskCount address");
        userTaskCountContract = UserTaskCount(_userTaskCountContract);
        
        UserTaskCount(_userTaskCountContract).setTodoContract(address(this));
    } 

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
        bytes32 oldDescriptionHash,
        bytes32 newDescriptionHash,
        uint32 oldDate,
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
        TaskStatus status,
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
        require(taskId > 0 && taskId <= taskCount, "Invalid task id.");
        require(!tasks[taskId].isDeleted, "Task is deleted, doesn't exist.");
        _;
    }

    function createTask(address assignedTo, string memory description, uint32 date) external {
        require(assignedTo != address(0), "Assigned address can not be zero");
        uint256 expectedTimestamp = _convertDateToTimestamp(date);
        require(
            expectedTimestamp >= block.timestamp,
            "Date can not be in past"
        );
        uint256 taskId = ++taskCount;
        Task memory newTask = Task({
            id: taskId,
            creator: msg.sender,
            assignedTo: assignedTo,
            description: description,
            date: date,
            status: TaskStatus.Pending,
            isDeleted: false,
            isModified: false
        });

        tasks[taskId] = newTask;
        userTaskIds[msg.sender].push(taskId);
        userTaskIds[assignedTo].push(taskId);
        dateTaskIds[date].push(taskId);

        if (!userExists[msg.sender]) {
            userExists[msg.sender] = true;
            userList.push(msg.sender);
        }

        if (!userExists[assignedTo]) {
            userExists[assignedTo] = true;
            userList.push(assignedTo);
        }

        userTaskCountContract.updateMapping(assignedTo);

        emit TaskCreated(
            taskId,
            msg.sender,
            assignedTo,
            date,
            TaskStatus.Pending,
            block.timestamp
        );
    }

    function modifyTask(uint256 taskId, string calldata newDescription, uint32 newDate) external taskExists(taskId) onlyCreator(taskId){
        Task storage task = tasks[taskId];
        require(task.status != TaskStatus.Completed, "Can not modify completed task");

        _removeTaskId(dateTaskIds[task.date], taskId);

        string memory oldTaskDescription = task.description;
        task.description = newDescription;
        uint32 oldDate = task.date;
        task.date = newDate;
        task.isModified = true;

        dateTaskIds[newDate].push(taskId);

        bytes32 oldDescHash = keccak256(abi.encodePacked(oldTaskDescription));
        bytes32 newDescHash = keccak256(abi.encodePacked(newDescription));
        emit TaskModified(taskId, msg.sender, oldDescHash, newDescHash, oldDate, newDate, block.timestamp);
    }

    function deleteTask(uint taskId) external taskExists(taskId) onlyCreator(taskId) {
        Task storage task = tasks[taskId];

        _removeTaskId(userTaskIds[task.assignedTo], taskId);
        _removeTaskId(dateTaskIds[task.date], taskId);
        task.isDeleted = true;
        emit TaskDeleted(taskId, msg.sender, block.timestamp);  
    }

    function updateTaskStatus(uint256 taskId, TaskStatus newStatus) external taskExists(taskId) onlyAssigned(taskId){
        Task storage task = tasks[taskId];
        TaskStatus currentStatus = task.status;

        if (currentStatus == TaskStatus.Completed) {
            revert("Cannot change status from Completed");
        }

        require(newStatus == TaskStatus.Completed, "Only allowed: Pending -> Completed");

        task.status = newStatus;

        emit TaskStatusUpdated(
            taskId,
            msg.sender,
            newStatus,
            block.timestamp
        );
    }

    function getAllUsers() external view returns (address[] memory) {
        return userList;
    }

    function getActiveTaskCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (!tasks[i].isDeleted) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function getAllTaskByUser(address user) external view returns(Task[] memory){
        uint256[] memory ids = userTaskIds[user];
        Task[] memory result = new Task[](ids.length);

        for(uint256 i = 0; i < ids.length; i++){
            result[i] = tasks[ids[i]];
        }

        return result;
    }

    function getAllTaskByUserAsCreator(address user) external view returns(Task[] memory){
        uint256 count = 0;
        
        // Count tasks where user is creator
        for(uint256 i = 1; i <= taskCount; i++){
            if(tasks[i].creator == user && !tasks[i].isDeleted){
                count++;
            }
        }
        
        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;
            
        // Fill array with tasks where user is creator
        for(uint256 i = 1; i <= taskCount; i++){
            if(tasks[i].creator == user && !tasks[i].isDeleted){
                result[resultIndex] = tasks[i];
                resultIndex++;
            }
        }
        
        return result;
    }

    function getAllTaskByUserAsAssignee(address user) external view returns(Task[] memory){
        uint256 count = 0;
        
        // Count tasks where user is assignee
        for(uint256 i = 1; i <= taskCount; i++){
            if(tasks[i].assignedTo == user && !tasks[i].isDeleted){
                count++;
            }
        }
        
        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;
        
        // Fill array with tasks where user is assignee
        for(uint256 i = 1; i <= taskCount; i++){
            if(tasks[i].assignedTo == user && !tasks[i].isDeleted){
                result[resultIndex] = tasks[i];
                resultIndex++;
            }
        }
        
        return result;
    }

    function getTasksByDate(uint32 date) external view returns (Task[] memory) {
        uint256[] memory ids = dateTaskIds[date];
        Task[] memory result = new Task[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = tasks[ids[i]];
        }
        return result;
    }

    function getAllUserTasksByDate(address user, uint32 _date) external view returns (Task[] memory) {
        uint256[] memory ids = userTaskIds[user];
        uint256 count = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].date == _date && !tasks[ids[i]].isDeleted) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].date == _date && !tasks[ids[i]].isDeleted) {
                result[resultIndex] = tasks[ids[i]];
                resultIndex++;
            }
        }

        return result;
    }

    function getPendingTasks(address user) external view returns (Task[] memory) {
        uint256[] memory ids = userTaskIds[user];
        uint256 count = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == TaskStatus.Pending && !tasks[ids[i]].isDeleted) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == TaskStatus.Pending && !tasks[ids[i]].isDeleted) {
                result[resultIndex] = tasks[ids[i]];
                resultIndex++;
            }
        }

        return result;
    }

    function getCompletedTasks(address user) external view returns (Task[] memory) {
        uint256[] memory ids = userTaskIds[user];
        uint256 count = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == TaskStatus.Completed && !tasks[ids[i]].isDeleted) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == TaskStatus.Completed && !tasks[ids[i]].isDeleted) {
                result[resultIndex] = tasks[ids[i]];
                resultIndex++;
            }
        }

        return result;
    }

    function getTasksByStatus(address user, TaskStatus _status) external view returns (Task[] memory) {
        uint256[] memory ids = userTaskIds[user];
        uint256 count = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == _status && !tasks[ids[i]].isDeleted) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (tasks[ids[i]].status == _status && !tasks[ids[i]].isDeleted) {
                result[resultIndex] = tasks[ids[i]];
                resultIndex++;
            }
        }

        return result;
    }

    function _removeTaskId(uint256[] storage arr, uint256 taskIdToRemove) internal {
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

    function _convertDateToTimestamp(uint32 ddmmyyyy) public pure returns (uint256) {
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
}
