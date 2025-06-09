import { useState, useEffect } from 'react';
import {
  connectWallet,
  revealMove,
  startNewRound,
  getPlayerGames,
  getGame,
  Move,
  Game,
  GameStatus,
  initContract,
  getGameStatusString,
  getMoveString,
  hashMove
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
    margin: '5px',
  },
  buttonSecondary: {
    backgroundColor: '#45B7D1',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    color: '#ccc',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    margin: '5px',
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
  drawResult: {
    backgroundColor: '#FFB347',
    color: '#2C3E50',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '0.5rem',
    textAlign: 'center' as const,
    fontWeight: 'bold',
  },
  newRoundSection: {
    backgroundColor: '#04293A',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
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
  winner: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#28A745',
    borderRadius: '4px',
    color: 'white',
    textAlign: 'center' as const,
  },
  stateIndicator: {
    padding: '0.5rem',
    borderRadius: '4px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
  readyToReveal: {
    backgroundColor: '#28A745',
    color: 'white',
  },
  waitingForOpponent: {
    backgroundColor: '#45B7D1',
    color: 'white',
  },
  canStartNewRound: {
    backgroundColor: '#FFB347',
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
  userStatus: {
    backgroundColor: '#064663',
    color: '#ECB365',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  section: {
    marginBottom: '2rem',
  }
};

// Helper component to verify hash before revealing
const HashVerificationHelper = ({ game, userRole }: { game: Game; userRole: string | null }) => {
  const [testMove, setTestMove] = useState<Move>(Move.Rock);
  const [testSalt, setTestSalt] = useState('');
  const [verificationResult, setVerificationResult] = useState<string>('');

  const verifyHash = () => {
    if (!testSalt) {
      setVerificationResult('Please enter a salt to verify');
      return;
    }

    const calculatedHash = hashMove(testMove, testSalt);
    const userCommit = userRole === 'player1' ? game.commit1 : game.commit2;

    if (calculatedHash === userCommit) {
      setVerificationResult('✅ Hash matches! This is the correct move and salt.');
    } else {
      setVerificationResult('❌ Hash does not match. Try a different move or salt.');
    }
  };

  if (!userRole || userRole === 'spectator') return null;

  return (
    <div style={{
      backgroundColor: '#04293A',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      border: '1px solid #064663',
    }}>
      <h4 style={{ color: '#ECB365', marginBottom: '0.5rem' }}>🔍 Hash Verification Helper</h4>
      <p style={{ color: '#ECB365', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Verify your move and salt before revealing to avoid "Invalid reveal" errors
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <select
          style={styles.select}
          value={testMove}
          onChange={(e) => setTestMove(Number(e.target.value) as Move)}
        >
          <option value={Move.Rock}>🗿 Rock</option>
          <option value={Move.Paper}>📄 Paper</option>
          <option value={Move.Scissors}>✂️ Scissors</option>
        </select>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your original salt"
          value={testSalt}
          onChange={(e) => setTestSalt(e.target.value)}
        />
        <button
          style={styles.buttonSecondary}
          onClick={verifyHash}
        >
          🔍 Verify Hash
        </button>
      </div>

      {verificationResult && (
        <div style={{
          padding: '0.5rem',
          backgroundColor: verificationResult.includes('✅') ? '#28A745' : '#DC3545',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {verificationResult}
        </div>
      )}

      <div style={{ fontSize: '0.8rem', color: '#ECB365', marginTop: '0.5rem' }}>
        💡 Your committed hash: {userRole === 'player1' ? game.commit1.slice(0, 10) : game.commit2.slice(0, 10)}...
      </div>
    </div>
  );
};

// Enhanced RevealGameCard with better error handling
const RevealGameCard = ({ id, game, userRole, gameState, revealStatus, onRevealMove }: {
  id: number;
  game: Game;
  userRole: string | null;
  gameState: any;
  revealStatus: string | null;
  onRevealMove: (gameId: number, move: Move, salt: string) => void;
}) => {
  const [localMove, setLocalMove] = useState<Move>(Move.Rock);
  const [localSalt, setLocalSalt] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  const handleRevealWithValidation = () => {
    if (!localSalt) {
      alert('Please enter the salt you used when committing your move');
      return;
    }

    // Verify hash before revealing
    const calculatedHash = hashMove(localMove, localSalt);
    const userCommit = userRole === 'player1' ? game.commit1 : game.commit2;

    if (calculatedHash !== userCommit) {
      const proceed = window.confirm(
        'Warning: The hash of your selected move and salt does not match your committed hash. ' +
        'This will result in an "Invalid reveal" error. Do you want to continue anyway?'
      );
      if (!proceed) return;
    }

    onRevealMove(id, localMove, localSalt);
  };

  return (
    <div style={styles.gameCard}>
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
        <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span>
          {userRole === 'player1' && ' (You)'}
        </p>
        <p>Player 2: <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span>
          {userRole === 'player2' && ' (You)'}
        </p>
      </div>

      {gameState && (
        <div style={{ ...styles.stateIndicator, ...gameState.style }}>
          {gameState.message}
        </div>
      )}

      {revealStatus && (
        <div style={styles.revealStatus}>
          {revealStatus}
        </div>
      )}

      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        <select
          style={styles.select}
          value={localMove}
          onChange={(e) => setLocalMove(Number(e.target.value) as Move)}
        >
          <option value={Move.Rock}>🗿 Rock</option>
          <option value={Move.Paper}>📄 Paper</option>
          <option value={Move.Scissors}>✂️ Scissors</option>
        </select>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your salt"
          value={localSalt}
          onChange={(e) => setLocalSalt(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleRevealWithValidation}
        >
          🔍 Reveal Move
        </button>
        <button
          style={styles.buttonSecondary}
          onClick={() => setShowHelper(!showHelper)}
        >
          {showHelper ? '🔼 Hide Helper' : '🔽 Show Helper'}
        </button>
      </div>

      {showHelper && <HashVerificationHelper game={game} userRole={userRole} />}

      <div style={{
        fontSize: '0.8rem',
        color: '#FFB347',
        marginTop: '0.5rem',
        padding: '0.5rem',
        backgroundColor: '#041C32',
        borderRadius: '4px'
      }}>
        ⚠️ <strong>Important:</strong> Use the exact same move and salt you entered when you first joined this game.
        If you get "Invalid reveal" error, try the Hash Verification Helper above.
      </div>
    </div>
  );
};

// Separate component for draw game cards
const DrawGameCard = ({ id, game, userRole, gameState, onStartNewRound }: {
  id: number;
  game: Game;
  userRole: string | null;
  gameState: any;
  onStartNewRound: (gameId: number, move: Move, salt: string) => void;
}) => {
  const [newRoundMove, setNewRoundMove] = useState<Move>(Move.Rock);
  const [newRoundSalt, setNewRoundSalt] = useState('');

  return (
    <div style={styles.gameCard}>
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
        <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span>
          {userRole === 'player1' && ' (You)'}
        </p>
        <p>Player 2: <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span>
          {userRole === 'player2' && ' (You)'}
        </p>
      </div>

      {gameState && (
        <div style={{ ...styles.stateIndicator, ...gameState.style }}>
          {gameState.message}
        </div>
      )}

      <div style={styles.drawResult}>
        🎯 Previous round: {getMoveString(game.move1)} vs {getMoveString(game.move2)} = DRAW!
      </div>

      {gameState?.canStartNewRound && (
        <div style={styles.newRoundSection}>
          <h4>🚀 Start Round {game.roundNumber + 1}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <select
              style={styles.select}
              value={newRoundMove}
              onChange={(e) => setNewRoundMove(Number(e.target.value) as Move)}
            >
              <option value={Move.Rock}>🗿 Rock</option>
              <option value={Move.Paper}>📄 Paper</option>
              <option value={Move.Scissors}>✂️ Scissors</option>
            </select>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter salt for new round"
              value={newRoundSalt}
              onChange={(e) => setNewRoundSalt(e.target.value)}
            />
            <button
              style={styles.buttonSecondary}
              onClick={() => onStartNewRound(id, newRoundMove, newRoundSalt)}
            >
              🚀 Start New Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RevealMovePage = () => {
  const [gameId, setGameId] = useState('');
  const [move, setMove] = useState<Move>(Move.Rock);
  const [salt, setSalt] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userGames, setUserGames] = useState<{ id: number; game: Game }[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const address = await connectWallet();
        if (address) {
          setWalletAddress(address);
          await initContract();
          await fetchUserGames(address);
        }
      } catch (error: any) {
        setStatus('Error initializing: ' + error.message);
      }
    };
    init();
  }, []);

  const fetchUserGames = async (address: string) => {
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

      const validGames = games.filter(game => game !== null) as { id: number; game: Game }[];
      const userParticipatedGames = validGames.filter(
        ({ game }) =>
          game.player1.toLowerCase() === address.toLowerCase() ||
          game.player2.toLowerCase() === address.toLowerCase()
      );

      setUserGames(userParticipatedGames);
    } catch (error: any) {
      setStatus('Error fetching games: ' + error.message);
    }
  };

  const handleRevealMove = async (gameIdToUse: number, moveToReveal: Move, saltToReveal: string) => {
    if (!moveToReveal || !saltToReveal) {
      alert('Please select a move and enter the salt you used when committing');
      return;
    }
    setLoading(true);
    try {
      await revealMove(gameIdToUse, moveToReveal, saltToReveal);
      setStatus('✅ Move revealed successfully!');
      // Refresh user games
      if (walletAddress) {
        await fetchUserGames(walletAddress);
      }
    } catch (error: any) {
      console.error('Reveal error:', error);

      let errorMessage = 'Error revealing move: ';

      if (error.message.includes('Invalid reveal')) {
        errorMessage += `
❌ Invalid reveal - The move and salt combination doesn't match your original commitment.

🔍 Troubleshooting steps:
1. Make sure you're using the EXACT same move you chose when you first joined this game
2. Make sure you're using the EXACT same salt (case-sensitive)
3. Use the Hash Verification Helper to test different combinations
4. Remember: Rock=1, Paper=2, Scissors=3

💡 Common mistakes:
- Using a different move than originally committed
- Typing the salt incorrectly (check for typos, spaces, case)
- Confusing which game you're trying to reveal for

🎯 What to do:
- Try the Hash Verification Helper to find the correct combination
- If you can't remember your original move/salt, you may need to wait for the other player to reveal first
        `;
      } else if (error.message.includes('not ready for reveal')) {
        errorMessage += 'Game is not ready for revealing yet. Both players must commit their moves first.';
      } else if (error.message.includes('already revealed')) {
        errorMessage += 'You have already revealed your move for this round.';
      } else {
        errorMessage += error.message;
      }

      setStatus(errorMessage);
    }
    setLoading(false);
  };

  const handleRevealMoveById = async () => {
    if (!gameId) {
      alert('Please enter a game ID');
      return;
    }
    const gameIdNum = parseInt(gameId);
    if (isNaN(gameIdNum)) {
      alert('Please enter a valid game ID');
      return;
    }
    await handleRevealMove(gameIdNum, move, salt);
  };

  const handleStartNewRound = async (gameIdToUse: number, playerMove: Move, playerSalt: string) => {
    if (!playerMove || !playerSalt) {
      alert('Please select a move and enter a salt for the new round');
      return;
    }
    setLoading(true);
    try {
      await startNewRound(gameIdToUse, playerMove, playerSalt);
      setStatus('New round started successfully!');
      // Refresh user games
      if (walletAddress) {
        await fetchUserGames(walletAddress);
      }
    } catch (error: any) {
      setStatus('Error starting new round: ' + error.message);
    }
    setLoading(false);
  };

  const getUserRole = (game: Game) => {
    if (!walletAddress) return null;
    if (game.player1.toLowerCase() === walletAddress.toLowerCase()) return 'player1';
    if (game.player2.toLowerCase() === walletAddress.toLowerCase()) return 'player2';
    return null;
  };

  const getGameStateForUser = (game: Game, userRole: string | null) => {
    if (!userRole) return null;

    switch (game.status) {
      case GameStatus.Player2Committed:
        const player1Revealed = game.move1 !== Move.None;
        const player2Revealed = game.move2 !== Move.None;
        const userRevealed = (userRole === 'player1' && player1Revealed) || (userRole === 'player2' && player2Revealed);

        if (userRevealed) {
          return {
            message: '⏳ You revealed your move. Waiting for opponent to reveal...',
            style: styles.waitingForOpponent,
            canReveal: false
          };
        } else {
          return {
            message: '🔍 Time to reveal your move! Enter your original move and salt.',
            style: styles.readyToReveal,
            canReveal: true
          };
        }

      case GameStatus.Draw:
        if (userRole === 'player1') {
          return {
            message: '🎯 Draw! You can start a new round with your move.',
            style: styles.canStartNewRound,
            canReveal: false,
            canStartNewRound: true
          };
        } else {
          return {
            message: '🎯 Draw! Waiting for Player 1 to start a new round.',
            style: styles.waitingForOpponent,
            canReveal: false
          };
        }

      case GameStatus.Completed:
        const isWinner = game.winner.toLowerCase() === (userRole === 'player1' ? game.player1.toLowerCase() : game.player2.toLowerCase());
        return {
          message: isWinner ? '🏆 You won this game!' : '😔 You lost this game.',
          style: styles.waitingForOpponent,
          canReveal: false
        };

      default:
        return {
          message: '⏳ Game not ready for revealing yet.',
          style: styles.waitingForOpponent,
          canReveal: false
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
      return '⏳ Both players need to reveal moves';
    }
  };

  // Categorize games
  const needRevealGames = userGames.filter(({ game }) => {
    const userRole = getUserRole(game);
    const gameState = getGameStateForUser(game, userRole);
    return gameState?.canReveal;
  });

  const waitingForOpponent = userGames.filter(({ game }) => {
    const userRole = getUserRole(game);
    const gameState = getGameStateForUser(game, userRole);
    return game.status === GameStatus.Player2Committed && !gameState?.canReveal;
  });

  const drawGames = userGames.filter(({ game }) => game.status === GameStatus.Draw);
  const completedGames = userGames.filter(({ game }) => game.status === GameStatus.Completed);

  return (
    <div className="page-container">
      <h2>🔍 Reveal & Manage Games</h2>

      {walletAddress && (
        <div style={styles.userStatus}>
          <p>📱 Connected as: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</p>
          <p>💡 Reveal your moves and manage multi-round games</p>
        </div>
      )}

      <div className="instructions">
        <p>1. Find games ready for revealing below</p>
        <p>2. Enter your original move and salt to reveal</p>
        <p>3. For draw games, start new rounds as Player 1</p>
        <p>4. Monitor reveal status and opponent actions</p>
      </div>

      <div style={styles.section}>
        <h3>🔍 Reveal by Game ID</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
      <input
            style={styles.input}
        type="text"
        placeholder="Enter game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
          <select
            style={styles.select}
            value={move}
            onChange={(e) => setMove(Number(e.target.value) as Move)}
          >
            <option value={Move.Rock}>🗿 Rock</option>
            <option value={Move.Paper}>📄 Paper</option>
            <option value={Move.Scissors}>✂️ Scissors</option>
          </select>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
          <button style={styles.button} onClick={handleRevealMoveById}>
            Reveal Move
          </button>
        </div>
      </div>

      {/* Games that need revealing */}
      {needRevealGames.length > 0 && (
        <div style={styles.section}>
          <h3>🎯 Ready to Reveal ({needRevealGames.length})</h3>
          <div className="games-list">
            {needRevealGames.map(({ id, game }) => {
              const userRole = getUserRole(game);
              const gameState = getGameStateForUser(game, userRole);
              const revealStatus = getRevealStatus(game);

              return (
                <RevealGameCard
                  key={id}
                  id={id}
                  game={game}
                  userRole={userRole}
                  gameState={gameState}
                  revealStatus={revealStatus}
                  onRevealMove={handleRevealMove}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Games waiting for opponent to reveal */}
      {waitingForOpponent.length > 0 && (
        <div style={styles.section}>
          <h3>⏳ Waiting for Opponent ({waitingForOpponent.length})</h3>
          <div className="games-list">
            {waitingForOpponent.map(({ id, game }) => {
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
                    <span style={styles.gameStatus}>
                      {getGameStatusString(game.status)}
                    </span>
                  </div>

                  <div style={styles.playerInfo}>
                    <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span>
                      {userRole === 'player1' && ' (You)'}
                    </p>
                    <p>Player 2: <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span>
                      {userRole === 'player2' && ' (You)'}
                    </p>
                  </div>

                  {gameState && (
                    <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                      {gameState.message}
                    </div>
                  )}

                  {revealStatus && (
                    <div style={styles.revealStatus}>
                      {revealStatus}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Draw games that can start new rounds */}
      {drawGames.length > 0 && (
        <div style={styles.section}>
          <h3>🎯 Draw Games - Start New Round ({drawGames.length})</h3>
          <div className="games-list">
            {drawGames.map(({ id, game }) => {
              const userRole = getUserRole(game);
              const gameState = getGameStateForUser(game, userRole);

              return (
                <DrawGameCard
                  key={id}
                  id={id}
                  game={game}
                  userRole={userRole}
                  gameState={gameState}
                  onStartNewRound={handleStartNewRound}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Completed games */}
      {completedGames.length > 0 && (
        <div style={styles.section}>
          <h3>✅ Completed Games ({completedGames.length})</h3>
          <div className="games-list">
            {completedGames.map(({ id, game }) => {
              const userRole = getUserRole(game);
              const gameState = getGameStateForUser(game, userRole);

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
                    <p>Player 1: <span style={styles.address}>{game.player1.slice(0, 8)}...{game.player1.slice(-6)}</span>
                      {userRole === 'player1' && ' (You)'}
                    </p>
                    <p>Player 2: <span style={styles.address}>{game.player2.slice(0, 8)}...{game.player2.slice(-6)}</span>
                      {userRole === 'player2' && ' (You)'}
                    </p>
                  </div>

                  {gameState && (
                    <div style={{ ...styles.stateIndicator, ...gameState.style }}>
                      {gameState.message}
                    </div>
                  )}

                  <div style={styles.moves}>
                    <div style={styles.move}>
                      Player 1: {getMoveString(game.move1)} 🗿📄✂️
                    </div>
                    <div style={styles.move}>
                      Player 2: {getMoveString(game.move2)} 🗿📄✂️
                    </div>
                  </div>

                  {game.winner !== '0x0000000000000000000000000000000000000000' && (
                    <div style={styles.winner}>
                      🏆 Winner: {game.winner.toLowerCase() === game.player1.toLowerCase() ? 'Player 1' : 'Player 2'}
              </div>
            )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userGames.length === 0 && (
        <div style={styles.gameCard}>
          <p>No games found where you are a participant</p>
          <p style={{ fontSize: '0.9rem', color: '#ECB365' }}>
            Create a game or join one to see it here
          </p>
        </div>
      )}

      {status && (
        <div style={{
          marginTop: '20px',
          color: '#ECB365',
          backgroundColor: status.includes('❌') ? '#8B0000' : status.includes('✅') ? '#28A745' : '#064663',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #064663',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace',
          lineHeight: '1.4'
        }}>
          {status}
        </div>
      )}
      {loading && (
        <p className="loading-message" style={{ color: '#ECB365' }}>
          Processing...
        </p>
      )}
    </div>
  );
};

export default RevealMovePage; 