// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Mapping {
    mapping (address => uint256) public map;

    function get(address _add) public view returns (uint256){
        return map[_add];
    }

    function set(address _add, uint256 _value) public {
        map[_add] = _value;
    }

    function remove(address _add) public {
        delete map[_add];
    }
}

contract NestedMapping {
    mapping(address => mapping(uint256 => bool)) public nestedMapping;

    function get(address _add, uint256 _value) public view returns (bool) {
        return nestedMapping[_add][_value];
    }

    function set(address _add, uint256 _value, bool _boo) public {
        nestedMapping[_add][_value] = _boo;
    }

    function remove(address _add, uint256 _value) public {
        delete nestedMapping[_add][_value];
    }
}