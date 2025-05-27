const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RockPaperScissors", function () {
  let RockPaperScissors;
  let rpsGame;
  let owner;
  let player1;
  let player2;
  let player3;

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
      const tx = await rpsGame.connect(player1).createGame(player2.address, move, salt);
      const receipt = await tx.wait();
      
      const gameId = 1;
      const game = await rpsGame.games(gameId);
      
      expect(game.player1).to.equal(player1.address);
      expect(game.player2).to.equal(player2.address);
      expect(game.status).to.equal(1); // Player1Committed state
      expect(game.move1).to.equal(0); // None move
      expect(game.move2).to.equal(0); // None move
      expect(game.commit1).to.equal(ethers.keccak256(ethers.solidityPacked(["uint8", "string"], [move, salt])));
      expect(game.commit2).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    });

    it("Should emit GameCreated event", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      await expect(rpsGame.connect(player1).createGame(player2.address, move, salt))
        .to.emit(rpsGame, "GameCreated")
        .withArgs(1, player1.address, player2.address);
    });

    it("Should not allow playing against self", async function () {
      const move = 1; // Rock
      const salt = "secret123";
      await expect(rpsGame.connect(player1).createGame(player1.address, move, salt))
        .to.be.revertedWith("Cannot play against self");
    });

    it("Should not allow invalid moves", async function () {
      const move = 0; // None
      const salt = "secret123";
      await expect(rpsGame.connect(player1).createGame(player2.address, move, salt))
        .to.be.revertedWith("Invalid move");
    });
  });

  describe("Game Joining and Commitment", function () {
    beforeEach(async function () {
      const move = 1; // Rock
      const salt = "secret123";
      await rpsGame.connect(player1).createGame(player2.address, move, salt);
    });

    it("Should allow player2 to join and commit", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      await expect(rpsGame.connect(player2).joinAndCommit(1, move, salt))
        .to.emit(rpsGame, "PlayerCommitted")
        .withArgs(1, player2.address);
      
      const game = await rpsGame.games(1);
      expect(game.status).to.equal(2); // Player2Committed state
    });

    it("Should not allow non-player2 to join", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      await expect(rpsGame.connect(player3).joinAndCommit(1, move, salt))
        .to.be.revertedWith("Only opponent can join");
    });

    it("Should not allow joining with invalid move", async function () {
      const move = 0; // None
      const salt = "secret456";
      await expect(rpsGame.connect(player2).joinAndCommit(1, move, salt))
        .to.be.revertedWith("Invalid move");
    });

    it("Should not allow joining a game in wrong state", async function () {
      const move = 2; // Paper
      const salt = "secret456";
      await rpsGame.connect(player2).joinAndCommit(1, move, salt);
      await expect(rpsGame.connect(player2).joinAndCommit(1, move, salt))
        .to.be.revertedWith("Game not joinable");
    });
  });

  describe("Move Revealing", function () {
    beforeEach(async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
    });

    it("Should allow players to reveal their moves", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      await expect(rpsGame.connect(player1).revealMove(1, move1, salt1))
        .to.emit(rpsGame, "PlayerRevealed")
        .withArgs(1, player1.address, move1);
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
  });

  describe("Game Completion", function () {
    it("Should determine correct winner - Rock vs Scissors (Player 1 wins)", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 3; // Scissors
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2);
    });

    it("Should determine correct winner - Paper vs Rock (Player 1 wins)", async function () {
      const move1 = 2; // Paper
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2);
    });

    it("Should determine correct winner - Scissors vs Paper (Player 1 wins)", async function () {
      const move1 = 3; // Scissors
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player1.address, move1, move2);
    });

    it("Should determine correct winner - Scissors vs Rock (Player 2 wins)", async function () {
      const move1 = 3; // Scissors
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2);
    });

    it("Should determine correct winner - Rock vs Paper (Player 2 wins)", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 2; // Paper
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2);
    });

    it("Should determine correct winner - Paper vs Scissors (Player 2 wins)", async function () {
      const move1 = 2; // Paper
      const salt1 = "secret123";
      const move2 = 3; // Scissors
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, player2.address, move1, move2);
    });

    it("Should determine draw when moves are the same", async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      const move2 = 1; // Rock
      const salt2 = "secret456";
      
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
      await rpsGame.connect(player2).joinAndCommit(1, move2, salt2);
      await rpsGame.connect(player1).revealMove(1, move1, salt1);
      await expect(rpsGame.connect(player2).revealMove(1, move2, salt2))
        .to.emit(rpsGame, "GameCompleted")
        .withArgs(1, ethers.ZeroAddress, move1, move2);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const move1 = 1; // Rock
      const salt1 = "secret123";
      await rpsGame.connect(player1).createGame(player2.address, move1, salt1);
    });

    it("Should return correct player games", async function () {
      const player1Games = await rpsGame.getPlayerGames(player1.address);
      const player2Games = await rpsGame.getPlayerGames(player2.address);
      
      expect(player1Games).to.deep.equal([1]);
      expect(player2Games).to.deep.equal([1]);
    });

    it("Should return correct game details", async function () {
      const game = await rpsGame.getGame(1);
      expect(game.player1).to.equal(player1.address);
      expect(game.player2).to.equal(player2.address);
      expect(game.status).to.equal(1); // Player1Committed state
    });
  });
}); 