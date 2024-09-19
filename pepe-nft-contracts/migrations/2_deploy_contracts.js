const PepeNFT = artifacts.require("PepeNFT");

module.exports = function(deployer) {
  deployer.deploy(PepeNFT);
};