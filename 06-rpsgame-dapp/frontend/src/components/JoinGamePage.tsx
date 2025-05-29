import { useState, useEffect } from 'react';
import { connectWallet, joinAndCommit, getPlayerGames, getGame, Move, Game, GameStatus, initContract } from '../utils/interact';

const JoinGamePage = () => {
  const [moveSalt, setMoveSalt] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [availableGames, setAvailableGames] = useState<{ id: number; game: Game }[]>([]);
  const [gameIdInput, setGameIdInput] = useState('');
  const [selectedMove, setSelectedMove] = useState<Move>(Move.Rock);

  useEffect(() => {
    const init = async () => {
      try {
        const address = await connectWallet();
        if (address) {
          setWalletAddress(address);
          await initContract();
          fetchAvailableGames(address);
        }
      } catch (error: any) {
        setGameStatus('Error initializing: ' + error.message);
      }
    };
    init();
  }, []);

  const fetchAvailableGames = async (address: string) => {
    try {
      const gameIds = await getPlayerGames(address);
      const games = await Promise.all(
        gameIds.map(async (id) => {
          const game = await getGame(id);
          return { id, game };
        })
      );
      const availableGames = games.filter(
        ({ game }) => 
          game.player2.toLowerCase() === address.toLowerCase() && 
          game.status === GameStatus.Player1Committed
      );
      setAvailableGames(availableGames);
    } catch (error: any) {
      setGameStatus('Error fetching games: ' + error.message);
    }
  };

  const handleJoinGame = async (gameId: number) => {
    if (!moveSalt) {
      alert('Please enter a salt for your move');
      return;
    }
    setLoading(true);
    try {
      await joinAndCommit(gameId, selectedMove, moveSalt);
      setMoveSalt('');
      setGameStatus('Successfully joined the game!');
      // Refresh available games
      if (walletAddress) {
        fetchAvailableGames(walletAddress);
      }
    } catch (error: any) {
      setGameStatus('Error joining game: ' + error.message);
    }
    setLoading(false);
  };

  const handleJoinGameById = async () => {
    if (!moveSalt) {
      alert('Please enter a salt for your move');
      return;
    }
    if (!gameIdInput) {
      alert('Please enter a game ID');
      return;
    }
    const gameId = parseInt(gameIdInput);
    if (isNaN(gameId)) {
      alert('Please enter a valid game ID');
      return;
    }
    setLoading(true);
    try {
      await joinAndCommit(gameId, selectedMove, moveSalt);
      setMoveSalt('');
      setGameIdInput('');
      setGameStatus('Successfully joined the game!');
      // Refresh available games
      if (walletAddress) {
        fetchAvailableGames(walletAddress);
      }
    } catch (error: any) {
      setGameStatus('Error joining game: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>Join a Game</h2>
      <div className="instructions">
        <p>1. Choose from available games below or enter a specific game ID</p>
        <p>2. Choose your move (Rock/Paper/Scissors)</p>
        <p>3. Enter a salt (remember this for revealing your move later)</p>
        <p>4. Join the game and wait for the other player to reveal their move</p>
      </div>
      <div className="join-by-id">
        <input
          type="text"
          placeholder="Enter game ID"
          value={gameIdInput}
          onChange={(e) => setGameIdInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter salt for your move"
          value={moveSalt}
          onChange={(e) => setMoveSalt(e.target.value)}
        />
        <select 
          value={selectedMove} 
          onChange={(e) => setSelectedMove(Number(e.target.value) as Move)}
        >
          <option value={Move.Rock}>Rock</option>
          <option value={Move.Paper}>Paper</option>
          <option value={Move.Scissors}>Scissors</option>
        </select>
        <button onClick={handleJoinGameById}>Join Game</button>
      </div>
      <h3>Available Games</h3>
      {availableGames.length > 0 ? (
        <div className="games-list">
          {availableGames.map(({ id, game }) => (
            <div key={id} className="game-item">
              <p>Game ID: {id}</p>
              <p>Player 1: {game.player1}</p>
              <button onClick={() => handleJoinGame(id)}>Join Game</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No games available to join</p>
      )}
      {gameStatus && <p className="status-message">{gameStatus}</p>}
      {loading && <p className="loading-message">Loading...</p>}
    </div>
  );
};

export default JoinGamePage; 