// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    enum GameStatus {
        Created,        // Initial state
        Player1Committed, // After P1 commits their move
        Player2Committed, // After P2 commits their move
        Completed      // After both players reveal
    }

    struct Game {
        address player1;    // 20 bytes
        address player2;    // 20 bytes
        bytes32 commit1;    // 32 bytes - hash of P1's move + salt
        bytes32 commit2;    // 32 bytes - hash of P2's move + salt
        Move move1;        // 1 byte - P1's revealed move
        Move move2;        // 1 byte - P2's revealed move
        address winner;    // 20 bytes - winner address (0x0 for draw)
        GameStatus status; // 1 byte - current game state
    }

    uint256 public gameCounter;
    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2);
    event PlayerCommitted(uint256 indexed gameId, address indexed player);
    event PlayerRevealed(uint256 indexed gameId, address indexed player, Move move);
    event GameCompleted(uint256 indexed gameId, address winner, Move move1, Move move2);
    event GameReset(uint256 indexed gameId, address player1, address player2);

    modifier onlyPlayer(uint256 gameId) {
        Game storage g = games[gameId];
        require(msg.sender == g.player1 || msg.sender == g.player2, "Not a player");
        _;
    }

    function createGame(address opponent, Move move, string calldata salt) external returns (uint256) {
        require(opponent != msg.sender, "Cannot play against self");
        require(_isValidMove(move), "Invalid move");

        gameCounter++;
        uint256 gameId = gameCounter;

        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.player2 = opponent;
        g.commit1 = keccak256(abi.encodePacked(move, salt));
        g.status = GameStatus.Player1Committed;

        playerGames[msg.sender].push(gameId);
        playerGames[opponent].push(gameId);

        emit GameCreated(gameId, msg.sender, opponent);
        emit PlayerCommitted(gameId, msg.sender);
        return gameId;
    }

    function joinAndCommit(uint256 gameId, Move move, string calldata salt) external {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Player1Committed, "Game not joinable");
        require(msg.sender == g.player2, "Only opponent can join");
        require(_isValidMove(move), "Invalid move");

        g.commit2 = keccak256(abi.encodePacked(move, salt));
        g.status = GameStatus.Player2Committed;

        emit PlayerCommitted(gameId, msg.sender);
    }

    function revealMove(uint256 gameId, Move move, string calldata salt) external onlyPlayer(gameId) {
        require(_isValidMove(move), "Invalid move");
        Game storage g = games[gameId];
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

        emit PlayerRevealed(gameId, msg.sender, move);

        // Game completes when both moves are revealed
        if (g.move1 != Move.None && g.move2 != Move.None) {
            g.status = GameStatus.Completed;
            _resolveGame(gameId);
        }
    }

    function _resolveGame(uint256 gameId) internal {
        Game storage g = games[gameId];

        if (g.move1 == g.move2) {
            // Store moves before resetting
            Move originalMove1 = g.move1;
            Move originalMove2 = g.move2;
            
            g.winner = address(0); // Draw
            // Reset the game state
            g.commit1 = bytes32(0);
            g.commit2 = bytes32(0);
            g.move1 = Move.None;
            g.move2 = Move.None;
            g.status = GameStatus.Created;
            
            emit GameReset(gameId, g.player1, g.player2);
            // Emit GameCompleted with the original moves
            emit GameCompleted(gameId, address(0), originalMove1, originalMove2);
        } else if (
            (g.move1 == Move.Rock && g.move2 == Move.Scissors) ||
            (g.move1 == Move.Paper && g.move2 == Move.Rock) ||
            (g.move1 == Move.Scissors && g.move2 == Move.Paper)
        ) {
            g.winner = g.player1;
            emit GameCompleted(gameId, g.winner, g.move1, g.move2);
        } else {
            g.winner = g.player2;
            emit GameCompleted(gameId, g.winner, g.move1, g.move2);
        }
    }

    function _isValidMove(Move move) private pure returns (bool) {
        return move == Move.Rock || move == Move.Paper || move == Move.Scissors;
    }

    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }

    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }
}
