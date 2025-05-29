// src/utils/interact.ts
import { BrowserProvider, Contract } from "ethers";
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
  Completed = 3
}

export interface Game {
  player1: string;
  player2: string;
  commit1: string;
  commit2: string;
  move1: Move;
  move2: Move;
  winner: string;
  status: GameStatus;
}

let contract: Contract | null = null;

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
    const tx = await contract.createGame(opponentAddress, move, salt);
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
    const tx = await contract.joinAndCommit(gameId, move, salt);
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

export const getGame = async (gameId: number): Promise<Game> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const game = await contract.getGame(gameId);
    return {
      player1: game.player1,
      player2: game.player2,
      commit1: game.commit1,
      commit2: game.commit2,
      move1: Number(game.move1),
      move2: Number(game.move2),
      winner: game.winner,
      status: Number(game.status)
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error getting game');
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

export const resolveGame = async (gameId: number): Promise<void> => {
  if (!contract) {
    throw new Error('Contract not initialized');
  }
  try {
    const tx = await contract.resolveGame(gameId);
    await tx.wait();
  } catch (error: any) {
    throw new Error(error.message || 'Error resolving game');
  }
};



