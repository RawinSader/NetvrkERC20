const Netvrk = artifacts.require('Netvrk');
const { TOTAL_SUPPLY } = require('../common/constants');

contract('Netvrk', (accounts) => {
  it('properly sets total supply when deployed', async () => {
    const instance = await Netvrk.deployed();
    const totalSupply = await instance._totalSupply();
    assert.equal(totalSupply.toNumber(), TOTAL_SUPPLY, "Total supply was set to correctly")
  });
});
