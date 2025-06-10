// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    enum GameStatus {
        Created,        // Initial state
        Player1Committed, // After P1 commits their move
        Player2Committed, // After P2 commits their move
        Completed,     // After both players reveal
        Draw          // Game ended in draw (can be replayed)
    }

    // Gas optimized struct - packed to reduce storage slots
    struct Game {
        address player1;    // 20 bytes
        address player2;    // 20 bytes
        address winner;     // 20 bytes - winner address (0x0 for draw)
        bytes32 commit1;    // 32 bytes - hash of P1's move + salt (slot 2)
        bytes32 commit2;    // 32 bytes - hash of P2's move + salt (slot 3)
        Move move1;        // 1 byte - P1's revealed move
        Move move2;        // 1 byte - P2's revealed move
        GameStatus status; // 1 byte - current game state
        uint8 roundNumber; // 1 byte - tracks rounds in case of draws (remaining 28 bytes in slot 4)
    }

    uint256 public gameCounter;
    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2);
    event PlayerCommitted(uint256 indexed gameId, address indexed player, uint8 round);
    event PlayerRevealed(uint256 indexed gameId, address indexed player, Move move, uint8 round);
    event GameCompleted(uint256 indexed gameId, address winner, Move move1, Move move2, uint8 round);
    event GameDraw(uint256 indexed gameId, Move move1, Move move2, uint8 round);
    event NewRoundStarted(uint256 indexed gameId, uint8 round);

    modifier onlyPlayer(uint256 gameId) {
        Game storage g = games[gameId];
        require(msg.sender == g.player1 || msg.sender == g.player2, "Not a player");
        _;
    }

    modifier validGameId(uint256 gameId) {
        require(gameId > 0 && gameId <= gameCounter, "Invalid game ID");
        _;
    }

    function createGame(address opponent, bytes32 hashedMove) external returns (uint256) {
        require(opponent != msg.sender, "Cannot play against self");
        require(opponent != address(0), "Invalid opponent address");
        require(hashedMove != bytes32(0), "Invalid hashed move");

        uint256 gameId = ++gameCounter; // Pre-increment saves gas

        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.player2 = opponent;
        g.commit1 = hashedMove;
        g.status = GameStatus.Player1Committed;
        g.roundNumber = 1;
        // move1, move2, winner default to 0/None/address(0)

        playerGames[msg.sender].push(gameId);
        playerGames[opponent].push(gameId);

        emit GameCreated(gameId, msg.sender, opponent);
        emit PlayerCommitted(gameId, msg.sender, 1);
        return gameId;
    }

    function joinAndCommit(uint256 gameId, bytes32 hashedMove) external validGameId(gameId) {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Player1Committed || g.status == GameStatus.Draw, "Game not joinable");
        require(msg.sender == g.player2, "Only opponent can join");
        require(hashedMove != bytes32(0), "Invalid hashed move");

        g.commit2 = hashedMove;
        g.status = GameStatus.Player2Committed;

        emit PlayerCommitted(gameId, msg.sender, g.roundNumber);
    }

    function revealMove(uint256 gameId, Move move, string calldata salt) external onlyPlayer(gameId) validGameId(gameId) {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Player2Committed, "Cannot reveal yet");
        require(_isValidMove(move), "Invalid move");
        
        bytes32 hash = keccak256(abi.encodePacked(move, salt));

        if (msg.sender == g.player1) {
            require(g.move1 == Move.None, "Already revealed");
            require(hash == g.commit1, "Invalid reveal");
            g.move1 = move;
        } else {
            require(g.move2 == Move.None, "Already revealed");
            require(hash == g.commit2, "Invalid reveal");
            g.move2 = move;
        }

        emit PlayerRevealed(gameId, msg.sender, move, g.roundNumber);

        // Game completes when both moves are revealed
        if (g.move1 != Move.None && g.move2 != Move.None) {
            _resolveGame(gameId);
        }
    }

    function _resolveGame(uint256 gameId) internal {
        Game storage g = games[gameId];
        Move move1 = g.move1;
        Move move2 = g.move2;
        uint8 currentRound = g.roundNumber;

        if (move1 == move2) {
            // Draw - prepare for next round
            g.status = GameStatus.Draw;
            g.winner = address(0);
            
            // Clear moves and commits for next round
            delete g.move1;
            delete g.move2;
            delete g.commit1;
            delete g.commit2;
            
            emit GameDraw(gameId, move1, move2, currentRound);
        } else {
            // Determine winner
            bool player1Wins = (move1 == Move.Rock && move2 == Move.Scissors) ||
                              (move1 == Move.Paper && move2 == Move.Rock) ||
                              (move1 == Move.Scissors && move2 == Move.Paper);
            
            g.winner = player1Wins ? g.player1 : g.player2;
            g.status = GameStatus.Completed;
            
            emit GameCompleted(gameId, g.winner, move1, move2, currentRound);
        }
    }

    function startNewRound(uint256 gameId, bytes32 hashedMove) external validGameId(gameId) {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Draw, "Game not in draw state");
        require(msg.sender == g.player1, "Only player1 can start new round");
        require(hashedMove != bytes32(0), "Invalid hashed move");

        g.roundNumber++;
        g.commit1 = hashedMove;
        g.status = GameStatus.Player1Committed;

        emit NewRoundStarted(gameId, g.roundNumber);
        emit PlayerCommitted(gameId, msg.sender, g.roundNumber);
    }

    function _isValidMove(Move move) private pure returns (bool) {
        return move >= Move.Rock && move <= Move.Scissors;
    }

    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }

    function getGame(uint256 gameId) external view validGameId(gameId) returns (Game memory) {
        return games[gameId];
    }

    function getGameStatus(uint256 gameId) external view validGameId(gameId) returns (GameStatus, uint8, address) {
        Game storage g = games[gameId];
        return (g.status, g.roundNumber, g.winner);
    }
}
