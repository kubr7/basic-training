import { useState, useEffect } from 'react';
import { 
  getGame, 
  getGameCount, 
  Move, 
  Game, 
  GameStatus, 
  initContract,
  getMoveString,
  getGameStatusString,
  getWinnerString,
  connectWallet
} from '../utils/interact';

const styles = {
  gameCard: {
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #064663',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
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
    color: '#ECB365',
  },
  gameStatus: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  gameHost: {
    fontSize: '0.9rem',
    color: '#ECB365',
  },
  playerInfo: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#04293A',
    borderRadius: '4px',
  },
  address: {
    wordBreak: 'break-all' as const,
    fontSize: '0.9rem',
    color: '#ECB365',
  },
  winner: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#04293A',
    borderRadius: '4px',
    border: '1px solid #064663',
  },
  moves: {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  move: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#04293A',
    borderRadius: '4px',
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
  drawStatus: {
    padding: '0.5rem',
    backgroundColor: '#FFB347',
    color: '#2C3E50',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontWeight: 'bold',
  },
  stateIndicator: {
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
  actionNeeded: {
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  waitingForOpponent: {
    backgroundColor: '#4ECDC4',
    color: '#2C3E50',
  },
  readyToReveal: {
    backgroundColor: '#45B7D1',
    color: 'white',
  },
  gameCompleted: {
    backgroundColor: '#96CEB4',
    color: '#2C3E50',
  },
  revealStatus: {
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    backgroundColor: '#064663',
    color: '#ECB365',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#ECB365',
  },
  error: {
    color: '#ECB365',
    textAlign: 'center' as const,
    padding: '1rem',
  },
  refreshButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#064663',
    color: '#ECB365',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const getStatusStyle = (status: GameStatus) => {
  switch (status) {
    case GameStatus.Created:
      return { ...styles.gameStatus, backgroundColor: '#04293A', color: '#ECB365' };
    case GameStatus.Player1Committed:
      return { ...styles.gameStatus, backgroundColor: '#064663', color: '#ECB365' };
    case GameStatus.Player2Committed:
      return { ...styles.gameStatus, backgroundColor: '#0B8FFF', color: '#FFFFFF' };
    case GameStatus.Completed:
      return { ...styles.gameStatus, backgroundColor: '#28A745', color: '#FFFFFF' };
    case GameStatus.Draw:
      return { ...styles.gameStatus, backgroundColor: '#FFB347', color: '#2C3E50' };
    default:
      return { ...styles.gameStatus, backgroundColor: '#041C32', color: '#ECB365' };
  }
};

const AllGamesPage = () => {
  const [games, setGames] = useState<{ id: number; game: Game }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const userAddress = await connectWallet();
      setCurrentUser(userAddress.toLowerCase());
      
      await initContract();
      const count = await getGameCount();
      const gamePromises = Array.from({ length: count }, (_, i) => i + 1).map(async (id) => {
        try {
          const game = await getGame(id);
          return { id, game };
        } catch (error) {
          console.error(`Error fetching game ${id}:`, error);
          return null;
        }
      });
      const allGames = await Promise.all(gamePromises);
      // Filter out null games (failed fetches)
      setGames(allGames.filter(game => game !== null) as { id: number; game: Game }[]);
    } catch (err: any) {
      setError(err.message || 'Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  const getUserRole = (game: Game) => {
    if (!currentUser) return null;
    if (game.player1.toLowerCase() === currentUser) return 'player1';
    if (game.player2.toLowerCase() === currentUser) return 'player2';
    return 'spectator';
  };

  const getGameStateForUser = (game: Game, userRole: string | null) => {
    if (!userRole || userRole === 'spectator') {
      return {
        message: '👀 You are viewing this game as a spectator',
        style: styles.waitingForOpponent
      };
    }

    switch (game.status) {
      case GameStatus.Created:
        return {
          message: '🎯 Game created - waiting for players to commit moves',
          style: styles.waitingForOpponent
        };

      case GameStatus.Player1Committed:
        if (userRole === 'player1') {
          return {
            message: '⏳ You have committed your move. Waiting for Player 2 to join...',
            style: styles.waitingForOpponent
          };
        } else {
          return {
            message: '🎮 You can join this game! Player 1 is waiting for you.',
            style: styles.actionNeeded
          };
        }

      case GameStatus.Player2Committed:
        return {
          message: '🔍 Both players committed! Time to reveal moves.',
          style: styles.readyToReveal
        };

      case GameStatus.Draw:
        if (userRole === 'player1') {
          return {
            message: '🎯 Draw! You can start a new round.',
            style: styles.actionNeeded
          };
        } else {
          return {
            message: '🎯 Draw! Waiting for Player 1 to start a new round.',
            style: styles.waitingForOpponent
          };
        }

      case GameStatus.Completed:
        const isWinner = game.winner.toLowerCase() === (userRole === 'player1' ? game.player1.toLowerCase() : game.player2.toLowerCase());
        return {
          message: isWinner ? '🏆 You won this game!' : '😔 You lost this game.',
          style: styles.gameCompleted
        };

      default:
        return {
          message: '❓ Unknown game state',
          style: styles.waitingForOpponent
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
      return '🔍 Player 1 revealed - waiting for Player 2';
    } else if (player2Revealed) {
      return '🔍 Player 2 revealed - waiting for Player 1';
    } else {
      return '⏳ Waiting for both players to reveal moves';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading games...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>All Games</h1>
        <button onClick={fetchAllGames} style={styles.refreshButton}>
          🔄 Refresh Games
        </button>
      </div>
      
      {currentUser && (
        <div style={styles.revealStatus}>
          <p>📱 Connected as: {currentUser.slice(0, 8)}...{currentUser.slice(-6)}</p>
        </div>
      )}

      <div className="games-list">
        {games.map(({ id, game }) => {
          const userRole = getUserRole(game);
          const gameState = getGameStateForUser(game, userRole);
          const revealStatus = getRevealStatus(game);

          return (
            <div key={id} style={styles.gameCard}>
              <div style={styles.gameHeader}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.gameId}>Game #{id}</span>
                  <span style={styles.roundInfo}>Round {game.roundNumber}</span>
                </div>
                <span style={styles.gameHost}>Host: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span></span>
              </div>
              
              <div style={styles.gameHeader}>
                <span style={styles.gameId}>Status: {game.status}</span>
                <span style={getStatusStyle(game.status)}>
                  {getGameStatusString(game.status)}
                </span>
              </div>
              
              <div style={styles.playerInfo}>
                <p>Player 1: <span style={styles.address}>{game.player1}</span> 
                  {userRole === 'player1' && ' (You)'}
                </p>
                <p>Player 2: <span style={styles.address}>{game.player2}</span>
                  {userRole === 'player2' && ' (You)'}
                </p>
              </div>

              {/* User-specific game state */}
              <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                {gameState.message}
              </div>

              {/* Reveal status */}
              {revealStatus && (
                <div style={styles.revealStatus}>
                  {revealStatus}
                </div>
              )}
              
              {/* Draw status notification */}
              {game.status === GameStatus.Draw && (
                <div style={styles.drawStatus}>
                  🎯 Game ended in a draw! {userRole === 'player1' ? 'You can start a new round.' : 'Waiting for Player 1 to start new round.'}
                </div>
              )}
              
              {/* Show moves if both are revealed */}
              {game.move1 !== Move.None && game.move2 !== Move.None && (
                <div style={styles.moves}>
                  <div style={styles.move}>
                    Player 1: {getMoveString(game.move1)} 🗿📄✂️
                  </div>
                  <div style={styles.move}>
                    Player 2: {getMoveString(game.move2)} 🗿📄✂️
                  </div>
                </div>
              )}
              
              {/* Show winner if game is completed */}
              {game.status === GameStatus.Completed && game.winner !== '0x0000000000000000000000000000000000000000' && (
                <div style={styles.winner}>
                  <p>🏆 Winner: {getWinnerString(game.winner, game.player1, game.player2)}</p>
                  <p style={styles.address}>{game.winner}</p>
                </div>
              )}
              
              {/* Show round information for multi-round games */}
              {game.roundNumber > 1 && (
                <div style={{ ...styles.playerInfo, backgroundColor: '#064663' }}>
                  <p>📊 This is round {game.roundNumber} of this game</p>
                  {game.status === GameStatus.Draw && (
                    <p>Previous rounds ended in draws</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllGamesPage; 