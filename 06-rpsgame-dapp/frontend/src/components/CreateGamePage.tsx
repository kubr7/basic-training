import { useState, useEffect } from 'react';
import { connectWallet, createGame, Move, initContract } from '../utils/interact';

const CreateGamePage = () => {
  const [opponentAddress, setOpponentAddress] = useState('');
  const [moveSalt, setMoveSalt] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move | ''>('');

  useEffect(() => {
    const init = async () => {
      try {
        await connectWallet();
        await initContract();
        setIsConnected(true);
      } catch (error: any) {
        setGameStatus('Error connecting wallet: ' + error.message);
      }
    };
    init();
  }, []);

  const handleCreateGame = async () => {
    if (!isConnected) {
      setGameStatus('Please connect your wallet first');
      return;
    }
    if (!opponentAddress) {
      alert('Please enter opponent address');
      return;
    }
    if (!moveSalt) {
      alert('Please enter a salt for your move');
      return;
    }
    if (!selectedMove) {
      alert('Please select your move');
      return;
    }
    setLoading(true);
    try {
      const newGameId = await createGame(opponentAddress, selectedMove, moveSalt);
      setGameStatus(`Game created with ID: ${newGameId}`);
      setOpponentAddress('');
      setMoveSalt('');
      setSelectedMove('');
    } catch (error: any) {
      setGameStatus('Error creating game: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>Create New Game</h2>
      {!isConnected ? (
        <div className="error-message">
          <p>Please connect your wallet first</p>
        </div>
      ) : (
        <>
          <div className="instructions">
            <p>1. Enter your opponent's wallet address</p>
            <p>2. Choose your move (Rock/Paper/Scissors)</p>
            <p>3. Enter a salt (remember this for revealing your move later)</p>
            <p>4. Create the game and wait for your opponent to join</p>
          </div>
          <input
            type="text"
            placeholder="Enter opponent address"
            value={opponentAddress}
            onChange={(e) => setOpponentAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter salt for your move"
            value={moveSalt}
            onChange={(e) => setMoveSalt(e.target.value)}
          />
          <select 
            value={selectedMove} 
            onChange={(e) => setSelectedMove(e.target.value as unknown as Move)}
            className="move-select"
          >
            <option value="">Select your move</option>
            <option value={Move.Rock}>Rock</option>
            <option value={Move.Paper}>Paper</option>
            <option value={Move.Scissors}>Scissors</option>
          </select>
          <button 
            onClick={handleCreateGame}
            className="create-game-button"
          >
            Create Game
          </button>
        </>
      )}
      {gameStatus && <p className="status-message">{gameStatus}</p>}
      {loading && <p className="loading-message">Loading...</p>}
    </div>
  );
};

export default CreateGamePage; 