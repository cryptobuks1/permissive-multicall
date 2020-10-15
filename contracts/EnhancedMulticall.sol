pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "./Multicall.sol";


// Enhanced version of multicall, with faulty calls catch
contract EnhancedMulticall is Multicall {
    struct CallOutcome {
        bool success;
        bytes data;
    }

    function aggregateWithoutRequire(Call[] memory calls)
        public
        returns (uint256 blockNumber, CallOutcome[] memory callOutcomes)
    {
        blockNumber = block.number;
        callOutcomes = new CallOutcome[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            Call memory call = calls[i];
            (bool success, bytes memory returnData) = call.target.call(
                call.callData
            );
            callOutcomes[i] = CallOutcome({success: success, data: returnData});
        }
    }
}
