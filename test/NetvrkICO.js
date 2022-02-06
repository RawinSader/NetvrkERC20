const NetvrkICO = artifacts.require('NetvrkICO');
const Netvrk = artifacts.require('Netvrk');
const { ZERO_ADDRESS, NETVRK_TOKEN_PRICE } = require('../common/constants');

contract('NetvrkICO', (accounts) => {

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
    assert.equal(price, NETVRK_TOKEN_PRICE, 'Error: token price is incorrect.');
  });

  it('Buy tokens', async () => {
    const instance = await NetvrkICO.deployed();
    const netvrkInstance = await Netvrk.deployed();
    const amount = 3;
    const icoInitialBalance = 50000;

    const netvrkOwner = accounts[0];
    const user = accounts[4];

    await netvrkInstance.transfer(instance.address, icoInitialBalance, { from: netvrkOwner });

    const receipt = await instance.buy(amount, { from: user, value: amount * NETVRK_TOKEN_PRICE });

    assert.equal(receipt.logs.length, 1, 'Error: no events triggered.');
    assert.equal(receipt.logs[0].event, 'Purchased', 'Error: event should be a Purchased event.');
    assert.equal(receipt.logs[0].args._buyer, user, 'Error: wrong buyer specified in the event.');
    assert.equal(receipt.logs[0].args._amount.toNumber(), amount, 'Error: wrong amount specified in the event.');

    const totalSold = await instance.tokensSold();
    assert.equal(totalSold.toNumber(), amount, 'Error: Number of tokens sold not computed properly.');

    const icoBalance = await netvrkInstance.balanceOf(instance.address);
    assert.equal(icoBalance.toNumber(), icoInitialBalance - amount, 'Error: ICO balance not updated properly.');

    const userBalance = await netvrkInstance.balanceOf(user);
    assert.equal(userBalance.toNumber(), amount, 'Error: buyer balance not updated properly.');

    try {
      await instance.buy(amount, { from: user, value: 1 });
    } catch(error) {
      assert(error.message.indexOf('Payment error.') >= 0, 'Error: user is not paying the right amount');
    }
    try {
      const moreThanAvailable = 70000;
      await instance.buy(70000, { from: accounts[1], value: moreThanAvailable * NETVRK_TOKEN_PRICE });
    } catch(error) {
      assert(error.message.indexOf('Insufficient funds.') >= 0, 'Error: ICO does not have that many tokens for you to buy.');
    }

  });
});
