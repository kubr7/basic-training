import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CreateGamePage from './components/CreateGamePage';
import JoinGamePage from './components/JoinGamePage';
import RevealMovePage from './components/RevealMovePage';
import AllGamesPage from './components/AllGamesPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/join" element={<JoinGamePage />} />
          <Route path="/reveal" element={<RevealMovePage />} />
          <Route path="/all-games" element={<AllGamesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
