pragma solidity ^0.8.11;

contract Netvrk {

    uint public _totalSupply;

    // Setting the total amount of tokens available
    constructor(uint _initialSupply) public {
        _totalSupply = _initialSupply;
    }
}
