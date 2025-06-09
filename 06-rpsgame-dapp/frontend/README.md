# RPSGame DApp Frontend

A modern, user-friendly React frontend for the secure, multi-round Rock-Paper-Scissors DApp.

---

## ✨ Features
- **Role-aware UI:** Player 1, Player 2, and spectator views
- **Game State Awareness:** Real-time display of game status, round, and reveal progress
- **Commit-Reveal Security:** All moves are hashed and hidden until reveal
- **Multi-Round Support:** Continue games after draws, with round tracking
- **Hash Verification Helper:** Prevents "Invalid reveal" errors by letting users verify their move/salt
- **Dark Theme:** Modern, accessible, and responsive design

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Contract Address
- Ensure the deployed contract address is set in your frontend config (usually in `src/utils/interact.ts` or an `.env` file).

### 3. Start the App
```bash
npm start
```
- Open [http://localhost:3000](http://localhost:3000)

---

## 🕹️ Usage & Navigation

- **Create Game:** Start a new game as Player 1. Commit your move and salt.
- **Join Game:** Join as Player 2 using a Game ID. Commit your move and salt.
- **Reveal & Manage:** Reveal your move, see opponent status, and start new rounds after draws. Use the Hash Verification Helper if needed.
- **All Games:** View all games, their states, and round history. See who has revealed and what actions are available.

### Game State Flow
1. **Created:** Player 1 commits a hashed move and salt.
2. **Player1Committed:** Waiting for Player 2 to join and commit.
3. **Player2Committed:** Both players have committed. Time to reveal.
4. **Completed/Draw:** Winner is determined, or Player 1 can start a new round if draw.

---

## 🧑‍💻 Development

- **React + TypeScript**
- **State Management:** React hooks
- **Styling:** Inline styles and CSS modules
- **Linting:**
  ```bash
  npm run lint
  ```
- **Testing:** (if tests are added)
  ```bash
  npm test
  ```

---

## 🛠️ Troubleshooting

### "Invalid reveal" Error
- Use the **exact same move** and **exact same salt** you used when committing.
- Use the **Hash Verification Helper** in the Reveal & Manage page to test combinations.
- If you can't remember, try all possible moves with your salt.

### Other Issues
- **Wallet not connected:** Make sure MetaMask is installed and connected to Sepolia.
- **Contract address mismatch:** Ensure the frontend is using the correct deployed contract address.

---

## 🙏 Credits
- Built with [Create React App](https://create-react-app.dev/)
- UI inspired by modern DApp best practices
- Commit-reveal pattern for fairness and security

---

## 📄 License
MIT
