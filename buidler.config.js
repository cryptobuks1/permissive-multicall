require("dotenv").config();

usePlugin("@nomiclabs/buidler-truffle5");
require("./tasks/deploy");

module.exports = {
    networks: {
        arbitrumTestnetV3: {
            url: "https://kovan3.arbitrum.io/rpc",
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 0,
        },
        sokol: {
            url: "https://sokol.poa.network",
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 1000000000,
        },
        xdai: {
            url: "https://rpc.xdaichain.com/",
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 1000000000,
        },
    },
    solc: {
        version: "0.7.3",
        settings: {
            optimizer: {
                enabled: false,
                runs: 200,
            },
        },
    },
};
