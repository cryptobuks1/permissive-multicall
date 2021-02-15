# Permissive multicall

A retrocompatible and enhanced multicall implementation.

Multiple calls can now be done such as that if one of them fails, the error is signaled in a non-blocking way (i.e. the whole multicall operation does **not** fail).
This means that all the calls in the passed specification array will be performed even if one or more than one of them won't be successfully performed.
It is the client's responsibility to check that, in the outcome array, a call has had a successful outcome or not, before accessing the returned data, if any.

## ABI

The contract's ABI can be found in the `artifacts` folder, in the `PermissiveMulticall.json` file.

## Getting started

In order to get started in developing permissive multicall, simply clone the repo and run `yarn install` into it.
`Buidler` is used to manage `solc` versions and the development lifecycle in general.

Some important commands include:

-   `yarn compile`: compiles the contracts with solc (the specific version of is defined in the `buidler.config.json` file) and puts the output artifacts into the `artifacts` folder.
-   `yarn test`: runs the comprehensive test suites.

## Deployments

| Network             | Address                                    |
| ------------------- | ------------------------------------------ |
| Mainnet             | 0x0946f567d0ed891e6566c1da8e5093517f43571d |
| Rinkeby             | 0x798d8ced4dff8f054a5153762187e84751a73344 |
| Arbitrum testnet v3 | 0x73a08DC74eF4ed2c360199244bb69F1464204E7C |
| Sokol               | 0x4D97Bd8eFaCf46b33c4438Ed0B7B6AABfa2359FB |
| xDAI                | 0x4E75068ED2338fCa56631E740B0723A6dbc1d5CD |
