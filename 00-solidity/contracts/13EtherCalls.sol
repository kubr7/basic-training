// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RecceiveEther {
    receive() external payable {}
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract SendEther {
    function sendViaTransfer(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    function sendViaSend(address payable _to) public payable {
        bool sent = _to.send(msg.value);
        require(sent, "Failed");
    }

    function sendViaCall(address payable _to) public payable {
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed");
    }

    // function example() public {
    //     address someContract;
    //     (bool success, bytes memory result) = someContract.call(
    //         abi.encodeWithSignature("getValue()")
    //     );

    //     require(success, "Failed");

    //     uint256 value = abi.decode(result, (uint256));
    // }
}
