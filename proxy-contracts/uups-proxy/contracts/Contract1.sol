// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Contract1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        value = 0;
    }

    function store(uint256 _val) public {
        value = _val;
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    /// Required override — who can upgrade
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
