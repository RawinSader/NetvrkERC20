const NetvrkICO = artifacts.require('NetvrkICO');
const { ZERO_ADDRESS, NETVRK_TOKEN_PRICE } = require('../common/constants');

contract('NetvrkICO', () => {

  it('Deploy the contract', async () => {
    const instance = await NetvrkICO.deployed();
    assert.notEqual(instance.address, ZERO_ADDRESS, 'Error: contract was not deployed.');
  });

  it('Access Netvrk instance', async () => {
    const instance = await NetvrkICO.deployed();
    const address = await instance.netvrk();
    assert.notEqual(address, ZERO_ADDRESS, 'Error: contract was not deployed.');
  });

  it('Check token price', async () => {
    const instance = await NetvrkICO.deployed();
    const price = await instance.tokenPrice();
    assert.equal(price, NETVRK_TOKEN_PRICE, "Error: token price is incorrect.")
  });
});
