import { useState, useEffect } from 'react';
import { getGame, getGameCount, Move, Game, GameStatus, initContract } from '../utils/interact';

const styles = {
  gameCard: {
    backgroundColor: '#2c313c',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  gameId: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#61dafb',
  },
  gameStatus: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  playerInfo: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
  },
  address: {
    wordBreak: 'break-all' as const,
    fontSize: '0.9rem',
    color: '#ffffff',
  },
  winner: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(0, 255, 136, 0.2)',
  },
  moves: {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
  },
  move: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#61dafb',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center' as const,
    padding: '1rem',
  },
  refreshButton: {
    marginBottom: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const getStatusStyle = (status: GameStatus) => {
  switch (status) {
    case GameStatus.Created:
      return { ...styles.gameStatus, backgroundColor: '#ffd700', color: '#000000' };
    case GameStatus.Player1Committed:
      return { ...styles.gameStatus, backgroundColor: '#ffa500', color: '#000000' };
    case GameStatus.Player2Committed:
      return { ...styles.gameStatus, backgroundColor: '#ff8c00', color: '#000000' };
    case GameStatus.Completed:
      return { ...styles.gameStatus, backgroundColor: '#4CAF50', color: '#ffffff' };
    default:
      return { ...styles.gameStatus, backgroundColor: '#666666', color: '#ffffff' };
  }
};

const getStatusText = (status: GameStatus) => {
  switch (status) {
    case GameStatus.Created:
      return 'Created';
    case GameStatus.Player1Committed:
      return 'Player 1 Committed';
    case GameStatus.Player2Committed:
      return 'Player 2 Committed';
    case GameStatus.Completed:
      return 'Completed';
    default:
      return 'Unknown';
  }
};

const AllGamesPage = () => {
  const [games, setGames] = useState<{ id: number; game: Game }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      setError(null);
      await initContract();
      const count = await getGameCount();
      const gamePromises = Array.from({ length: count }, (_, i) => i + 1).map(async (id) => {
        const game = await getGame(id);
        return { id, game };
      });
      const allGames = await Promise.all(gamePromises);
      setGames(allGames);
    } catch (err: any) {
      setError(err.message || 'Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading games...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div className="page-container">
      <h2>All Games</h2>
      <button onClick={fetchAllGames} style={styles.refreshButton}>
        Refresh Games
      </button>
      <div className="games-list">
        {games.map(({ id, game }) => (
          <div key={id} style={styles.gameCard}>
            <div style={styles.gameHeader}>
              <span style={styles.gameId}>Game #{id}</span>
              <span style={getStatusStyle(game.status)}>
                {getStatusText(game.status)}
              </span>
            </div>
            <div style={styles.playerInfo}>
              <p>Player 1: <span style={styles.address}>{game.player1}</span></p>
              <p>Player 2: <span style={styles.address}>{game.player2}</span></p>
            </div>
            {game.move1 !== Move.None && game.move2 !== Move.None && (
              <div style={styles.moves}>
                <div style={styles.move}>
                  Player 1: {Move[game.move1]}
                </div>
                <div style={styles.move}>
                  Player 2: {Move[game.move2]}
                </div>
              </div>
            )}
            {game.winner !== '0x0000000000000000000000000000000000000000' && (
              <div style={styles.winner}>
                <p>Winner: <span style={styles.address}>{game.winner}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGamesPage; 