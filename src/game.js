import './style.css';
import { Player } from './modules/player';
import { Board } from './modules/board';
import { domElements } from './modules/domElements';

const Game = (function () {
  let playerGameBoard = Board();
  let enemyGameBoard = Board();

  let Protagonist = Player(1, enemyGameBoard);
  let CPU = Player(2, playerGameBoard);

  // It places the ship on fixed locations so I can test the game loop
  const placeShips = function () { // This function is here just for testing purposes
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
    const playerTurnPlayed = Protagonist.playTurn(coordinate); // Will return true if move played
    if (!playerTurnPlayed) return;
    domElements.markHit(enemyGameBoard, coordinate, 'enemy-board');
    Protagonist.turnOver(); // End the P1 turn

    CPU.isTurn(); // CPU Turn
    const playedRandomCoordinate = CPU.playRandomMove(); // Will return true if move played
    domElements.markHit(playerGameBoard, playedRandomCoordinate, 'player-board');
    CPU.turnOver();

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

  const gameIsOver = function () {
    if(playerGameBoard.allShipsSunk() || enemyGameBoard.allShipsSunk()) return true;
  }

  const startGame = function () {
    domElements.createGridDivs();
    addEventListenersToEnemyBoard();
    placeShips();
  };

  return { startGame };
}());

Game.startGame();
