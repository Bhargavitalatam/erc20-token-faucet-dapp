import { ethers } from "ethers";
import TokenArtifact from "./FaucetToken.json";
import FaucetArtifact from "./TokenFaucet.json";

const RPC_URL = import.meta.env.VITE_RPC_URL;
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

/* ---------------- PROVIDER ---------------- */

export function getProvider() {
    if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider(RPC_URL);
}

export async function getSigner() {
    const provider = getProvider();
    return await provider.getSigner();
}

/* ---------------- CONTRACTS ---------------- */

export async function getTokenContract(providerOrSigner) {
    return new ethers.Contract(
        TOKEN_ADDRESS,
        TokenArtifact.abi,
        providerOrSigner
    );
}

export async function getFaucetContract(providerOrSigner) {
    return new ethers.Contract(
        FAUCET_ADDRESS,
        FaucetArtifact.abi,
        providerOrSigner
    );
}

/* ---------------- READ ---------------- */

export async function getBalance(address) {
    const provider = getProvider();
    const token = await getTokenContract(provider);
    return (await token.balanceOf(address)).toString();
}

export async function canClaim(address) {
    const provider = getProvider();
    const faucet = await getFaucetContract(provider);
    return await faucet.canClaim(address);
}

export async function getRemainingAllowance(address) {
    const provider = getProvider();
    const faucet = await getFaucetContract(provider);
    return (await faucet.remainingAllowance(address)).toString();
}

export async function getLastClaimAt(address) {
    const provider = getProvider();
    const faucet = await getFaucetContract(provider);
    return Number(await faucet.lastClaimAt(address));
}

/* ---------------- WRITE ---------------- */

export async function requestTokens() {
    const signer = await getSigner();
    const faucet = await getFaucetContract(signer);
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
}

/* ---------------- EVAL API ---------------- */

window.__EVAL__ = {
    connectWallet: async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts[0];
    },

    getContractAddresses: () => ({
        token: TOKEN_ADDRESS,
        faucet: FAUCET_ADDRESS,
    }),

    getBalance: async (addr) => getBalance(addr),
    canClaim: async (addr) => canClaim(addr),
    requestTokens: async () => requestTokens(),
};

export function getContractAddresses() {
    return {
        token: TOKEN_ADDRESS,
        faucet: FAUCET_ADDRESS,
    };
}
