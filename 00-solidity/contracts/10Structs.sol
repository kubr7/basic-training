// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Structure {
    struct Person {
        string name;
        uint8 age;
    }

    Person[] public people;

    function create(string calldata _name, uint8 _age) public {
        Person memory newPerson;
        newPerson.name = _name;
        newPerson.age = _age;

        people.push(newPerson);
    }

    function make(string memory _name, uint8 _age) public {
        Person memory newPerson = Person({name: _name, age: _age});
        Person memory newPerson1 = Person(_name, _age);
        people.push(newPerson);
        people.push(newPerson1);
    }

    function get(
        uint256 _index
    ) public view returns (string memory name, uint8 age) {
        Person storage person = people[_index];
        return (person.name, person.age);
    }
}
