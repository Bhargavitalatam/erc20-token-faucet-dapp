# Token Faucet DApp

## Overview
A full-stack Web3 Token Faucet DApp deployed on **Sepolia Testnet**.  
Users can connect their wallet, check eligibility, and claim ERC-20 tokens with cooldown and lifetime limits enforced fully on-chain.

This project demonstrates **smart contract security**, **frontend–contract integration**, **Dockerized deployment**, and **automated evaluation support**.

---

## Features
- ERC-20 token with capped supply
- Faucet contract with:
  - Cooldown-based rate limiting
  - Lifetime claim limit
  - Pause/unpause functionality
- MetaMask wallet integration
- Real-time balance & eligibility updates
- Transaction confirmation flow
- Evaluation interface via `window.__EVAL__`
- Docker + Docker Compose support
- `/health` endpoint for automated checks

---

## Tech Stack
### Blockchain
- Solidity `^0.8.20`
- Hardhat
- OpenZeppelin ERC-20

### Frontend
- React (Vite)
- ethers.js v6

### DevOps
- Docker
- Docker Compose

---

## Deployed Contracts (Sepolia)
- **Token:** `0x877E5fe2CF694dd4df3196A220eE14e989410926`
- **Faucet:** `0x2481e645d1d5211F371AE1f27662c79756ff6807`

### Etherscan Verification
- Token: https://sepolia.etherscan.io/address/0x877E5fe2CF694dd4df3196A220eE14e989410926
- Faucet: https://sepolia.etherscan.io/address/0x2481e645d1d5211F371AE1f27662c79756ff6807

---

## Architecture Overview
```
User (Browser)
   |
   v
React Frontend (ethers.js)
   |
   |-- balanceOf()
   |-- canClaim()
   |-- requestTokens()
   v
TokenFaucet Contract
   |
   |-- mint()
   v
ERC-20 Token Contract
```

---

## Screenshots & Video Demo
All visual artifacts required for evaluation are included in the repository:

```
docs/
 ├─ screenshots/
 │   ├─ wallet-connect.png
 │   ├─ balance-display.png
 │   ├─ successful-claim.png
 │   ├─ cooldown-error.png
 │   └─ metamask-confirmation.png
 └─ demo-video.mp4
```

---

## Evaluation Interface (`window.__EVAL__`)
Accessible from the browser console:
```js
window.__EVAL__.connectWallet()
window.__EVAL__.getContractAddresses()
window.__EVAL__.getBalance()
window.__EVAL__.canClaim()
window.__EVAL__.requestTokens()
```

---

## Environment Variables

### Root `.env.example` (copy to `.env`)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=YOUR_TEST_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_KEY

VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_TOKEN_ADDRESS=0x...
VITE_FAUCET_ADDRESS=0x...
```

---

## Running with Docker (Recommended for Evaluation)

### Prerequisites
- Docker
- Docker Compose

### Steps
```bash
git clone <repository-url>
cd token-faucet-dapp
cp .env.example .env
# fill in values
docker compose up --build
```

### Access
- Application: http://localhost:3000
- Health Check: http://localhost:3000/health

The application becomes available within **60 seconds**.

---

## Running without Docker (Local Development)

### Prerequisites
- Node.js >= 18
- npm

### Root (Contracts)
```bash
npm install
npx hardhat compile
npx hardhat test
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the app at: http://localhost:5173

---

## Security Considerations
- Faucet-only minting enforced
- Cooldown & lifetime limits fully on-chain
- No private keys exposed in frontend
- Reentrancy-safe contract logic
- Solidity 0.8+ overflow protection

---

## Health Endpoint
```http
GET /health
```
Response:
```json
{ "status": "ok" }
```

---

## Submission Notes
- `.env` files excluded from repository
- Contracts verified on Etherscan
- Screenshots & video included in `docs/`
- Fully compatible with automated evaluation
- Clean separation of concerns

---

## Author
**Token Faucet DApp**  
Full-Stack Web3 Assignment Submission
