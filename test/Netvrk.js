const Netvrk = artifacts.require('Netvrk');
const { TOTAL_SUPPLY, ZERO_ADDRESS, CONTRACT_NAME, CONTRACT_SYMBOL } = require('../common/constants');

contract('Netvrk', (accounts) => {
  it('Deploy the contract', async () => {
    const instance = await Netvrk.deployed();
    assert.notEqual(instance.address, ZERO_ADDRESS, 'Error: contract was not deployed.');
  });
  it('Set the contract name', async () => {
    const instance = await Netvrk.deployed();
    const name = await instance.name();
    assert.equal(name, CONTRACT_NAME, 'Error: contract has the wrong name.');
  });
  it('Set the contract symbol', async () => {
    const instance = await Netvrk.deployed();
    const name = await instance.symbol();
    assert.equal(name, CONTRACT_SYMBOL, 'Error: contract has the wrong symbol.');
  });
  it('Set the total supply on deployment', async () => {
    const instance = await Netvrk.deployed();
    const totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), TOTAL_SUPPLY, 'Error: contract does not have the initial total supply.');
  });
  it('Assign all initial tokens to the contract owner on deployment', async () => {
    const instance = await Netvrk.deployed();
    const balance = await instance.balanceOf(accounts[0]);
    assert.equal(balance, TOTAL_SUPPLY, 'Error: contract owner does not initially own all tokens.');
  });
});
