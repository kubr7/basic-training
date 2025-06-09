import { useState, useEffect } from 'react';
import { 
  connectWallet, 
  joinAndCommit, 
  getPlayerGames, 
  getGame, 
  Move, 
  Game, 
  GameStatus, 
  initContract,
  getGameStatusString
} from '../utils/interact';

const styles = {
  gameCard: {
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #064663',
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  gameId: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ECB365',
  },
  gameStatus: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    backgroundColor: '#064663',
    color: '#ECB365',
  },
  roundInfo: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#064663',
    borderRadius: '4px',
    color: '#ECB365',
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  playerInfo: {
    marginBottom: '0.5rem',
    color: '#ECB365',
    fontSize: '0.9rem',
  },
  address: {
    wordBreak: 'break-all' as const,
    color: '#ECB365',
  },
  button: {
    backgroundColor: '#28A745',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    color: '#ccc',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #064663',
    backgroundColor: '#041C32',
    color: '#ECB365',
    margin: '5px',
    width: '200px',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #064663',
    backgroundColor: '#041C32',
    color: '#ECB365',
    margin: '5px',
  },
  joinSection: {
    backgroundColor: '#04293A',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  drawNotice: {
    backgroundColor: '#FFB347',
    color: '#2C3E50',
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
  stateIndicator: {
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
  canJoin: {
    backgroundColor: '#28A745',
    color: 'white',
  },
  waitingForReveal: {
    backgroundColor: '#45B7D1',
    color: 'white',
  },
  revealStatus: {
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    backgroundColor: '#064663',
    color: '#ECB365',
  },
  userStatus: {
    backgroundColor: '#064663',
    color: '#ECB365',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  }
};

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
          try {
            const game = await getGame(id);
            return { id, game };
          } catch (error) {
            console.error(`Error fetching game ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null games and find all games where user is player2
      const validGames = games.filter(game => game !== null) as { id: number; game: Game }[];
      const userGames = validGames.filter(
        ({ game }) => game.player2.toLowerCase() === address.toLowerCase()
      );
      
      setAvailableGames(userGames);
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

  const isGameJoinable = (game: Game) => {
    return game.status === GameStatus.Player1Committed || game.status === GameStatus.Draw;
  };

  const getJoinButtonText = (game: Game) => {
    if (game.status === GameStatus.Draw) {
      return `🔄 Join Round ${game.roundNumber + 1}`;
    }
    return '🎯 Join Game';
  };

  const getGameStateMessage = (game: Game) => {
    switch (game.status) {
      case GameStatus.Player1Committed:
        return {
          message: '🎮 Ready to join! Player 1 is waiting for you.',
          style: styles.canJoin
        };
      case GameStatus.Player2Committed:
        const player1Revealed = game.move1 !== Move.None;
        const player2Revealed = game.move2 !== Move.None;
        
        if (player1Revealed && !player2Revealed) {
          return {
            message: '🔍 Player 1 revealed their move. You can reveal yours!',
            style: styles.waitingForReveal
          };
        } else if (!player1Revealed && player2Revealed) {
          return {
            message: '⏳ You revealed your move. Waiting for Player 1...',
            style: styles.waitingForReveal
          };
        } else if (player1Revealed && player2Revealed) {
          return {
            message: '✅ Both players revealed! Check results in "All Games".',
            style: styles.waitingForReveal
          };
        } else {
          return {
            message: '🔍 Both players committed. Time to reveal moves!',
            style: styles.waitingForReveal
          };
        }
      case GameStatus.Draw:
        return {
          message: '🎯 Previous round was a draw. You can join the next round!',
          style: styles.canJoin
        };
      case GameStatus.Completed:
        const isWinner = game.winner.toLowerCase() === game.player2.toLowerCase();
        return {
          message: isWinner ? '🏆 You won this game!' : '😔 You lost this game.',
          style: styles.waitingForReveal
        };
      default:
        return {
          message: '❓ Unknown game state',
          style: styles.waitingForReveal
        };
    }
  };

  const getRevealStatus = (game: Game) => {
    if (game.status !== GameStatus.Player2Committed && game.status !== GameStatus.Completed && game.status !== GameStatus.Draw) {
      return null;
    }

    const player1Revealed = game.move1 !== Move.None;
    const player2Revealed = game.move2 !== Move.None;

    if (player1Revealed && player2Revealed) {
      return '✅ Both players have revealed their moves';
    } else if (player1Revealed) {
      return '🔍 Player 1 revealed - Your turn to reveal!';
    } else if (player2Revealed) {
      return '⏳ You revealed - waiting for Player 1';
    } else {
      return '⏳ Both players need to reveal moves';
    }
  };

  // Categorize games
  const joinableGames = availableGames.filter(({ game }) => isGameJoinable(game));
  const waitingForReveal = availableGames.filter(({ game }) => 
    game.status === GameStatus.Player2Committed);
  const completedGames = availableGames.filter(({ game }) => 
    game.status === GameStatus.Completed);

  return (
    <div className="page-container">
      <h2>🤝 Join a Game</h2>
      
      {walletAddress && (
        <div style={styles.userStatus}>
          <p>📱 Connected as Player 2: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</p>
          <p>💡 You can join games where you are designated as Player 2</p>
        </div>
      )}

      <div className="instructions">
        <p>1. Choose from your available games below or enter a specific game ID</p>
        <p>2. Choose your move (Rock/Paper/Scissors)</p>
        <p>3. Enter a salt (remember this for revealing your move later)</p>
        <p>4. Join the game and then reveal moves when both players are ready</p>
      </div>
      
      <div style={styles.joinSection}>
        <h3>Join by Game ID</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter game ID"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Enter salt for your move"
            value={moveSalt}
            onChange={(e) => setMoveSalt(e.target.value)}
          />
          <select 
            style={styles.select}
            value={selectedMove} 
            onChange={(e) => setSelectedMove(Number(e.target.value) as Move)}
          >
            <option value={Move.Rock}>🗿 Rock</option>
            <option value={Move.Paper}>📄 Paper</option>
            <option value={Move.Scissors}>✂️ Scissors</option>
          </select>
          <button style={styles.button} onClick={handleJoinGameById}>
            Join Game
          </button>
        </div>
      </div>

      {/* Joinable Games Section */}
      {joinableGames.length > 0 && (
        <>
          <h3>🎮 Games You Can Join ({joinableGames.length})</h3>
          <div className="games-list">
            {joinableGames.map(({ id, game }) => {
              const gameState = getGameStateMessage(game);
              return (
                <div key={id} style={styles.gameCard}>
                  <div style={styles.gameHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={styles.gameId}>Game #{id}</span>
                      <span style={styles.roundInfo}>Round {game.roundNumber}</span>
                    </div>
                    <span style={styles.gameStatus}>
                      {getGameStatusString(game.status)}
                    </span>
                  </div>
                  
                  <div style={styles.playerInfo}>
                    <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span></p>
                    <p>You (Player 2): <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span></p>
                  </div>
                  
                  <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                    {gameState.message}
                  </div>
                  
                  {game.status === GameStatus.Draw && (
                    <div style={styles.drawNotice}>
                      🎯 Previous round ended in a draw. Join the next round to continue!
                    </div>
                  )}
                  
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      style={isGameJoinable(game) ? styles.button : styles.buttonDisabled}
                      onClick={() => handleJoinGame(id)}
                      disabled={!isGameJoinable(game)}
                    >
                      {getJoinButtonText(game)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Games Waiting for Reveal */}
      {waitingForReveal.length > 0 && (
        <>
          <h3>🔍 Games Waiting for Reveal ({waitingForReveal.length})</h3>
          <div className="games-list">
            {waitingForReveal.map(({ id, game }) => {
              const gameState = getGameStateMessage(game);
              const revealStatus = getRevealStatus(game);
              return (
                <div key={id} style={styles.gameCard}>
                  <div style={styles.gameHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={styles.gameId}>Game #{id}</span>
                      <span style={styles.roundInfo}>Round {game.roundNumber}</span>
                    </div>
                    <span style={styles.gameStatus}>
                      {getGameStatusString(game.status)}
                    </span>
                  </div>
                  
                  <div style={styles.playerInfo}>
                    <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span></p>
                    <p>You (Player 2): <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span></p>
                  </div>
                  
                  <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                    {gameState.message}
                  </div>
                  
                  {revealStatus && (
                    <div style={styles.revealStatus}>
                      {revealStatus}
                    </div>
                  )}
                  
                  <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#ECB365' }}>
                    💡 Go to "Reveal & Manage" page to reveal your move
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Completed Games */}
      {completedGames.length > 0 && (
        <>
          <h3>✅ Completed Games ({completedGames.length})</h3>
          <div className="games-list">
            {completedGames.map(({ id, game }) => {
              const gameState = getGameStateMessage(game);
              return (
                <div key={id} style={styles.gameCard}>
                  <div style={styles.gameHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={styles.gameId}>Game #{id}</span>
                      <span style={styles.roundInfo}>Round {game.roundNumber}</span>
                    </div>
                    <span style={styles.gameStatus}>
                      {getGameStatusString(game.status)}
                    </span>
                  </div>
                  
                  <div style={styles.playerInfo}>
                    <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span></p>
                    <p>You (Player 2): <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span></p>
                  </div>
                  
                  <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                    {gameState.message}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {availableGames.length === 0 && (
        <div style={styles.gameCard}>
          <p>No games found where you are Player 2</p>
          <p style={{ fontSize: '0.9rem', color: '#ECB365' }}>
            Games appear here when:
            <br />• Someone creates a game with you as Player 2
            <br />• A game you're in ends with a draw and needs a new round
          </p>
        </div>
      )}
      
      {gameStatus && (
        <p className="status-message" style={{ marginTop: '20px', color: '#ECB365' }}>
          {gameStatus}
        </p>
      )}
      {loading && (
        <p className="loading-message" style={{ color: '#ECB365' }}>
          Loading...
        </p>
      )}
    </div>
  );
};

export default JoinGamePage; 