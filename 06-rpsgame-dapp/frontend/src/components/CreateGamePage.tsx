import { useState, useEffect } from 'react';
import { connectWallet, createGame, Move, initContract, getMoveString } from '../utils/interact';

const styles = {
  formSection: {
    backgroundColor: '#04293A',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #064663',
    backgroundColor: '#041C32',
    color: '#ECB365',
    marginBottom: '15px',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #064663',
    backgroundColor: '#041C32',
    color: '#ECB365',
    marginBottom: '15px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    backgroundColor: '#28A745',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    width: '100%',
    backgroundColor: '#666',
    color: '#ccc',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '16px',
  },
  errorMessage: {
    backgroundColor: '#8B0000',
    color: '#FFB3B3',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  successMessage: {
    backgroundColor: '#28A745',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  statusMessage: {
    backgroundColor: '#064663',
    color: '#ECB365',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  instructionList: {
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    border: '1px solid #064663',
  },
  instructionItem: {
    marginBottom: '8px',
    color: '#ECB365',
  },
  selectedMovePreview: {
    backgroundColor: '#064663',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    color: '#ECB365',
    textAlign: 'center' as const,
  }
};

const CreateGamePage = () => {
  const [opponentAddress, setOpponentAddress] = useState('');
  const [moveSalt, setMoveSalt] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move | ''>('');
  const [createdGameId, setCreatedGameId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await connectWallet();
        await initContract();
        setIsConnected(true);
        setGameStatus('Wallet connected successfully! You can now create a game.');
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
      setGameStatus('Please enter opponent address');
      return;
    }
    if (!moveSalt) {
      setGameStatus('Please enter a salt for your move');
      return;
    }
    if (!selectedMove) {
      setGameStatus('Please select your move');
      return;
    }
    
    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(opponentAddress)) {
      setGameStatus('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    try {
      const newGameId = await createGame(opponentAddress, selectedMove, moveSalt);
      setCreatedGameId(newGameId);
      setGameStatus(`🎉 Game created successfully! Game ID: ${newGameId}`);
      
      // Reset form
      setOpponentAddress('');
      setMoveSalt('');
      setSelectedMove('');
    } catch (error: any) {
      setGameStatus('❌ Error creating game: ' + error.message);
    }
    setLoading(false);
  };

  const isFormValid = () => {
    return isConnected && opponentAddress && moveSalt && selectedMove && !loading;
  };

  return (
    <div className="page-container">
      <h2>🎮 Create New Rock Paper Scissors Game</h2>
      
      {!isConnected ? (
        <div style={styles.errorMessage}>
          <p>Please connect your wallet first</p>
          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Make sure you're connected to Sepolia Testnet
          </p>
        </div>
      ) : (
        <>
          {/* User Status Information */}
          <div style={styles.statusMessage}>
            <p>📱 Wallet connected successfully! You are Player 1.</p>
            <p>🎯 Creating a secure, hashed-move Rock-Paper-Scissors game</p>
            <p>🔐 Your move will be encrypted until both players reveal</p>
          </div>

          {/* Game Flow Information */}
          <div style={styles.instructionList}>
            <h3>🎯 Game Flow & State Transitions:</h3>
            <div style={styles.instructionItem}>
              🔸 <strong>State 1 - Created:</strong> You commit your move (hashed with salt)
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>State 2 - Player1Committed:</strong> Waiting for Player 2 to join
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>State 3 - Player2Committed:</strong> Both players ready to reveal
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>State 4 - Revealing:</strong> Players reveal moves simultaneously
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>State 5 - Completed/Draw:</strong> Results shown, new round possible
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', fontStyle: 'italic', color: '#FFB347' }}>
              💡 If game ends in draw, you can start new rounds automatically as Player 1
            </div>
          </div>

          <div style={styles.instructionList}>
            <h3>How to create a game:</h3>
            <div style={styles.instructionItem}>
              🔸 <strong>Step 1:</strong> Enter your opponent's wallet address
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>Step 2:</strong> Choose your move (Rock/Paper/Scissors)
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>Step 3:</strong> Enter a salt (secret phrase) - <em>remember this!</em>
            </div>
            <div style={styles.instructionItem}>
              🔸 <strong>Step 4:</strong> Create the game and share Game ID with opponent
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', fontStyle: 'italic', color: '#FFB347' }}>
              ⚠️ Your move is hidden until both players reveal. The salt ensures security!
            </div>
          </div>

          <div style={styles.formSection}>
            <h3>Game Setup</h3>
            
            <label style={{ color: '#ECB365', marginBottom: '5px', display: 'block' }}>
              Opponent's Wallet Address:
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder="0x..."
              value={opponentAddress}
              onChange={(e) => setOpponentAddress(e.target.value)}
            />

            <label style={{ color: '#ECB365', marginBottom: '5px', display: 'block' }}>
              Your Move:
            </label>
            <select 
              style={styles.select}
              value={selectedMove} 
              onChange={(e) => setSelectedMove(e.target.value as unknown as Move)}
            >
              <option value="">Select your secret move</option>
              <option value={Move.Rock}>🗿 Rock (beats Scissors)</option>
              <option value={Move.Paper}>📄 Paper (beats Rock)</option>
              <option value={Move.Scissors}>✂️ Scissors (beats Paper)</option>
            </select>

            {selectedMove && (
              <div style={styles.selectedMovePreview}>
                <strong>Your chosen move: {getMoveString(selectedMove as Move)}</strong>
                {selectedMove === Move.Rock && " 🗿"}
                {selectedMove === Move.Paper && " 📄"}
                {selectedMove === Move.Scissors && " ✂️"}
              </div>
            )}

            <label style={{ color: '#ECB365', marginBottom: '5px', display: 'block' }}>
              Salt (Secret Phrase):
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter a secret phrase you'll remember"
              value={moveSalt}
              onChange={(e) => setMoveSalt(e.target.value)}
            />
            <div style={{ fontSize: '0.8rem', color: '#FFB347', marginBottom: '15px' }}>
              💡 Choose something you'll remember but others can't guess
            </div>

            <button 
              style={isFormValid() ? styles.button : styles.buttonDisabled}
              onClick={handleCreateGame}
              disabled={!isFormValid()}
            >
              {loading ? '🔄 Creating Game...' : '🚀 Create Game'}
            </button>
          </div>

          {createdGameId && (
            <div style={styles.successMessage}>
              <h3>🎉 Game Created Successfully!</h3>
              <p><strong>Game ID:</strong> {createdGameId}</p>
              <p><strong>Next Steps:</strong></p>
              <ul style={{ marginTop: '10px' }}>
                <li>Share Game ID {createdGameId} with your opponent</li>
                <li>Your opponent needs to join using the "Join Game" page</li>
                <li>Once they join, both players can reveal moves</li>
                <li>If the game ends in a draw, you can start new rounds!</li>
              </ul>
            </div>
          )}
        </>
      )}
      
      {gameStatus && !createdGameId && (
        <div style={gameStatus.includes('❌') ? styles.errorMessage : 
                    gameStatus.includes('🎉') ? styles.successMessage : 
                    styles.statusMessage}>
          {gameStatus}
        </div>
      )}
    </div>
  );
};

export default CreateGamePage; 