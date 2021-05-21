const SegTokenSale = artifacts.require("SEGTokenSale");
const SegToken = artifacts.require("SEGToken");

module.exports = function(deployer) {
  deployer.deploy(SegToken, 1000000);
  deployer.deploy(SegTokenSale, SegToken.address, 100);
};
