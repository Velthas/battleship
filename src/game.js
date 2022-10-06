import './style.css';
import { Player } from './modules/player';
import { Board } from './modules/board';
import { domElements } from './modules/domElements';

const Game = (function () {
  let playerGameBoard;
  let enemyGameBoard;

  let Protagonist;
  let CPU;

  let gameOver = false;
  let winner;

  // It places the ship on fixed locations so I can test the game loop
  const placeShips = function () {
    // This function is here just for testing purposes
    playerGameBoard.placeShip(5, [4, 4]);
    playerGameBoard.placeShip(4, [6, 4]);
    playerGameBoard.placeShip(3, [8, 4]);
    playerGameBoard.placeShip(3, [9, 4]);
    playerGameBoard.placeShip(2, [2, 4]);

    enemyGameBoard.placeShip(5, [4, 4]);
    enemyGameBoard.placeShip(4, [6, 4]);
    enemyGameBoard.placeShip(3, [8, 4]);
    enemyGameBoard.placeShip(3, [9, 4]);
    enemyGameBoard.placeShip(2, [2, 4]);
  };

  const playGameTurn = function (coordinate) {
    if (gameOver) return; // If the game has ended, nothing happens on click

    const playerTurnPlayed = Protagonist.playTurn(coordinate); // Will return true if move played
    if (!playerTurnPlayed) return;
    domElements.markHit(enemyGameBoard, coordinate, 'enemy-board');
    Protagonist.turnOver(); // End the P1 turn

    if (gameIsOver()) {
      declareWinner('Player');
      endGame();
      return;
    }

    CPU.isTurn(); // CPU Turn
    const playedRandomCoordinate = CPU.playRandomMove(); // Will return true if move played
    domElements.markHit(playerGameBoard, playedRandomCoordinate, 'player-board');
    CPU.turnOver();

    if (gameIsOver()) {
      declareWinner('CPU');
      endGame();
      return;
    }

    Protagonist.isTurn(); // Hand over turn to player
  };

  const addEventListenersToEnemyBoard = function () {
    const allTiles = Array.from(document.querySelectorAll('#enemy-board div'));
    allTiles.forEach((tile, index) => {
      tile.addEventListener('click', () => {
        const x = index >= 10 ? Number(index.toString()[1]) : index;
        const y = index >= 10 ? Number(index.toString()[0]) : 0;
        playGameTurn([y, x]);
      });
    });
  };

  // Looks at wether all ships have been sunk or all moves made
  // If any of the conditions is true, returns true.
  const gameIsOver = function () {
    if (
      playerGameBoard.allShipsSunk()
      || enemyGameBoard.allShipsSunk()
      || playerGameBoard.getUnplayedTiles().length === 0
      || enemyGameBoard.getUnplayedTiles().length === 0
    ) {
      return true;
    }

    return false;
  };
  // Creates new players/boards and resets gameOver variable
  const resetGameState = function () {
    playerGameBoard = Board();
    enemyGameBoard = Board();

    Protagonist = Player(1, enemyGameBoard);
    CPU = Player(2, playerGameBoard);

    gameOver = false;
  };

  const declareWinner = function (player) {
    winner = player;
  };

  const startGame = function () {
    resetGameState();
    domElements.deleteExistingBoards();
    domElements.createGridDivs();
    addEventListenersToEnemyBoard();
    placeShips();
  };

  const endGame = function (winningPlayer) {
    gameOver = true; // Officially ends the game
    const playerWon = winner === 'Player' ? true : false;
    domElements.createResetDiv(playerWon, startGame);
  };

  return { startGame };
}());

Game.startGame();
