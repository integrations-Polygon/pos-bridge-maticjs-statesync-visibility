// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract rootERC20Token is ERC20, Ownable {
    constructor() ERC20("Root ERC20 Token", "rootERC20Token") {
        _mint(_msgSender(), 1000000000 * 1e18);
    }
}
