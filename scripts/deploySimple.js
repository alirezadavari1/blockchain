async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Token = await ethers.getContractFactory("SimpleToken");
  const token = await Token.deploy();

  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
}

main().catch(console.error);