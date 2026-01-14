import {
    getBalance,
    requestTokens,
    canClaim,
    getRemainingAllowance,
    getContractAddresses,
} from "./contracts";

export function exposeEval() {
    window.__EVAL__ = {
        connectWallet: async () => {
            if (!window.ethereum) throw new Error("MetaMask not installed");
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return accounts[0];
        },

        requestTokens: async () => {
            return await requestTokens();
        },

        getBalance: async (address) => {
            return await getBalance(address);
        },

        canClaim: async (address) => {
            return await canClaim(address);
        },

        getRemainingAllowance: async (address) => {
            return await getRemainingAllowance(address);
        },

        getContractAddresses: async () => {
            return getContractAddresses();
        },
    };
}
