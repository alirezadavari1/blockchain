require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: ["24dd401d84fa4c360c19970bdbc0e8c6cb8dacd21f0ae73ac47616a3288330a1"]
    }
  }
};