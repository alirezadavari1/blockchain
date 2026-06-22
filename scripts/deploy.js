const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const CopperToken = await ethers.getContractFactory("CopperToken");
  const token = await CopperToken.deploy();

  await token.waitForDeployment(); // ← این خط اصلاح شده
  console.log("ABCO Token deployed to:", await token.getAddress()); // ← این خط اصلاح شده
}

main().catch((error) => {
  console.error("❌ Error during deployment:", error);
  process.exitCode = 1;
});