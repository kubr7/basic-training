// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public count;

    event Increment(uint256 value);
    event Decrement(uint256 value);

    function inc() public {
        count += 1;
        emit Increment(count);
    }

    function dec() public {
        count -= 1;
        emit Decrement(count);
    }

    function get() public view returns (uint256) {
        return count;
    }
}
