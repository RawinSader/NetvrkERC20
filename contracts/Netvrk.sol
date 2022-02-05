pragma solidity ^0.8.11;

contract Netvrk {

    string public name = "Netvrk";
    string public symbol = "NVR";

    uint256 public totalSupply;

    address private owner;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Setting the total amount of tokens available
    // Setting the owner of the contract
    // Assigning the total supply to the owner of the contract
    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        owner = msg.sender;
        balanceOf[owner] = _initialSupply;
    }

    // Transferring tokens ownership from an account to the other
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient funds.");
        require(balanceOf[_to] + _value > balanceOf[_to], "Integer overflow.");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
