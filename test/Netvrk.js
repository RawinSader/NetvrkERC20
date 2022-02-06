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
  it('Transfer tokens', async () => {
    const instance = await Netvrk.deployed();
    const receipt = await instance.transfer(accounts[1], 100, { from: accounts[0] });

    const senderBalance = await instance.balanceOf(accounts[0]);
    const recipientBalance = await instance.balanceOf(accounts[1]);
    assert.equal(senderBalance, TOTAL_SUPPLY - 100, 'Error: Failed to reduce the sender\'s balance by the right amount.');
    assert.equal(recipientBalance, 100, 'Error: failed to increase the recipient\'s balance by the right amount.');

    assert.equal(receipt.logs.length, 1, 'Error: no events triggered.');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Error: event should be a Transfer event.');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'Error: wrong sender specified in the event.');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'Error: wrong recipient specified in the event.');
    assert.equal(receipt.logs[0].args._value, 100, 'Error: wrong value specified in the event.');

    const transferred = await instance.transfer.call(accounts[1], 100, { from: accounts[0] });
    assert.equal(transferred, true, 'Error: Failed to transfer tokens.');

  });
  it('Approve tokens', async () => {
    const instance = await Netvrk.deployed();

    const receipt = await instance.approve(accounts[1], 100);

    const allowance = await instance.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 100, 'Error: Allowance not set properly.');

    assert.equal(receipt.logs.length, 1, 'Error: no events triggered.');
    assert.equal(receipt.logs[0].event, 'Approval', 'Error: event should be an Approval event.');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'Error: wrong owner specified in the event.');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'Error: wrong spender specified in the event.');
    assert.equal(receipt.logs[0].args._value, 100, 'Error: wrong value specified in the event.');

    const approved = await instance.approve.call(accounts[1], 100);
    assert.equal(approved, true, 'Error: Failed to approve tokens.');
  });
  it('Transfer tokens from another account', async () => {
    const instance = await Netvrk.deployed();

    from = accounts[5];
    to = accounts[6];
    spender = accounts[7];

    await instance.transfer(from, 100, { from: accounts[0] });
    await instance.approve(spender, 20, { from });

    try {
      await instance.transferFrom(from, to, 12341234, { from: spender });
    } catch(error) {
      assert(error.message.indexOf('Insufficient funds.') >= 0, 'Error: Insufficient funds not detected.');
    }
    try {
      await instance.transferFrom(from, to, 30, { from: spender });
    } catch(error) {
      assert(error.message.indexOf('Cannot exceed allowance.') >= 0, 'Error: spending more not detected.');
    }

    const receipt = await instance.transferFrom(from, to, 10, { from: spender });

    const fromBalance = await instance.balanceOf(from);
    const toBalance = await instance.balanceOf(to);

    assert.equal(fromBalance, 100 - 10, 'Error: from balance not decreased properly.');
    assert.equal(toBalance, 10, 'Error: to balance not increased properly.');

    const allowance = await instance.allowance(from, spender);
    assert.equal(allowance.toNumber(), 20 - 10, 'Error: allowance not decreased properly.');

    assert.equal(receipt.logs.length, 1, 'Error: no events triggered.');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Error: event should be a Transfer event.');
    assert.equal(receipt.logs[0].args._from, from, 'Error: wrong sender specified in the event.');
    assert.equal(receipt.logs[0].args._to, to, 'Error: wrong recipient specified in the event.');
    assert.equal(receipt.logs[0].args._value, 10, 'Error: wrong value specified in the event.');

    const transferredFrom = await instance.transferFrom.call(from, to, 10, { from: spender });
    assert.equal(transferredFrom, true, 'Error: Failed to transferFrom tokens');

  });
});
