// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IChildToken {
    function deposit(address user, bytes calldata depositData) external;
}
