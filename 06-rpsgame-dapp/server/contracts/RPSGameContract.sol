// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    enum GameStatus {
        Created,
        Player1Committed,
        Player2Committed,
        Player1Revealed,
        Player2Revealed,
        Completed
    }

    struct Game {
        address player1;
        address player2;
        bytes32 commit1;
        bytes32 commit2;
        Move move1;
        Move move2;
        address winner;
        GameStatus status;
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
            g.status = (g.status == GameStatus.Player2Revealed)
                ? GameStatus.Completed
                : GameStatus.Player1Revealed;
        } else {
            require(g.move2 == Move.None, "Already revealed");
            require(hash == g.commit2, "Invalid reveal");
            g.move2 = move;
            g.status = (g.status == GameStatus.Player1Revealed)
                ? GameStatus.Completed
                : GameStatus.Player2Revealed;
        }

        emit PlayerRevealed(gameId, msg.sender, move);

        if (g.status == GameStatus.Completed) {
            _resolveGame(gameId);
        }
    }

    function _resolveGame(uint256 gameId) internal {
        Game storage g = games[gameId];

        if (g.move1 == g.move2) {
            g.winner = address(0); // Draw
            // Reset the game state
            g.commit1 = bytes32(0);
            g.commit2 = bytes32(0);
            g.move1 = Move.None;
            g.move2 = Move.None;
            g.status = GameStatus.Created;
            
            emit GameReset(gameId, g.player1, g.player2);
        } else if (
            (g.move1 == Move.Rock && g.move2 == Move.Scissors) ||
            (g.move1 == Move.Paper && g.move2 == Move.Rock) ||
            (g.move1 == Move.Scissors && g.move2 == Move.Paper)
        ) {
            g.winner = g.player1;
        } else {
            g.winner = g.player2;
        }

        emit GameCompleted(gameId, g.winner, g.move1, g.move2);
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
