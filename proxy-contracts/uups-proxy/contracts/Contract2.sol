// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Contract1.sol";

contract Contract2 is Contract1 {
    function increment() public {
        value += 1;
    }
}
