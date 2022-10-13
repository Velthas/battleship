import './style.css';
import { Player } from './modules/player';
import { Board } from './modules/board';
import { domElements } from './modules/domElements';

const Game = (function () {
  let playerGameBoard;
  let enemyGameBoard;

  let User;
  let CPU;

  let gameOver = false;
  let winner;

  const gameIsOver = () => playerGameBoard.allShipsSunk() || enemyGameBoard.allShipsSunk();

  const resetGameState = function () {
    playerGameBoard = Board();
    enemyGameBoard = Board();
    User = Player(true, playerGameBoard, enemyGameBoard);
    CPU = Player(false, enemyGameBoard, playerGameBoard);
    gameOver = false;
  };

  const startGame = function () {
    resetGameState();
    domElements.deleteExistingBoards();
    domElements.createGridDivs();
    domElements.addEventListenersToEnemyBoard(playGameTurn);
    CPU.placeShipsRandomly();
    domElements.setFriendlyBoard(playerGameBoard);
  };

  const endGame = function () {
    gameOver = true;
    winner = User.turnState() === true ? 'CPU' : 'Player';
    domElements.createResetDiv(winner === 'Player', startGame);
  };

  const playGameTurn = function (coordinate) {
    if (gameOver) return;

    User.playTurn(coordinate); // User Turn
    if (User.turnState()) return;
    domElements.markHit(enemyGameBoard, coordinate, 'enemy-board');
    if (gameIsOver()) return endGame();

    CPU.isTurn(); // CPU Turn
    const CPUMove = CPU.playRandomMove();
    domElements.markHit(playerGameBoard, CPUMove, 'player-board');
    if (gameIsOver()) return endGame();

    User.isTurn();
  };

  startGame();

  return { startGame };
}());
