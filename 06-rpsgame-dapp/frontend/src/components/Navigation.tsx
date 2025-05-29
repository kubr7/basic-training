import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navigation">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/create" className="nav-link">Create Game</Link>
      <Link to="/join" className="nav-link">Join Game</Link>
      <Link to="/reveal" className="nav-link">Reveal Move</Link>
      <Link to="/all-games" className="nav-link">All Games</Link>
    </nav>
  );
};

export default Navigation; 