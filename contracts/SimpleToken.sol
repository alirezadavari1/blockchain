// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    constructor() ERC20("Copper Token", "ABCO") Ownable(msg.sender) {
        _mint(msg.sender, 10000 * 10**18);
    }
}