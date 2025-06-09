// src/utils/interact.ts
import { BrowserProvider, Contract, keccak256, solidityPacked } from "ethers";
import contractAbi from "./RPSGameContract.json";
import { contractAddress } from "../config";

declare global {
  interface Window {
    ethereum: any;
  }
}

export enum Move {
  None = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

export enum GameStatus {
  Created = 0,
  Player1Committed = 1,
  Player2Committed = 2,
  Completed = 3,
  Draw = 4
}

export interface Game {
  player1: string;
  player2: string;
  winner: string;
  commit1: string;
  commit2: string;
  move1: Move;
  move2: Move;
  status: GameStatus;
  roundNumber: number;
}

export interface GameStatus_Extended {
  status: GameStatus;
  roundNumber: number;
  winner: string;
}

let contract: Contract | null = null;

// Helper function to hash moves (matches contract implementation)
export const hashMove = (move: Move, salt: string): string => {
  return keccak256(solidityPacked(["uint8", "string"], [move, salt]));
};

export const initContract = async (): Promise<Contract | null> => {
  if (window.ethereum) {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      contract = new Contract(contractAddress, contractAbi.abi, signer);
      return contract;
    } catch (error) {
      console.error("Error initializing contract:", error);
      return null;
    }
  }
  return null;
};

export const connectWallet = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error('MetaMask not detected');
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    const sepoliaChainId = '0xaa36a7';
    if (chainId !== sepoliaChainId) {
      throw new Error('Please connect to Sepolia Testnet');
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || 'Error connecting to wallet');
  }
};

export const createGame = async (opponentAddress: string, move: Move, salt: string): Promise<number> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const hashedMove = hashMove(move, salt);
    const tx = await contract.createGame(opponentAddress, hashedMove);
    const receipt = await tx.wait();
    const event = receipt.logs?.find((log: { fragment?: { name: string }, args?: { gameId: bigint } }) => log?.fragment?.name === "GameCreated");
    if (!event) throw new Error("GameCreated event not found");
    const gameId = event.args.gameId;
    console.log("Game created with ID:", gameId);
    return Number(gameId);
  } catch (error: any) {
    throw new Error(error.message || 'Error creating game');
  }
};

export const joinAndCommit = async (gameId: number, move: Move, salt: string): Promise<void> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const hashedMove = hashMove(move, salt);
    const tx = await contract.joinAndCommit(gameId, hashedMove);
    await tx.wait();
  } catch (error: any) {
    throw new Error(error.message || 'Error joining and committing move');
  }
};

export const revealMove = async (gameId: number, move: Move, salt: string): Promise<void> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const tx = await contract.revealMove(gameId, move, salt);
    await tx.wait();
  } catch (error: any) {
    throw new Error(error.message || 'Error revealing move');
  }
};

export const startNewRound = async (gameId: number, move: Move, salt: string): Promise<void> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const hashedMove = hashMove(move, salt);
    const tx = await contract.startNewRound(gameId, hashedMove);
    await tx.wait();
  } catch (error: any) {
    throw new Error(error.message || 'Error starting new round');
  }
};

export const getGame = async (gameId: number): Promise<Game> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const game = await contract.getGame(gameId);
    return {
      player1: game.player1,
      player2: game.player2,
      winner: game.winner,
      commit1: game.commit1,
      commit2: game.commit2,
      move1: Number(game.move1),
      move2: Number(game.move2),
      status: Number(game.status),
      roundNumber: Number(game.roundNumber)
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error getting game');
  }
};

export const getGameStatus = async (gameId: number): Promise<GameStatus_Extended> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const result = await contract.getGameStatus(gameId);
    return {
      status: Number(result[0]),
      roundNumber: Number(result[1]),
      winner: result[2]
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error getting game status');
  }
};

export const getPlayerGames = async (playerAddress: string): Promise<number[]> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const games = await contract.getPlayerGames(playerAddress);
    return games.map((gameId: bigint) => Number(gameId));
  } catch (error: any) {
    throw new Error(error.message || 'Error getting player games');
  }
};

export const getGameCount = async (): Promise<number> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const count = await contract.gameCounter();
    return Number(count);
  } catch (error: any) {
    throw new Error(error.message || 'Error getting game count');
  }
};

// Event listeners for contract events
export const subscribeToGameEvents = (callback: (event: any) => void) => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }

  // Listen to all game-related events
  contract.on("GameCreated", (gameId, player1, player2, event) => {
    callback({
      type: "GameCreated",
      gameId: Number(gameId),
      player1,
      player2,
      event
    });
  });

  contract.on("PlayerCommitted", (gameId, player, round, event) => {
    callback({
      type: "PlayerCommitted",
      gameId: Number(gameId),
      player,
      round: Number(round),
      event
    });
  });

  contract.on("PlayerRevealed", (gameId, player, move, round, event) => {
    callback({
      type: "PlayerRevealed",
      gameId: Number(gameId),
      player,
      move: Number(move),
      round: Number(round),
      event
    });
  });

  contract.on("GameCompleted", (gameId, winner, move1, move2, round, event) => {
    callback({
      type: "GameCompleted",
      gameId: Number(gameId),
      winner,
      move1: Number(move1),
      move2: Number(move2),
      round: Number(round),
      event
    });
  });

  contract.on("GameDraw", (gameId, move1, move2, round, event) => {
    callback({
      type: "GameDraw",
      gameId: Number(gameId),
      move1: Number(move1),
      move2: Number(move2),
      round: Number(round),
      event
    });
  });

  contract.on("NewRoundStarted", (gameId, round, event) => {
    callback({
      type: "NewRoundStarted",
      gameId: Number(gameId),
      round: Number(round),
      event
    });
  });
};

export const unsubscribeFromGameEvents = () => {
  if (contract) {
    contract.removeAllListeners();
  }
};

// Utility functions
export const getMoveString = (move: Move): string => {
  switch (move) {
    case Move.Rock: return "Rock";
    case Move.Paper: return "Paper";
    case Move.Scissors: return "Scissors";
    default: return "None";
  }
};

export const getGameStatusString = (status: GameStatus): string => {
  switch (status) {
    case GameStatus.Created: return "Created";
    case GameStatus.Player1Committed: return "Waiting for Player 2";
    case GameStatus.Player2Committed: return "Ready to Reveal";
    case GameStatus.Completed: return "Completed";
    case GameStatus.Draw: return "Draw - Start New Round";
    default: return "Unknown";
  }
};

export const getWinnerString = (winner: string, player1: string, player2: string): string => {
  if (winner === "0x0000000000000000000000000000000000000000") {
    return "Draw";
  }
  if (winner.toLowerCase() === player1.toLowerCase()) {
    return "Player 1";
  }
  if (winner.toLowerCase() === player2.toLowerCase()) {
    return "Player 2";
  }
  return "Unknown";
};



