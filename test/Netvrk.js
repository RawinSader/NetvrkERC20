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
  it('Detect insufficient funds when transferring tokens', async () => {
    const instance = await Netvrk.deployed();
    try {
      await instance.transfer.call(accounts[1], 1234123412341234);
    } catch(error) {
      assert(error.message.indexOf('Insufficient funds.') >= 0, 'Error: Insufficient funds not detected.');
    }
  });
  it('Transferring tokens', async () => {
    const instance = await Netvrk.deployed();
    const receipt = await instance.transfer(accounts[1], 100, { from: accounts[0] });

    const senderBalance = await instance.balanceOf(accounts[0]);
    const recipientBalance = await instance.balanceOf(accounts[1]);
    assert.equal(senderBalance, TOTAL_SUPPLY - 100, 'Error: Failed to reduce the sender\'s balance by the right amount.');
    assert.equal(recipientBalance, 100, 'Error: failed to increase the recipient\'s balance by the right amount.');

    assert.equal(receipt.logs.length, 1, 'Error: no events triggered.');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Error: event should be a Transfer event.');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'Error: sender is not specified in the event.');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'Error: recipient is not specified in the event.');
    assert.equal(receipt.logs[0].args._value, 100, 'Error: value is not specified in the event.');

    const transferred = await instance.transfer.call(accounts[1], 100, { from: accounts[0] });
    assert.equal(transferred, true, 'Error: function does not return a boolean.');

  });
});
