import { useState, useEffect } from 'react';
import { connectWallet } from '../utils/interact';

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const { ethereum } = window;
      setIsMetaMaskInstalled(!!ethereum);
    };
    checkMetaMask();
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          // Check if we're authorized to access the user's wallet
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress(null);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the chain changes
      window.location.reload();
    };

    checkWalletConnection();

    // Add event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
    }
  };

  return (
    <div className="page-container">
      <h1>Rock Paper Scissors DApp</h1>
      {!isMetaMaskInstalled ? (
        <div className="error-message">
          <p>MetaMask is not installed!</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-link"
          >
            Install MetaMask
          </a>
        </div>
      ) : !walletAddress ? (
        <button onClick={handleConnectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="welcome-message">
          <h2>Welcome!</h2>
          <p>Your wallet is connected: {walletAddress}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage; 