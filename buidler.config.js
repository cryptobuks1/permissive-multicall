usePlugin("@nomiclabs/buidler-truffle5");

module.exports = {
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
