// contracts/UserTaskCount.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract UserTaskCount{
    address public todoContract;
    mapping(address => uint256) public userTaskCounts;

    modifier onlyTodoContract(){
        require(msg.sender == todoContract, "Only TodoContract can call this");
        _;
    }

    function setTodoContract(address _todoContract) external {
        require(_todoContract != address(0), "Invalid TodoContract Address - Cant be zero");
        require(todoContract == address(0), "TodoContract already set");
        todoContract = _todoContract;
    }    

    function updateMapping(address user) external onlyTodoContract{
        userTaskCounts[user]++;
    }

    function getUserTaskCount(address user) external view returns(uint256){
        return userTaskCounts[user];
    }
}