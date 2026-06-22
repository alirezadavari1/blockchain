// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
contract Treasury is Ownable {
    uint256 public copperReserve;
    uint256 public usdtReserve;
    uint256 public totalSupply;
    event ReservesUpdated(uint256 copper, uint256 usdt, uint256 nav);
    event SupplyUpdated(uint256 newSupply);
    constructor() Ownable(msg.sender) {
        copperReserve = 10000 * 10**2;
        usdtReserve = 2000 * 10**2;
        totalSupply = 10000 * 10**18;
    }
    function updateReserves(uint256 _copper, uint256 _usdt) external onlyOwner {
        copperReserve = _copper;
        usdtReserve = _usdt;
        emit ReservesUpdated(_copper, _usdt, getNAV());
    }
    function updateSupply(uint256 _newSupply) external onlyOwner {
        totalSupply = _newSupply;
        emit SupplyUpdated(_newSupply);
    }
    function getNAV() public view returns (uint256) {
        if (totalSupply == 0) return 0;
        uint256 totalValue = (copperReserve + usdtReserve) / 100;
        return (totalValue * 10**18) / totalSupply;
    }
    function getTreasuryInfo() external view returns (
        uint256 _copperReserve,
        uint256 _usdtReserve,
        uint256 _totalValue,
        uint256 _nav,
        uint256 _supply
    ) {
        _copperReserve = copperReserve;
        _usdtReserve = usdtReserve;
        _totalValue = copperReserve + usdtReserve;
        _nav = getNAV();
        _supply = totalSupply;
    }
}