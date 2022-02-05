const Netvrk = artifacts.require('Netvrk');
const { TOTAL_SUPPLY } = require('../common/constants');

module.exports = function (deployer) {
  deployer.deploy(Netvrk, TOTAL_SUPPLY);
};
