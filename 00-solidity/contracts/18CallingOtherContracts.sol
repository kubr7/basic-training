// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Callee {
    uint256 public x;
    uint256 public value;

    function setX(uint256 _x) public returns (uint256) {
        x = _x;
        return x;
    }

    function setXandSendEther(
        uint256 _x
    ) public payable returns (uint256, uint256) {
        x = _x;
        value = msg.value;

        return (x, value);
    }
}

contract caller {
    function setX(Callee _callee, uint256 _x) public {
        // uint256 x = _callee.setX(_x);
        _callee.setX(_x);
    }

    function setXFromAddress(address _add, uint256 _x) public {
        Callee callee = Callee(_add);
        callee.setX(_x);
    }

    function setXandSendEther(Callee _callee, uint256 _x) public payable {
        // (uint256 x, uint256 value) = _callee.setXandSendEther{value: msg.value}(_x);
        _callee.setXandSendEther{value: msg.value}(_x);
    }
}
