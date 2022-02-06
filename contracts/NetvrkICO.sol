pragma solidity ^0.8.11;

import './Netvrk.sol';

contract NetvrkICO {
    address private owner;

    Netvrk public netvrk;

    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Purchased(address _buyer, uint256 _amount);

    modifier onlyOwner {
        require(msg.sender == owner, "onlyOwner");
        _;
    }

    constructor(Netvrk _token, uint256 _tokenPrice) public {
        owner = msg.sender;
        netvrk = _token;
        tokenPrice = _tokenPrice;
    }

    function buy(uint256 _amount) public payable {
        require(msg.value == safeMultiply(_amount, tokenPrice), "Payment error.");
        require(netvrk.balanceOf(address(this)) >= _amount, 'Insufficient funds.');
        require(tokensSold + _amount > tokensSold, "Integer overflow.");
        require(netvrk.transfer(msg.sender, _amount), "Transfer failed.");

        tokensSold += _amount;
        emit Purchased(msg.sender, _amount);
    }

    function safeMultiply(uint256 x, uint256 y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x);
        return x * y;
    }

    // owner of the ico should get back all the tokens owner by this ico contract
    function terminate() public onlyOwner {
        require(netvrk.transfer(owner, netvrk.balanceOf(address(this))));
        selfdestruct(payable(owner));
    }
}
