import { Link } from 'react-router-dom';

const styles = {
  navBar: {
    backgroundColor: '#041C32',
    padding: '1rem 2rem',
    borderBottom: '2px solid #064663',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ECB365',
    marginBottom: '1rem',
  },
  navigation: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '1rem',
  },
  navLink: {
    color: '#ECB365',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: '#064663',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  navLinkHover: {
    backgroundColor: '#0B8FFF',
    color: 'white',
  }
};

const Navigation = () => {
  return (
    <div style={styles.navBar}>
      <div style={styles.logo}>🎮 Rock Paper Scissors DApp</div>
      <nav style={styles.navigation}>
        <Link to="/" style={styles.navLink}>🏠 Home</Link>
        <Link to="/create" style={styles.navLink}>🎯 Create Game</Link>
        <Link to="/join" style={styles.navLink}>🤝 Join Game</Link>
        <Link to="/reveal" style={styles.navLink}>🔍 Reveal & Manage</Link>
        <Link to="/all-games" style={styles.navLink}>📊 All Games</Link>
      </nav>
    </div>
  );
};

export default Navigation; 