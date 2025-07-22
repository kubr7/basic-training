// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract B {
    address public sender;
    uint256 public num;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        sender = msg.sender;
        num = _num;
        value = msg.value;
    }
}

contract A {
    address public sender;
    uint256 public num;
    uint256 public value;

    event DelegateCallResponse(bool success, bytes data);
    event CallResponse(bool success, bytes data);

    function setVarsViaDelegateCall(
        address _contract,
        uint256 _num
    ) public payable {
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );

        emit DelegateCallResponse(success, data);
    }

    function setVarsViaVCall(address _contract, uint256 _num) public payable {
        (bool success, bytes memory data) = _contract.call{value: msg.value}(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );

        emit CallResponse(success, data);
    }
}
