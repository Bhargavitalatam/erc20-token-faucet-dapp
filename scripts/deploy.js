import hre from "hardhat";

async function main() {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    console.log("Deploying with:", deployer.address);

    const FaucetToken = await ethers.getContractFactory("FaucetToken");
    const token = await FaucetToken.deploy();
    await token.waitForDeployment();

    const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
    const faucet = await TokenFaucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();

    await token.setFaucet(await faucet.getAddress());

    console.log("Token:", await token.getAddress());
    console.log("Faucet:", await faucet.getAddress());
}

main()
.then(() => process.exit(0))
.catch((err) => {
    console.error(err);
    process.exit(1);
});
