import { useState, useEffect } from 'react';
import { revealMove, getGame, Move, Game, GameStatus, initContract } from '../utils/interact';

const styles = {
  winnerInfo: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    border: '1px solid #b0e0e6',
  },
  moves: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  winnerAddress: {
    wordBreak: 'break-all' as const,
    fontSize: '0.9em',
    color: '#2c5282',
  }
};

const getStateName = (status: GameStatus, move1: Move, move2: Move) => {
  if (move1 !== Move.None && move2 !== Move.None) {
    return 'Moves Revealed';
  }
  switch (status) {
    case GameStatus.Created: return 'Created';
    case GameStatus.Player1Committed: return 'Player 1 Committed';
    case GameStatus.Player2Committed: return 'Player 2 Committed';
    case GameStatus.Completed: return 'Completed';
    default: return 'Unknown';
  }
};

const RevealMovePage = () => {
  const [gameId, setGameId] = useState('');
  const [move, setMove] = useState<Move>(Move.None);
  const [salt, setSalt] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isContractInitialized, setIsContractInitialized] = useState(false);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const contract = await initContract();
        if (contract) {
          setIsContractInitialized(true);
        } else {
          setGameStatus('Error: Failed to initialize contract. Please make sure MetaMask is installed and connected to Sepolia network.');
        }
      } catch (error: any) {
        setGameStatus('Error: ' + error.message);
      }
    };

    initializeContract();
  }, []);

  const handleRevealMove = async () => {
    if (!isContractInitialized) {
      setGameStatus('Error: Contract not initialized. Please make sure MetaMask is connected.');
      return;
    }
    if (!gameId || !move || !salt) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await revealMove(Number(gameId), move, salt);
      setGameStatus('Move revealed successfully!');
      
      // Get the updated game state
      const game = await getGame(Number(gameId));
      setCurrentGame(game);
      
      // If both players have revealed their moves, the game is automatically resolved by the contract
      if (game.move1 !== Move.None && game.move2 !== Move.None) {
        setGameStatus('Game completed!');
      }
    } catch (error: any) {
      setGameStatus('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleCheckGame = async () => {
    if (!isContractInitialized) {
      setGameStatus('Error: Contract not initialized. Please make sure MetaMask is connected.');
      return;
    }
    if (!gameId) {
      alert('Please enter a game ID');
      return;
    }
    try {
      const game = await getGame(Number(gameId));
      setCurrentGame(game);
      setGameStatus('Game found! You can now reveal your move.');
    } catch (error: any) {
      setGameStatus('Error: ' + error.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Reveal Your Move</h2>
      <div className="instructions">
        <p>1. Enter the game ID</p>
        <p>2. Select your move</p>
        <p>3. Enter the salt you used when committing your move</p>
        <p>4. Click reveal to show your move</p>
      </div>
      <input
        type="text"
        placeholder="Enter game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <button onClick={handleCheckGame}>Check Game</button>
      
      {currentGame && (
        <>
          <select value={move} onChange={(e) => setMove(Number(e.target.value))}>
            <option value={Move.None}>Select your move</option>
            <option value={Move.Rock}>Rock</option>
            <option value={Move.Paper}>Paper</option>
            <option value={Move.Scissors}>Scissors</option>
          </select>
          <input
            type="text"
            placeholder="Enter your salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
          <button onClick={handleRevealMove}>Reveal Move</button>
          
          <div className="game-info">
            <h3>Game Status</h3>
            <p>Status: {getStateName(currentGame.status, currentGame.move1, currentGame.move2)}</p>
            {currentGame.move1 !== Move.None && currentGame.move2 !== Move.None && (
              <div style={styles.winnerInfo}>
                <div style={styles.moves}>
                  <p>Player 1 Move: {Move[currentGame.move1]}</p>
                  <p>Player 2 Move: {Move[currentGame.move2]}</p>
                </div>
                {currentGame.winner !== '0x0000000000000000000000000000000000000000' ? (
                  <>
                    <h4>Winner</h4>
                    <p style={styles.winnerAddress}>{currentGame.winner}</p>
                  </>
                ) : (
                  <p>Game is in progress - waiting for resolution</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {gameStatus && <p className="status-message">{gameStatus}</p>}
      {loading && <p className="loading-message">Loading...</p>}
    </div>
  );
};

export default RevealMovePage; 