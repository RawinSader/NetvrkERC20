const Netvrk = artifacts.require('Netvrk');
const { TOTAL_SUPPLY, ZERO_ADDRESS } = require('../common/constants');

contract('Netvrk', (accounts) => {
  it('Deploy the contract', async () => {
    const instance = await Netvrk.deployed();
    assert.notEqual(instance.address, ZERO_ADDRESS, "Contract has address")
  });
  it('Set the total supply on deployment', async () => {
    const instance = await Netvrk.deployed();
    const totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), TOTAL_SUPPLY, 'Total supply was set to correctly');
  });
  it('Assign all initial tokens to the contract owner on deployment', async () => {
    const instance = await Netvrk.deployed();
    const balance = await instance.balanceOf(accounts[0]);
    assert.equal(balance, TOTAL_SUPPLY, 'Contract owner initially owns all of the tokens');
  });
});
