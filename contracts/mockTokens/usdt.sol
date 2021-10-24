// SPDX-License-Identifier: NONLICENSED
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Usdt is ERC20 {
    constructor() ERC20("USDTtest", "USDTtest") {
        _mint(msg.sender, 100 );
    }

    function mintTokens(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}