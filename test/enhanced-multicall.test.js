const { expect } = require("chai");
const Store = artifacts.require("Store");
const PermissiveMulticall = artifacts.require("PermissiveMulticall");

describe("PermissiveMulticall", () => {
    let storeA,
        storeB,
        permissiveMulticall,
        getFunctionAbi,
        getAddFunctionAbi,
        getAnd10FunctionAbi;

    before(() => {
        getFunctionAbi = Store.abi.find(
            (abiEntry) =>
                abiEntry.name === "get" && abiEntry.type === "function"
        );
        getAddFunctionAbi = Store.abi.find(
            (abiEntry) =>
                abiEntry.name === "getAdd" && abiEntry.type === "function"
        );
        getAnd10FunctionAbi = Store.abi.find(
            (abiEntry) =>
                abiEntry.name === "getAnd10" && abiEntry.type === "function"
        );
        aggregateWithPermissivenessFunctionAbi = PermissiveMulticall.abi.find(
            (abiEntry) =>
                abiEntry.name === "aggregateWithPermissiveness" &&
                abiEntry.type === "function"
        );
    });

    beforeEach(async () => {
        storeA = await Store.new();
        storeB = await Store.new();
        permissiveMulticall = await PermissiveMulticall.new();
    });

    describe("Non-permissive function", () => {
        it("should correctly setup the test environment", async () => {
            expect((await storeA.get()).toNumber()).to.equal(0);
            await storeA.set(100);
            expect((await storeA.get()).toNumber()).to.equal(100);
            await storeA.set(0);
            expect((await storeA.get()).toNumber()).to.equal(0);
        });

        it("should work with a single call", async () => {
            const result = await permissiveMulticall.aggregate.call([
                [
                    storeA.address,
                    web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                ],
            ]);
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][0]
                )[0]
            ).to.equal("0");
        });

        it("should work with multiple calls", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregate.call([
                [
                    storeA.address,
                    web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                ],
                [
                    storeB.address,
                    web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                ],
            ]);
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][0]
                )[0]
            ).to.equal("123");
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][1]
                )[0]
            ).to.equal("0");
        });

        it("should work with a single call with a single argument", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregate.call([
                [
                    storeA.address,
                    web3.eth.abi.encodeFunctionCall(getAddFunctionAbi, [1]),
                ],
            ]);
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][0]
                )[0]
            ).to.equal("124");
        });

        it("should work with multiple calls with a single argument", async () => {
            await storeA.set(123);
            await storeB.set(321);
            const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(
                getAddFunctionAbi,
                [1]
            );
            const result = await permissiveMulticall.aggregate.call([
                [storeA.address, encodedFunctionCall],
                [storeB.address, encodedFunctionCall],
            ]);
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][0]
                )[0]
            ).to.equal("124");
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][1]
                )[0]
            ).to.equal("322");
        });

        it("should work with a single call with a multi-return", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregate.call([
                [
                    storeA.address,
                    web3.eth.abi.encodeFunctionCall(getAnd10FunctionAbi, []),
                ],
            ]);
            const returnData = web3.eth.abi.decodeParameters(
                getAnd10FunctionAbi.outputs,
                result[1][0]
            );
            expect(returnData[0]).to.equal("123");
            expect(returnData[1]).to.equal("10");
        });
    });

    describe("Permissive function", () => {
        it("should correctly setup the test environment", async () => {
            expect((await storeA.get()).toNumber()).to.equal(0);
            await storeA.set(100);
            expect((await storeA.get()).toNumber()).to.equal(100);
            await storeA.set(0);
            expect((await storeA.get()).toNumber()).to.equal(0);
        });

        it("should work with a single call", async () => {
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                    ],
                ]
            );
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][0].data
                )[0]
            ).to.equal("0");
        });

        it("should work with multiple calls", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                    ],
                    [
                        storeB.address,
                        web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                    ],
                ]
            );
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][0].data
                )[0]
            ).to.equal("123");
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    result[1][1].data
                )[0]
            ).to.equal("0");
        });

        it("should work with a single call with a single argument", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(getAddFunctionAbi, [1]),
                    ],
                ]
            );
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][0].data
                )[0]
            ).to.equal("124");
        });

        it("should work with multiple calls with a single argument", async () => {
            await storeA.set(123);
            await storeB.set(321);
            const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(
                getAddFunctionAbi,
                [1]
            );
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [storeA.address, encodedFunctionCall],
                    [storeB.address, encodedFunctionCall],
                ]
            );
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][0].data
                )[0]
            ).to.equal("124");
            expect(
                web3.eth.abi.decodeParameters(
                    getAddFunctionAbi.outputs,
                    result[1][1].data
                )[0]
            ).to.equal("322");
        });

        it("should work with a single call with a multi-return", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(
                            getAnd10FunctionAbi,
                            []
                        ),
                    ],
                ]
            );
            const returnData = web3.eth.abi.decodeParameters(
                getAnd10FunctionAbi.outputs,
                result[1][0].data
            );
            expect(returnData[0]).to.equal("123");
            expect(returnData[1]).to.equal("10");
        });

        it("should work with a faulty call and a non-faulty one", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                    ],
                    // faulty call
                    [
                        permissiveMulticall.address,
                        web3.eth.abi.encodeFunctionCall(
                            getAnd10FunctionAbi,
                            []
                        ),
                    ],
                ]
            );
            const firstCallReturnData = result[1][0];
            expect(firstCallReturnData.success).to.be.true;
            expect(
                web3.eth.abi.decodeParameters(
                    getFunctionAbi.outputs,
                    firstCallReturnData.data
                )[0]
            ).to.equal("123");
            const secondCallReturnData = result[1][1];
            expect(secondCallReturnData.success).to.be.false;
        });

        it("should work with multiple faulty calls", async () => {
            await storeA.set(123);
            const result = await permissiveMulticall.aggregateWithPermissiveness.call(
                [
                    [
                        permissiveMulticall.address,
                        web3.eth.abi.encodeFunctionCall(
                            getAnd10FunctionAbi,
                            []
                        ),
                    ],
                    [
                        permissiveMulticall.address,
                        web3.eth.abi.encodeFunctionCall(
                            getAnd10FunctionAbi,
                            []
                        ),
                    ],
                ]
            );
            expect(result[1][0].success).to.be.false;
            expect(result[1][1].success).to.be.false;
        });
    });
});
