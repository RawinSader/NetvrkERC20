pragma solidity ^0.8.11;

contract Netvrk {

    uint public totalSupply;

    // Setting the total amount of tokens available
    constructor(uint _initialSupply) public {
        totalSupply = _initialSupply;
    }
}
