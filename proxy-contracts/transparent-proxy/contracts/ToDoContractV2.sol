// SPDX-License-identifier: MIT
pragma solidity ^0.8.28;

import "./ToDoContract.sol";

contract ToDoContractV2 is ToDoContract {
    function getTotalTaskCount() public view returns (uint256) {
        return taskCount;
    }
}