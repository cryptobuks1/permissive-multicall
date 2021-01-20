const { task } = require("@nomiclabs/buidler/config");

task(
    "deploy",
    "Deploys the permissive multicall contract and optionally verifies source code on Etherscan"
)
    .addFlag("verify", "Verifies source code on Etherscan")
    .setAction(async (taskArguments, hre) => {
        const { verify } = taskArguments;

        await hre.run("clean");
        await hre.run("compile");

        const PermissiveMulticall = hre.artifacts.require(
            "PermissiveMulticall"
        );
        const permissiveMulticall = await PermissiveMulticall.new();
        if (verify) {
            await hre.run("verify", {
                address: rewardTokensValidator.address,
                constructorArguments: [
                    tokenRegistryAddress,
                    tokenRegistryListId,
                ],
            });
        }

        console.log(
            `permissive multicall deployed at address ${permissiveMulticall.address}`
        );
        if (verify) {
            console.log(`source code verified`);
        }
    });
