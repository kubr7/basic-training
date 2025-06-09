# RPSGame DApp Backend (Smart Contract)

This directory contains the Solidity smart contract and Hardhat project for the secure, multi-round Rock-Paper-Scissors DApp.

---

## ✨ Features
- **Commit-Reveal Security:** Prevents cheating by requiring players to commit a hash of their move and salt
- **Multi-Round Support:** Games can continue for multiple rounds if there is a draw
- **Gas Optimized:** Uses struct packing and efficient state management
- **Event Emission:** Emits events for all major actions (created, committed, revealed, completed, draw, new round)
- **Role-Aware Logic:** Handles Player 1, Player 2, and round tracking

---

## 📄 Contract Overview
- **Location:** `contracts/RPSGame.sol`
- **Key Functions:**
  - `createGame(address player2, bytes32 commit1)`
  - `joinAndCommit(uint gameId, bytes32 commit2)`
  - `revealMove(uint gameId, uint8 move, string salt)`
  - `startNewRound(uint gameId, bytes32 commit1)`
  - `getGame(uint gameId)`
  - `getGameStatus(uint gameId)`
- **Events:**
  - `GameCreated`, `PlayerCommitted`, `PlayerRevealed`, `GameCompleted`, `GameDraw`, `NewRoundStarted`

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Configure Network
- Edit `hardhat.config.ts` for your network and wallet settings (default: Sepolia Testnet)

### 4. Deploy Contract
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```
- Copy the deployed contract address to the frontend config if needed

---

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```
- Includes tests for commit-reveal, multi-rounds, draws, and edge cases
- Gas usage is reported if `REPORT_GAS=true` is set

---

## 🛠️ Troubleshooting

### Common Issues
- **Invalid reveal:** The move and salt do not match the original commitment
- **Not ready for reveal:** Both players must commit before revealing
- **Already revealed:** Player has already revealed for this round
- **Network issues:** Ensure you are connected to the correct network (Sepolia)

### Useful Hardhat Commands
```bash
npx hardhat help
npx hardhat node
npx hardhat test
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 📁 Project Structure
- `contracts/` — Solidity smart contract(s)
- `test/` — Hardhat tests (TypeScript)
- `scripts/` — Deployment scripts
- `ignition/` — Hardhat Ignition modules (optional)
- `artifacts/`, `cache/`, `typechain-types/` — Build outputs (auto-generated)

---

## 🙏 Credits
- Built with [Hardhat](https://hardhat.org/)
- Solidity smart contract design
- Commit-reveal pattern for fairness and security

---

## 📄 License
MIT
