pragma solidity ^0.7.3;


// SPDX-License-Identifier: GPL-3.0-or-later

/// @title Store
/// A contract used for testing purposes.
contract Store {
    uint256 internal value;

    function set(uint256 _value) public {
        value = _value;
    }

    function get() public view returns (uint256) {
        return value;
    }

    function getAnd10() public view returns (uint256, uint256) {
        return (value, 10);
    }

    function getAdd(uint256 _value) public view returns (uint256) {
        return value + _value;
    }
}
