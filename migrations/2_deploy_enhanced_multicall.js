const EnhancedMulticall = artifacts.require("EnhancedMulticall");

module.exports = function (deployer) {
    deployer.deploy(EnhancedMulticall);
};
