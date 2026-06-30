// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract CopperTokenV2 is ERC20, Ownable {
    AggregatorV3Interface internal priceFeed;
    uint256 public copperPrice;
    uint256 public lastUpdateTime;
    uint256 public constant TOKEN_DECIMALS = 18;
    uint256 public constant PRICE_DECIMALS = 8;

    event PriceUpdated(uint256 newPrice, uint256 timestamp);
    event Minted(address indexed to, uint256 usdAmount, uint256 tokenAmount);

    constructor() 
        ERC20("Copper Token", "ABCO") 
        Ownable(msg.sender) 
    {
        priceFeed = AggregatorV3Interface(0x5741306c21795FdCBb9b265Ea0255F499DFe515C);
        copperPrice = 1500000000000000000;
        _mint(msg.sender, 10000 * 10**TOKEN_DECIMALS);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    function updatePrice() external {
        uint256 newPrice = getLatestPrice();
        copperPrice = newPrice;
        lastUpdateTime = block.timestamp;
        emit PriceUpdated(newPrice, block.timestamp);
    }

    function getCopperPriceInUSD() public view returns (uint256) {
        uint256 price = copperPrice;
        return price * 10**(TOKEN_DECIMALS - PRICE_DECIMALS);
    }

    function calculateTokenAmount(uint256 usdAmount) public view returns (uint256) {
        uint256 price = getCopperPriceInUSD();
        require(price > 0, "Price not set");
        return (usdAmount * 10**TOKEN_DECIMALS) / price;
    }

    function getTreasuryInfo() external view returns (
        uint256 _copperPrice,
        uint256 _nav,
        uint256 _totalSupply,
        uint256 _lastUpdate
    ) {
        _copperPrice = getCopperPriceInUSD();
        _nav = _copperPrice;
        _totalSupply = totalSupply();
        _lastUpdate = lastUpdateTime;
    }

    function mint(address to, uint256 usdAmount) external onlyOwner {
        require(usdAmount > 0, "Amount must be greater than 0");
        uint256 tokenAmount = calculateTokenAmount(usdAmount);
        require(tokenAmount > 0, "Token amount is zero");
        _mint(to, tokenAmount);
        emit Minted(to, usdAmount, tokenAmount);
    }

    function burn(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than 0");
        _burn(msg.sender, tokenAmount);
    }

    function setPriceFeed(address _newPriceFeed) external onlyOwner {
        require(_newPriceFeed != address(0), "Invalid address");
        priceFeed = AggregatorV3Interface(_newPriceFeed);
    }
}