pragma solidity ^0.8.11;

contract Netvrk {

    mapping(address => uint256) public balanceOf;

    uint256 public totalSupply;

    address private owner;
    // Setting the total amount of tokens available
    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        owner = msg.sender;
        balanceOf[owner] = _initialSupply;
    }
}
