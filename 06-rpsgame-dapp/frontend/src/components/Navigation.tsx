import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="nav-bar">
      <div className="logo">Rock Paper Scissors DApp</div>
      <nav className="navigation">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/create" className="nav-link">Create Game</Link>
        <Link to="/join" className="nav-link">Join Game</Link>
        <Link to="/reveal" className="nav-link">Reveal Move</Link>
        <Link to="/all-games" className="nav-link">All Games</Link>
      </nav>
    </div>
  );
};

export default Navigation; 