var ZombieFactory = artifacts.require("./ZombieFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ZombieFactory);
};
