import { useEffect, useState } from "react";
import {
    getBalance,
    requestTokens,
    canClaim,
    getRemainingAllowance,
    getLastClaimAt,
} from "./utils/contracts";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

export default function App() {
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState("0");
    const [eligible, setEligible] = useState(false);
    const [remaining, setRemaining] = useState("0");
    const [cooldown, setCooldown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ------------------ WALLET ------------------ */

    async function connectWallet() {
        try {
            if (!window.ethereum) {
                setError("MetaMask not installed");
                return;
            }

            // 🔒 force Sepolia
            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });

            if (chainId !== SEPOLIA_CHAIN_ID) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setAddress(accounts[0]);
            setError("");
        } catch (err) {
            setError(err.message || "Wallet connection failed");
        }
    }

    function disconnectWallet() {
        setAddress(null);
        setBalance("0");
        setEligible(false);
        setRemaining("0");
        setCooldown(null);
        setError("");

        // 💣 reset provider cache completely
        window.location.reload();
    }

    /* ------------------ DATA ------------------ */

    async function refresh(addr) {
        try {
            const bal = await getBalance(addr);
            const ok = await canClaim(addr);
            const rem = await getRemainingAllowance(addr);
            const last = await getLastClaimAt(addr);

            setBalance(bal);
            setEligible(ok);
            setRemaining(rem);

            if (!ok && last > 0) {
                const now = Math.floor(Date.now() / 1000);
                const cooldownSeconds = 24 * 60 * 60 - (now - last);
                setCooldown(cooldownSeconds > 0 ? cooldownSeconds : null);
            } else {
                setCooldown(null);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function claimTokens() {
        try {
            setLoading(true);
            setError("");
            await requestTokens();
            await refresh(address);
        } catch (err) {
            setError(err.reason || err.message);
        } finally {
            setLoading(false);
        }
    }

    /* ------------------ EFFECTS ------------------ */

    useEffect(() => {
        if (address) refresh(address);
    }, [address]);

    // 🔄 auto logout on account / network change
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = () => disconnectWallet();
        const handleChainChanged = () => disconnectWallet();

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    /* ------------------ UI ------------------ */

    function formatCooldown(seconds) {
        if (!seconds) return null;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    }

    return (
        <div style={{ padding: 40, maxWidth: 600 }}>
            <h1>Token Faucet</h1>

            {!address ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <>
                    <p><b>Address:</b> {address}</p>
                    <p><b>Balance:</b> {balance}</p>
                    <p><b>Remaining Allowance:</b> {remaining}</p>
                    <p><b>Can Claim:</b> {eligible ? "Yes" : "No"}</p>

                    {cooldown && (
                        <p>⏳ <b>Cooldown:</b> {formatCooldown(cooldown)}</p>
                    )}

                    <button
                        onClick={claimTokens}
                        disabled={!eligible || loading}
                    >
                        {loading ? "Claiming..." : "Request Tokens"}
                    </button>

                    <button
                        onClick={disconnectWallet}
                        style={{ marginLeft: 10 }}
                    >
                        Disconnect Wallet
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            )}
        </div>
    );
}
