import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("Token Faucet", function () {
    let token, faucet, owner, user;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        const FaucetToken = await ethers.getContractFactory("FaucetToken");
        token = await FaucetToken.deploy();
        await token.waitForDeployment(); // ✅ v6

        const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
        faucet = await TokenFaucet.deploy(await token.getAddress());
        await faucet.waitForDeployment(); // ✅ v6

        // 🔑 set faucet as minter
        await token.setFaucet(await faucet.getAddress());
    });

    it("allows first claim", async () => {
        await faucet.connect(user).requestTokens();
        const claimed = await faucet.totalClaimed(user.address);
        expect(claimed).to.equal(ethers.parseEther("100")); // ✅ v6
    });

    it("prevents immediate re-claim", async () => {
        await faucet.connect(user).requestTokens();
        await expect(
            faucet.connect(user).requestTokens()
        ).to.be.revertedWith("Cooldown period not elapsed");
    });
});
