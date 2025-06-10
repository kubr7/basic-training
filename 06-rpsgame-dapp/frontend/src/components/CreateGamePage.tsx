import { useState, useEffect, useRef } from 'react';
import { connectWallet, createGame, Move, initContract, getMoveString } from '../utils/interact';

const styles = {
  formSection: {
    width: '80%',
    margin: 'auto',
    backgroundColor: '#04293A',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  label: {
    color: '#ECB365',
    marginBottom: '5px',
    display: 'block',
    textAlign: 'left' as const,
  },
  input: {
    maxWidth: '100%',
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
    width: 'auto',
    backgroundColor: '#28A745',
    color: 'white',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    width: '25%',
    backgroundColor: '#666',
    color: '#ccc',
    padding: '8px 20px',
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
    borderRadius: '0',
  },
  instructionList: {
    width: '50%',
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    border: '1px solid #064663',
  },
  instructionItem: {
    marginBottom: '8px',
    color: '#ECB365',
    fontSize: '0.8rem',
    textAlign: 'left' as const,
  },
  selectedMovePreview: {
    width: '50%',
    margin: 'auto',
    backgroundColor: '#064663',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '15px',
    color: '#ECB365',
    textAlign: 'center' as const,
  },
  accordionHeader: {
    backgroundColor: '#064663',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    transition: 'background-color 0.3s',
    color: '#ECB365',
    '&:hover': {
      backgroundColor: '#04293A',
    },
  },
  accordionContent: {
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-out',
  },
};

const CreateGamePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [opponent, setOpponent] = useState('');
  const [salt, setSalt] = useState('');
  const [selectedMove, setSelectedMove] = useState<Move | ''>('');
  const [createdGameId, setCreatedGameId] = useState<number | null>(null);
  const [showGameFlow, setShowGameFlow] = useState(false);
  const [showCreateSteps, setShowCreateSteps] = useState(false);
  const gameFlowRef = useRef<HTMLDivElement>(null);
  const createStepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const address = await connectWallet();
        if (address) {
          setWalletAddress(address);
          setIsConnected(true);
          await initContract();
        }
      } catch (error: any) {
        console.error('Error initializing:', error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameFlowRef.current && !gameFlowRef.current.contains(event.target as Node)) {
        setShowGameFlow(false);
      }
      if (createStepsRef.current && !createStepsRef.current.contains(event.target as Node)) {
        setShowCreateSteps(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateGame = async () => {
    if (!isConnected) {
      console.error('Wallet not connected');
      return;
    }
    if (!opponent) {
      console.error('Opponent address not provided');
      return;
    }
    if (!salt) {
      console.error('Salt not provided');
      return;
    }
    if (!selectedMove) {
      console.error('Move not selected');
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(opponent)) {
      console.error('Invalid Ethereum address');
      return;
    }

    try {
      const newGameId = await createGame(opponent, selectedMove, salt);
      setCreatedGameId(newGameId);
      console.log(`🎉 Game created successfully! Game ID: ${newGameId}`);

      // Reset form
      setOpponent('');
      setSalt('');
      setSelectedMove('');
    } catch (error: any) {
      console.error('❌ Error creating game:', error.message);
    }
  };

  const isFormValid = () => {
    return isConnected && opponent && salt && selectedMove;
  };

  return (
    <div className="page-container">
      {!isConnected ? (
        <div style={styles.errorMessage}>
          <p>Please connect your wallet first</p>
          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Make sure you're connected to Sepolia Testnet
          </p>
        </div>
      ) : (
        <div>
          <div style={styles.statusMessage}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>📱 Wallet connected successfully! You are Player 1.</p>
              <p>👤 Wallet address: {walletAddress}</p>
            </div>
            <p>🎯 Creating a secure, hashed-move Rock-Paper-Scissors game</p>
            <p>🔐 Your move will be encrypted until both players reveal</p>
          </div>

          <div style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '1rem' }}>
            {/* Game Flow Information Accordion */}
            <div ref={gameFlowRef} style={{ flex: 1 }}>
              <div
                style={styles.accordionHeader}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGameFlow(!showGameFlow);
                  setShowCreateSteps(false);
                }}
              >
                <h3 style={{ margin: 0 }}>🎯 Game Flow & State Transitions</h3>
                <span>{showGameFlow ? '▼' : '▶'}</span>
              </div>
              <div style={{
                ...styles.accordionContent,
                maxHeight: showGameFlow ? '500px' : '0',
                padding: showGameFlow ? '1rem' : '0',
                border: showGameFlow ? '1px solid #064663' : 'none',
              }}>
                <div style={styles.instructionList}>
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
              </div>
            </div>

            {/* How to Create Game Accordion */}
            <div ref={createStepsRef} style={{ flex: 1 }}>
              <div
                style={styles.accordionHeader}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreateSteps(!showCreateSteps);
                  setShowGameFlow(false);
                }}
              >
                <h3 style={{ margin: 0 }}>📝 How to Create a Game</h3>
                <span>{showCreateSteps ? '▼' : '▶'}</span>
              </div>
              <div style={{
                ...styles.accordionContent,
                maxHeight: showCreateSteps ? '500px' : '0',
                padding: showCreateSteps ? '1rem' : '0',
                border: showCreateSteps ? '1px solid #064663' : 'none',
              }}>
                <div style={styles.instructionList}>
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
              </div>
            </div>
          </div>

          <div style={styles.formSection}>
            <h2 style={{ textAlign: 'center' }}> Create New Game</h2>

            <div style={{ width: '50%', margin: 'auto' }}>
              <label style={styles.label}>
                Opponent's Wallet Address:
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="0x..."
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ width: '50%' }}>
                <label style={styles.label}>
                  Your Move:
                </label>
                <select
                  style={styles.select}
                  value={selectedMove}
                  onChange={(e) => setSelectedMove(Number(e.target.value) as Move)}
                >
                  <option value="">Select your secret move</option>
                  <option value={Move.Rock}>🗿 Rock (beats Scissors)</option>
                  <option value={Move.Paper}>📄 Paper (beats Rock)</option>
                  <option value={Move.Scissors}>✂️ Scissors (beats Paper)</option>
                </select>

                {selectedMove && (
                  <div style={styles.selectedMovePreview}>
                    <strong>Your chosen move: {getMoveString(Number(selectedMove) as Move)}</strong>
                    {Number(selectedMove) === Move.Rock && " 🗿"}
                    {Number(selectedMove) === Move.Paper && " 📄"}
                    {Number(selectedMove) === Move.Scissors && " ✂️"}
                  </div>
                )}
              </div>

              <div style={{ width: '50%' }}>
                <label style={styles.label}>
                  Salt (Secret Phrase):
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter a secret phrase you'll remember"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FFB347', marginBottom: '15px' }}>
              💡 Choose something you'll remember but others can't guess
            </div>

            <button
              style={isFormValid() ? styles.button : styles.buttonDisabled}
              onClick={handleCreateGame}
              disabled={!isFormValid()}
            >
              {createdGameId ? '🎉 Game Created Successfully!' : '🚀 Create Game'}
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
        </div>
      )}
    </div>
  );
};

export default CreateGamePage; 