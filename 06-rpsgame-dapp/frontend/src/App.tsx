import React, { useState, useEffect } from 'react';
import {
  connectWallet,
  createGame,
  joinAndCommit,
  revealMove,
  initContract,
  getGame,
  Move,
  GameStatus,
  Game
} from './utils/interact';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [opponentAddress, setOpponentAddress] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [committedMove, setCommittedMove] = useState<{ move: Move, salt: string } | null>(null);
  const [currentGameState, setCurrentGameState] = useState<Game | null>(null);
  const [playerRole, setPlayerRole] = useState<'player1' | 'player2' | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const { ethereum } = window;
      setIsMetaMaskInstalled(!!ethereum);
    };
    checkMetaMask();
  }, []);

  // Initialize contract and connect wallet on mount
  useEffect(() => {
    const init = async () => {
      try {
        // First initialize the contract
        const contract = await initContract();
        if (!contract) {
          setGameStatus('Failed to initialize contract. Please refresh the page.');
          return;
        }

        // Then try to connect wallet
        const address = await connectWallet();
        if (address) {
          setWalletAddress(address);
          setGameStatus('Wallet connected successfully!');
        }
      } catch (error: any) {
        console.error('Initialization error:', error);
        setGameStatus('Error: ' + error.message);
      }
    };

    if (isMetaMaskInstalled) {
      init();
    }

    // Add account change listener
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // Re-initialize contract with new account
          await initContract();
          // Reset game state when account changes
          setGameId(null);
          setPlayerRole(null);
          setCurrentGameState(null);
          setCommittedMove(null);
        } else {
          setWalletAddress(null);
          setGameId(null);
          setPlayerRole(null);
          setCurrentGameState(null);
          setCommittedMove(null);
        }
      });

      // Add chain change listener
      window.ethereum.on('chainChanged', async () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [isMetaMaskInstalled]);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        setGameStatus('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setGameStatus('Error connecting wallet: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreateGame = async (selectedMove: Move) => {
    if (!opponentAddress) {
      alert('Please enter opponent address');
      return;
    }
    setLoading(true);
    try {
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      const randomSalt = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      setCommittedMove({ move: selectedMove, salt: randomSalt });
      const newGameId = await createGame(opponentAddress, selectedMove, randomSalt);
      setGameId(newGameId);
      setPlayerRole('player1');
      setGameStatus('Game created! Waiting for opponent to join...');
      setOpponentAddress('');
      const state = await getGame(newGameId);
      if (state) {
        setCurrentGameState(state);
      }
    } catch (error: any) {
      setGameStatus('Error creating game: ' + error.message);
    }
    setLoading(false);
  };

  const handleJoinGame = async (selectedMove: Move) => {
    if (!gameId) {
      alert('Please enter game ID');
      return;
    }
    setLoading(true);
    try {
      if (!walletAddress) {
        const address = await connectWallet();
        if (!address) {
          setGameStatus('Please connect your wallet first');
          setLoading(false);
          return;
        }
        setWalletAddress(address);
      }

      setGameStatus('Transaction pending... Please confirm in MetaMask');
      
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      const randomSalt = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      setCommittedMove({ move: selectedMove, salt: randomSalt });
      await joinAndCommit(gameId, selectedMove, randomSalt);
      
      const currentAddress = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
      const state = await getGame(gameId);
      if (state) {
        setCurrentGameState(state);
        if (state.player1.toLowerCase() === currentAddress.toLowerCase()) {
          setPlayerRole('player1');
        } else if (state.player2.toLowerCase() === currentAddress.toLowerCase()) {
          setPlayerRole('player2');
        }
      }
    } catch (error: any) {
      console.error('Error joining game:', error);
      setGameStatus('Error joining game: ' + error.message);
    }
    setLoading(false);
  };

  const handleRevealMove = async () => {
    if (!gameId || !committedMove) {
      alert('Missing game ID or committed move');
      return;
    }
    setLoading(true);
    try {
      await revealMove(gameId, committedMove.move, committedMove.salt);
      const state = await getGame(gameId);
      if (state) {
        setCurrentGameState(state);
        if (state.status === GameStatus.Completed) {
          setGameStatus('Game over! ' + (state.winner === walletAddress ? 'You won!' : state.winner === '0x0000000000000000000000000000000000000000' ? 'It\'s a draw!' : 'You lost!'));
          setCommittedMove(null);
        }
      }
    } catch (error: any) {
      setGameStatus('Error revealing move: ' + error.message);
    }
    setLoading(false);
  };

  const getStateName = (status: GameStatus) => {
    switch (status) {
      case GameStatus.Created: return 'Created';
      case GameStatus.Player1Committed: return 'Player 1 Committed';
      case GameStatus.Player2Committed: return 'Player 2 Committed';
      case GameStatus.Player1Revealed: return 'Player 1 Revealed';
      case GameStatus.Player2Revealed: return 'Player 2 Revealed';
      case GameStatus.Completed: return 'Completed';
      default: return 'Unknown';
    }
  };

  const handleRefresh = async () => {
    if (gameId) {
      const state = await getGame(gameId);
      if (state) {
        setCurrentGameState(state);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rock Paper Scissors DApp</h1>
        {!isMetaMaskInstalled ? (
          <div className="error-message">
            <p>MetaMask is not installed!</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="install-link"
            >
              Install MetaMask
            </a>
          </div>
        ) : !walletAddress ? (
          <button 
            onClick={handleConnectWallet} 
            className="connect-button"
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="game-container">
            <p>Connected: {walletAddress}</p>
            {playerRole && <p>Your Role: {playerRole}</p>}

            {gameId && (
              <div className="game-section">
                <h2>Current Game</h2>
                <p>Game ID: {gameId}</p>
                <p>State: {currentGameState ? getStateName(currentGameState.status) : 'Loading...'}</p>
                {currentGameState?.winner && (
                  <p>Winner: {currentGameState.winner === '0x0000000000000000000000000000000000000000' ? 'Draw' : currentGameState.winner}</p>
                )}
                <button onClick={handleRefresh} className="refresh-button">
                  Refresh Game State
                </button>
              </div>
            )}

            {!gameId && (
              <div className="game-setup">
                <input
                  type="text"
                  placeholder="Enter opponent address"
                  value={opponentAddress}
                  onChange={(e) => setOpponentAddress(e.target.value)}
                />
                <div className="move-buttons">
                  <button onClick={() => handleCreateGame(Move.Rock)}>Create Game with Rock</button>
                  <button onClick={() => handleCreateGame(Move.Paper)}>Create Game with Paper</button>
                  <button onClick={() => handleCreateGame(Move.Scissors)}>Create Game with Scissors</button>
                </div>
              </div>
            )}

            {gameId && !playerRole && (
              <div className="join-game">
                <div className="move-buttons">
                  <button onClick={() => handleJoinGame(Move.Rock)}>Join with Rock</button>
                  <button onClick={() => handleJoinGame(Move.Paper)}>Join with Paper</button>
                  <button onClick={() => handleJoinGame(Move.Scissors)}>Join with Scissors</button>
                </div>
              </div>
            )}

            {gameId && playerRole && committedMove && currentGameState?.status === GameStatus.Player2Committed && (
              <button onClick={handleRevealMove} className="reveal-button">
                Reveal Move
              </button>
            )}

            {gameStatus && <p className="status-message">{gameStatus}</p>}
            {loading && <p>Loading...</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
