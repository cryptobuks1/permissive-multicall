const { expect } = require("chai");
const Store = artifacts.require("Store");
const EnhancedMulticall = artifacts.require("EnhancedMulticall");

describe("EnhancedMulticall", () => {
    let storeA,
        storeB,
        enhancedMulticall,
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
        aggregateWithoutRequireFunctionAbi = EnhancedMulticall.abi.find(
            (abiEntry) =>
                abiEntry.name === "aggregateWithoutRequire" &&
                abiEntry.type === "function"
        );
    });

    describe("Non-enhanced function (multicall retro compatibility)", () => {
        beforeEach(async () => {
            storeA = await Store.new();
            storeB = await Store.new();
            enhancedMulticall = await EnhancedMulticall.new();
        });

        it("should correctly setup the test environment", async () => {
            expect((await storeA.get()).toNumber()).to.equal(0);
            await storeA.set(100);
            expect((await storeA.get()).toNumber()).to.equal(100);
            await storeA.set(0);
            expect((await storeA.get()).toNumber()).to.equal(0);
        });

        it("should work with a single call", async () => {
            const result = await enhancedMulticall.aggregate.call([
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
            const result = await enhancedMulticall.aggregate.call([
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
            const result = await enhancedMulticall.aggregate.call([
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
            const result = await enhancedMulticall.aggregate.call([
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
            const result = await enhancedMulticall.aggregate.call([
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

    describe("Enhanced function (no success requirement)", () => {
        beforeEach(async () => {
            storeA = await Store.new();
            storeB = await Store.new();
            enhancedMulticall = await EnhancedMulticall.new();
        });

        it("should correctly setup the test environment", async () => {
            expect((await storeA.get()).toNumber()).to.equal(0);
            await storeA.set(100);
            expect((await storeA.get()).toNumber()).to.equal(100);
            await storeA.set(0);
            expect((await storeA.get()).toNumber()).to.equal(0);
        });

        it("should work with a single call", async () => {
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
                [
                    [
                        storeA.address,
                        web3.eth.abi.encodeFunctionCall(getFunctionAbi, []),
                    ],
                    // faulty call
                    [
                        enhancedMulticall.address,
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
            const result = await enhancedMulticall.aggregateWithoutRequire.call(
                [
                    [
                        enhancedMulticall.address,
                        web3.eth.abi.encodeFunctionCall(
                            getAnd10FunctionAbi,
                            []
                        ),
                    ],
                    [
                        enhancedMulticall.address,
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
