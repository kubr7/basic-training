import { useState, useEffect } from 'react';
import { connectWallet, initContract } from '../utils/interact';

const styles = {
  hero: {
    textAlign: 'center' as const,
    padding: '3rem 2rem',
    backgroundColor: '#041C32',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#ECB365',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#ECB365',
    opacity: 0.9,
  },
  connectButton: {
    backgroundColor: '#28A745',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  connectedStatus: {
    backgroundColor: '#064663',
    color: '#ECB365',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  featureCard: {
    backgroundColor: '#04293A',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #064663',
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#ECB365',
    fontWeight: 'bold',
  },
  featureText: {
    color: '#ECB365',
    lineHeight: '1.6',
  },
  gameFlowSection: {
    backgroundColor: '#041C32',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  flowStep: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#04293A',
    borderRadius: '8px',
    border: '1px solid #064663',
  },
  stepNumber: {
    backgroundColor: '#064663',
    color: '#ECB365',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ECB365',
    marginBottom: '0.5rem',
  },
  stepDescription: {
    color: '#ECB365',
    opacity: 0.9,
    lineHeight: '1.5',
  },
  quickStartSection: {
    backgroundColor: '#04293A',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #064663',
  },
  navigationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  navCard: {
    backgroundColor: '#041C32',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #064663',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  navCardHover: {
    backgroundColor: '#064663',
  },
  navTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ECB365',
    marginBottom: '0.5rem',
  },
  navDescription: {
    color: '#ECB365',
    opacity: 0.8,
    fontSize: '0.9rem',
  },
  stateTransitionSection: {
    backgroundColor: '#04293A',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #064663',
  },
  stateBox: {
    backgroundColor: '#041C32',
    padding: '1rem',
    borderRadius: '6px',
    margin: '0.5rem 0',
    border: '1px solid #064663',
  },
  stateName: {
    fontWeight: 'bold',
    color: '#ECB365',
    marginBottom: '0.5rem',
  },
  stateDescription: {
    color: '#ECB365',
    opacity: 0.9,
    fontSize: '0.9rem',
  },
  arrow: {
    textAlign: 'center' as const,
    color: '#064663',
    fontSize: '1.5rem',
    margin: '0.5rem 0',
  }
};

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const address = await connectWallet();
        setWalletAddress(address);
        await initContract();
      } catch (error) {
        // Wallet not connected or user rejected
      }
    };
    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
        setWalletAddress(address);
      await initContract();
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
    }
    setIsConnecting(false);
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>🎮 Rock Paper Scissors DApp</h1>
        <p style={styles.subtitle}>
          Secure, Multi-Round, On-Chain Gaming with Commit-Reveal Security
        </p>
        
        {!walletAddress ? (
          <button 
            style={styles.connectButton}
            onClick={handleConnectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet to Start'}
          </button>
        ) : (
          <div style={styles.connectedStatus}>
            ✅ Connected: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
            <br />
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Ready to play! Choose an option below.
            </span>
          </div>
        )}
      </div>

      {/* Game State Flow Section */}
      <div style={styles.stateTransitionSection}>
        <h2 style={{ color: '#ECB365', marginBottom: '1.5rem', textAlign: 'center' }}>
          🎯 Game State Flow & Transitions
        </h2>
        
        <div style={styles.stateBox}>
          <div style={styles.stateName}>1️⃣ Created</div>
          <div style={styles.stateDescription}>
            Player 1 commits their hashed move. Game is waiting for Player 2 to join.
          </div>
        </div>
        
        <div style={styles.arrow}>⬇️</div>
        
        <div style={styles.stateBox}>
          <div style={styles.stateName}>2️⃣ Player1Committed</div>
          <div style={styles.stateDescription}>
            Player 1 has committed. Player 2 can now join and commit their move.
          </div>
        </div>
        
        <div style={styles.arrow}>⬇️</div>
        
        <div style={styles.stateBox}>
          <div style={styles.stateName}>3️⃣ Player2Committed</div>
          <div style={styles.stateDescription}>
            Both players have committed their moves. Time to reveal! Each player knows when their opponent has revealed.
          </div>
        </div>
        
        <div style={styles.arrow}>⬇️</div>
        
        <div style={styles.stateBox}>
          <div style={styles.stateName}>4️⃣ Completed / Draw</div>
          <div style={styles.stateDescription}>
            Game finished! If completed: winner is determined. If draw: Player 1 can start a new round automatically.
          </div>
        </div>
      </div>

      {/* How to Play Section */}
      <div style={styles.gameFlowSection}>
        <h2 style={{ color: '#ECB365', marginBottom: '1.5rem', textAlign: 'center' }}>
          🎯 How to Play - Complete User Flow
        </h2>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>1</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>🎮 Create Game (Player 1)</div>
            <div style={styles.stepDescription}>
              Choose your move, enter a salt, and specify Player 2's address. Your move is hashed for security.
              <br />
              <strong>State:</strong> Created → Player1Committed
            </div>
          </div>
        </div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>2</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>🤝 Join Game (Player 2)</div>
            <div style={styles.stepDescription}>
              Player 2 receives the Game ID, chooses their move and salt, then joins the game.
              <br />
              <strong>State:</strong> Player1Committed → Player2Committed
            </div>
          </div>
        </div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>3</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>🔍 Reveal Moves (Both Players)</div>
            <div style={styles.stepDescription}>
              Both players can see when their opponent has revealed. Each player reveals their original move + salt.
              The smart contract verifies the hash and determines the winner.
              <br />
              <strong>State:</strong> Player2Committed → Completed/Draw
            </div>
          </div>
        </div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>4</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>🔄 Multi-Round Support</div>
            <div style={styles.stepDescription}>
              If the game ends in a draw, Player 1 can immediately start a new round with a new move and salt.
              The game continues with incremented round numbers until there's a winner.
              <br />
              <strong>State:</strong> Draw → Player1Committed (new round)
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>🔐 Commit-Reveal Security</div>
          <div style={styles.featureText}>
            Your moves are hashed with a salt before committing to the blockchain. 
            This prevents opponents from seeing your move until both players are ready to reveal.
            <br /><br />
            <strong>Real-time visibility:</strong> See when your opponent has revealed their move!
          </div>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>🔄 Multi-Round Games</div>
          <div style={styles.featureText}>
            Games that end in a draw automatically support new rounds. 
            Player 1 can start new rounds instantly without creating a new game.
            <br /><br />
            <strong>State tracking:</strong> Clear indication of current round and game state.
          </div>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureTitle}>⛽ Gas Optimized</div>
          <div style={styles.featureText}>
            Smart contract uses struct packing and optimized state management. 
            Saves ~9,000 gas per game compared to basic implementations.
            <br /><br />
            <strong>Efficient:</strong> Lower transaction costs for all operations.
          </div>
        </div>
      </div>

      {/* Quick Start Navigation */}
      <div style={styles.quickStartSection}>
        <h2 style={{ color: '#ECB365', marginBottom: '1rem', textAlign: 'center' }}>
          🚀 Quick Start - Choose Your Action
        </h2>
        <p style={{ color: '#ECB365', textAlign: 'center', marginBottom: '1.5rem', opacity: 0.9 }}>
          Each page shows detailed game state information and guides you through the process
        </p>
        
        <div style={styles.navigationGrid}>
          <div style={styles.navCard}>
            <div style={styles.navTitle}>🎮 Create Game</div>
            <div style={styles.navDescription}>
              Start a new game as Player 1. You'll commit your move first and wait for an opponent.
              See state transitions and next steps clearly.
            </div>
          </div>
          
          <div style={styles.navCard}>
            <div style={styles.navTitle}>🤝 Join Game</div>
            <div style={styles.navDescription}>
              Join a game as Player 2 using a Game ID. View available games with current state and reveal status.
            </div>
          </div>
          
          <div style={styles.navCard}>
            <div style={styles.navTitle}>🔍 Reveal & Manage</div>
            <div style={styles.navDescription}>
              Reveal your moves and manage multi-round games. See when opponents have revealed and start new rounds.
            </div>
          </div>
          
          <div style={styles.navCard}>
            <div style={styles.navTitle}>📊 All Games</div>
            <div style={styles.navDescription}>
              View all games with detailed state information, reveal status, and user-specific action guidance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 