// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RPSGameContract {
    enum Move {
        None,
        Rock,
        Paper,
        Scissors
    }
    enum State {
        Created,
        Joined,
        Committed,
        Revealed,
        Completed
    }

    struct GameStruct {
        address player1;
        address player2;
        bytes32 commit1;
        bytes32 commit2;
        Move move1;
        Move move2;
        State state;
    }

    uint public gameCount;
    mapping(uint => GameStruct) public games;

    event GameCreated(uint gameId, address player1, address player2);
    event GameJoined(uint gameId, address player2);
    event MoveCommitted(uint gameId, address player);
    event MoveRevealed(uint gameId, address player, Move move);
    event GameCompleted(uint gameId, string result);

    modifier onlyPlayer(uint gameId) {
        GameStruct storage game = games[gameId];
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "Not a player"
        );
        _;
    }

    modifier onlyPlayer1(uint gameId) {
        require(msg.sender == games[gameId].player1, "Not player 1");
        _;
    }

    modifier onlyPlayer2(uint gameId) {
        require(msg.sender == games[gameId].player2, "Not player 2");
        _;
    }

    modifier validState(uint gameId, State requiredState) {
        require(games[gameId].state == requiredState, "Invalid state");
        _;
    }

    modifier validMove(Move choice) {
        require(
            choice == Move.Rock ||
                choice == Move.Paper ||
                choice == Move.Scissors,
            "Invalid move"
        );
        _;
    }

    modifier notCommitted(uint gameId, bool isPlayer1) {
        GameStruct storage game = games[gameId];
        if (isPlayer1) {
            require(game.commit1 == "", "Already committed");
        } else {
            require(game.commit2 == "", "Already committed");
        }
        _;
    }

    modifier notRevealed(uint gameId, bool isPlayer1) {
        GameStruct storage game = games[gameId];
        if (isPlayer1) {
            require(game.move1 == Move.None, "Already revealed");
        } else {
            require(game.move2 == Move.None, "Already revealed");
        }
        _;
    }

    function createGame(address opponent) external returns (uint gameId) {
        gameId = ++gameCount;
        games[gameId] = GameStruct(
            msg.sender,
            opponent,
            "",
            "",
            Move.None,
            Move.None,
            State.Created
        );
        emit GameCreated(gameId, msg.sender, opponent);
    }

    function joinGame(
        uint gameId
    ) external onlyPlayer2(gameId) validState(gameId, State.Created) {
        games[gameId].state = State.Joined;
        emit GameJoined(gameId, msg.sender);
    }

    function commitMove(
        uint gameId,
        Move choice,
        string memory salt
    ) external onlyPlayer(gameId) validMove(choice) {
        GameStruct storage game = games[gameId];
        require(
            game.state == State.Joined || game.state == State.Committed,
            "Invalid state"
        );

        bytes32 commitHash = keccak256(abi.encodePacked(choice, salt));
        if (msg.sender == game.player1) {
            require(game.commit1 == "", "Already committed");
            game.commit1 = commitHash;
        } else {
            require(game.commit2 == "", "Already committed");
            game.commit2 = commitHash;
        }

        if (game.commit1 != "" && game.commit2 != "") {
            game.state = State.Committed;
        }

        emit MoveCommitted(gameId, msg.sender);
    }

    function revealMove(
        uint gameId,
        Move choice,
        string memory salt
    ) external onlyPlayer(gameId) validMove(choice) {
        GameStruct storage game = games[gameId];
        require(
            game.state == State.Committed || game.state == State.Revealed,
            "Invalid state"
        );

        bytes32 hash = keccak256(abi.encodePacked(choice, salt));

        if (msg.sender == game.player1) {
            require(game.move1 == Move.None, "Already revealed");
            require(hash == game.commit1, "Hash mismatch");
            game.move1 = choice;
        } else {
            require(game.move2 == Move.None, "Already revealed");
            require(hash == game.commit2, "Hash mismatch");
            game.move2 = choice;
        }

        if (game.move1 != Move.None && game.move2 != Move.None) {
            game.state = State.Completed;
            string memory result = determineWinner(gameId);
            emit GameCompleted(gameId, result);
        } else {
            game.state = State.Revealed;
        }

        emit MoveRevealed(gameId, msg.sender, choice);
    }

    function determineWinner(
        uint gameId
    ) internal view returns (string memory) {
        GameStruct storage game = games[gameId];
        if (game.move1 == game.move2) {
            return "Draw";
        } else if (
            (game.move1 == Move.Rock && game.move2 == Move.Scissors) ||
            (game.move1 == Move.Paper && game.move2 == Move.Rock) ||
            (game.move1 == Move.Scissors && game.move2 == Move.Paper)
        ) {
            return "Player 1 wins";
        } else {
            return "Player 2 wins";
        }
    }
}
