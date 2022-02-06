const Netvrk = artifacts.require('Netvrk');
const NetvrkICO = artifacts.require('NetvrkICO');
const { NETVRK_TOTAL_SUPPLY, NETVRK_TOKEN_PRICE } = require('../common/constants');

module.exports = async (deployer) => {
  await deployer.deploy(Netvrk, NETVRK_TOTAL_SUPPLY);
  await deployer.deploy(NetvrkICO, Netvrk.address, NETVRK_TOKEN_PRICE);
};
