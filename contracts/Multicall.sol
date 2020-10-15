pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;


// Code taken from https://github.com/makerdao/multicall

/// @title Multicall - Aggregate results from multiple read-only function calls
/// @author Michael Elliot <mike@makerdao.com>
/// @author Joshua Levine <joshua@makerdao.com>
/// @author Nick Johnson <arachnid@notdot.net>

contract Multicall {
    struct Call {
        address target;
        bytes callData;
    }

    function aggregate(Call[] memory calls)
        public
        returns (uint256, bytes[] memory)
    {
        bytes[] memory returnData = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(
                calls[i].callData
            );
            require(success, "CALL_FAILED");
            returnData[i] = ret;
        }
        return (block.number, returnData);
    }
}
