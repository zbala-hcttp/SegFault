const SegToken = artifacts.require("SEGToken");

module.exports = function(deployer) {
  deployer.deploy(SegToken, 1000000);
};