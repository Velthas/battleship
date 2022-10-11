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

    Protagonist = Player(1, playerGameBoard, enemyGameBoard);
    CPU = Player(2, enemyGameBoard, playerGameBoard);

    gameOver = false;
  };

  const declareWinner = function (player) {
    winner = player;
  };

  const startGame = function () {
    resetGameState();
    domElements.deleteExistingBoards();
    domElements.createGridDivs();
    domElements.addEventListenersToEnemyBoard(playGameTurn);
    CPU.placeShipsRandomly();
    domElements.setFriendlyBoard(playerGameBoard, Protagonist.createUserShips());
  };

  const endGame = function () {
    gameOver = true; // Officially ends the game
    const playerWon = winner === 'Player';
    domElements.createResetDiv(playerWon, startGame);
  };

  return { startGame };
}());

Game.startGame();
