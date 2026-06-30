async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("📡 Deploying with account:", deployer.address);

  const Token = await ethers.getContractFactory("CopperTokenV2");
  const token = await Token.deploy();

  await token.waitForDeployment();
  console.log("✅ CopperTokenV2 deployed to:", await token.getAddress());
}

main().catch(console.error);