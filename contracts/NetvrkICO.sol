pragma solidity ^0.8.11;

import './Netvrk.sol';

contract NetvrkICO {
    address private owner;

    Netvrk public netvrk;

    uint256 public tokenPrice;

    constructor(Netvrk _token, uint256 _tokenPrice) public {
        owner = msg.sender;
        netvrk = _token;
        tokenPrice = _tokenPrice;
    }
}
