const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RockPaperScissors", function () {
  let RockPaperScissors;
  let rpsGame;
  let owner;
  let player1;
  let player2;
  let player3;

  // Helper function to hash moves
  function hashMove(move, salt) {
    return ethers.keccak256(ethers.solidityPacked(["uint8", "string"], [move, salt]));
  }

  beforeEach(async function () {
    [owner, player1, player2, player3] = await ethers.getSigners();
    RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    rpsGame = await RockPaperScissors.deploy();
    await rpsGame.waitForDeployment();
  });

  describe("Game Creation", function () {
    it("Should create a new game with correct initial state", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      const hashedMove = hashMove(move, salt);
      const tx = await rpsGame.connect(player1).createGame(player2.address, hashedMove);
      const receipt = await tx.wait();
      
      const gameId = 1;
      const game = await rpsGame.games(gameId);
      
      expect(game.player1).to.equal(player1.address);
      expect(game.player2).to.equal(player2.address);
      expect(game.status).to.equal(1); // Player1Committed state
      expect(game.move1).to.equal(0); // None move
      expect(game.move2).to.equal(0); // None move
      expect(game.commit1).to.equal(hashedMove);
      expect(game.commit2).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(game.roundNumber).to.equal(1); // First round
    });

    it("Should emit GameCreated event", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player1).createGame(player2.address, hashedMove))
        .to.emit(rpsGame, "GameCreated")
        .withArgs(1, player1.address, player2.address);
    });

    it("Should not allow playing against self", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player1).createGame(player1.address, hashedMove))
        .to.be.revertedWith("Cannot play against self");
    });

    it("Should not allow invalid hashed move", async function () {
      await expect(rpsGame.connect(player1).createGame(player2.address, ethers.ZeroHash))
        .to.be.revertedWith("Invalid hashed move");
    });

    it("Should not allow creating game with zero address", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player1).createGame(ethers.ZeroAddress, hashedMove))
        .to.be.revertedWith("Invalid opponent address");
    });

    it("Should allow creating multiple games with same opponent", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);

      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await expect(rpsGame.connect(player1).createGame(player2.address, hashedMove2))
        .to.emit(rpsGame, "GameCreated")
        .withArgs(2, player1.address, player2.address);
    });
  });

  describe("Game Joining and Commitment", function () {
    beforeEach(async function () {
      const move = 1; // Rock
      const salt = "secret123";
      const hashedMove = hashMove(move, salt);
      await rpsGame.connect(player1).createGame(player2.address, hashedMove);
    });

    it("Should allow player2 to join and commit", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player2).joinAndCommit(1, hashedMove))
        .to.emit(rpsGame, "PlayerCommitted")
        .withArgs(1, player2.address, 1); // Now includes round number
      
      const game = await rpsGame.games(1);
      expect(game.status).to.equal(2); // Player2Committed state
    });

    it("Should not allow non-player2 to join", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player3).joinAndCommit(1, hashedMove))
        .to.be.revertedWith("Only opponent can join");
    });

    it("Should not allow joining with invalid hashed move", async function () {
      await expect(rpsGame.connect(player2).joinAndCommit(1, ethers.ZeroHash))
        .to.be.revertedWith("Invalid hashed move");
    });

    it("Should not allow joining a game in wrong state", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      const hashedMove = hashMove(move, salt);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove);
      await expect(rpsGame.connect(player2).joinAndCommit(1, hashedMove))
        .to.be.revertedWith("Game not joinable");
    });

    it("Should not allow joining non-existent game", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      const hashedMove = hashMove(move, salt);
      await expect(rpsGame.connect(player2).joinAndCommit(999, hashedMove))
        .to.be.revertedWith("Invalid game ID"); // Updated error message
    });
  });

  describe("Move Revealing", function () {
    beforeEach(async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
    });

    it("Should allow players to reveal their moves", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      await expect(rpsGame.connect(player1).revealMove(1, move1, salt1))
        .to.emit(rpsGame, "PlayerRevealed")
        .withArgs(1, player1.address, move1, 1); // Now includes round number
    });

    it("Should not allow revealing with wrong salt", async function () {
      const move1 = 1; // Rock
      const salt1 = "wrongsalt";
      await expect(rpsGame.connect(player1).revealMove(1, move1, salt1))
        .to.be.revertedWith("Invalid reveal");
    });

    it("Should not allow revealing twice", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player1).revealMove(1, move1, salt1))
        .to.be.revertedWith("Already revealed");
    });

    it("Should not allow non-players to reveal", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      await expect(rpsGame.connect(player3).revealMove(1, move1, salt1))
        .to.be.revertedWith("Not a player");
    });

    it("Should not allow revealing before both players commit", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const hashedMove1 = hashMove(move1, salt1);
      
      // Create new game - this will be game ID 2 (since beforeEach created game ID 1)
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      
      // Try to reveal before player2 commits (on the new game)
      await expect(rpsGame.connect(player1).revealMove(2, move1, salt1))
        .to.be.revertedWith("Cannot reveal yet");
    });

    it("Should not allow revealing with invalid move", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);

      // Create new game - this will be game ID 2 (since beforeEach created game ID 1)
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      
      // Player2 joins the new game
      await rpsGame.connect(player2).joinAndCommit(2, hashedMove2);

      // Try to reveal with invalid move (0 = None) on the new game
      await expect(rpsGame.connect(player1).revealMove(2, 0, salt1))
        .to.be.revertedWith("Invalid move");
    });

    it("Should not allow revealing in non-existent game", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      await expect(rpsGame.connect(player1).revealMove(999, move, salt))
        .to.be.revertedWith("Not a player"); // onlyPlayer modifier checks first
    });
  });

  describe("Game Completion", function () {
    it("Should determine correct winner - Rock vs Scissors (Player 1 wins)", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 3; // Scissors
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2, 1); // Now includes round number
    });

    it("Should determine correct winner - Paper vs Rock (Player 1 wins)", async function () {
      const move1 = 2; // Paper
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2, 1);
    });

    it("Should determine correct winner - Scissors vs Paper (Player 1 wins)", async function () {
      const move1 = 3; // Scissors
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2, 1);
    });

    it("Should determine correct winner - Scissors vs Rock (Player 2 wins)", async function () {
      const move1 = 3; // Scissors
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2, 1);
    });

    it("Should determine correct winner - Rock vs Paper (Player 2 wins)", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2, 1);
    });

    it("Should determine correct winner - Paper vs Scissors (Player 2 wins)", async function () {
      const move1 = 2; // Paper
      const salt1 = "secret123";
      const move2 = 3; // Scissors
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2, 1);
    });

    it("Should determine draw when moves are the same", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);
      
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameDraw") // Now emits GameDraw instead of GameCompleted
        .withArgs(1, move1, move2, 1);
    });
  });

  describe("Game Reset", function () {
    it("Should reset game state after draw", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);

      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await rpsGame.connect(player2).revealMove(1, move2, salt2);

      const game = await rpsGame.games(1);
      expect(game.status).to.equal(4); // Draw state instead of Created (0)
      expect(game.commit1).to.equal(ethers.ZeroHash);
      expect(game.commit2).to.equal(ethers.ZeroHash);
      expect(game.move1).to.equal(0); // None
      expect(game.move2).to.equal(0); // None
      expect(game.roundNumber).to.equal(1); // Round number remains
    });

    it("Should allow new game creation after draw", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);

      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await rpsGame.connect(player2).revealMove(1, move2, salt2);

      // Create new game with same players
      const move3 = 2; // Paper
      const salt3 = "secret789";
      const hashedMove3 = hashMove(move3, salt3);
      await expect(rpsGame.connect(player1).createGame(player2.address, hashedMove3))
        .to.emit(rpsGame, "GameCreated")
        .withArgs(2, player1.address, player2.address);
    });

    it("Should allow starting new round after draw", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      const hashedMove1 = hashMove(move1, salt1);
      const hashedMove2 = hashMove(move2, salt2);

      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
      await rpsGame.connect(player2).joinAndCommit(1, hashedMove2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await rpsGame.connect(player2).revealMove(1, move2, salt2);

      // Start new round
      const newMove = 2; // Paper
      const newSalt = "newsecret";
      const newHashedMove = hashMove(newMove, newSalt);
      
      await expect(rpsGame.connect(player1).startNewRound(1, newHashedMove))
        .to.emit(rpsGame, "NewRoundStarted")
        .withArgs(1, 2); // Round 2

      const game = await rpsGame.games(1);
      expect(game.status).to.equal(1); // Player1Committed
      expect(game.roundNumber).to.equal(2); // Round 2
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const hashedMove1 = hashMove(move1, salt1);
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);
    });

    it("Should return correct player games", async function () {
      const games = await rpsGame.getPlayerGames(player1.address);
      expect(games.length).to.equal(1);
      expect(games[0]).to.equal(1);
    });

    it("Should return empty array for player with no games", async function () {
      const games = await rpsGame.getPlayerGames(player3.address);
      expect(games.length).to.equal(0);
    });

    it("Should return correct game details", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const hashedMove1 = hashMove(move1, salt1);
      await rpsGame.connect(player1).createGame(player2.address, hashedMove1);

      const game = await rpsGame.getGame(1);
      expect(game.player1).to.equal(player1.address);
      expect(game.player2).to.equal(player2.address);
      expect(game.status).to.equal(1); // Player1Committed state
      expect(game.commit1).to.equal(hashedMove1);
      expect(game.commit2).to.equal(ethers.ZeroHash);
      expect(game.move1).to.equal(0); // None
      expect(game.move2).to.equal(0); // None
      expect(game.winner).to.equal(ethers.ZeroAddress);
    });
  });
}); 