import { AI } from './ai';
import { Ship } from './battleship';

const Player = function (goesFirst, playerBoard, enemyBoard) {
  let turn = goesFirst;
  const opponentBoard = enemyBoard;
  const ownBoard = playerBoard;
  const ai = AI(opponentBoard);

  const turnOver = () => { turn = false; };

  const isTurn = () => { turn = true; };

  // Turn is relinquished on succesful move
  const playTurn = function (coordinate) {
    if (turn === false
    || opponentBoard.getBoard()[coordinate[0]][coordinate[1]].isHit()) return;
    opponentBoard.receiveAttack(coordinate);
    turnOver();
  };

  // Plays smart around hits, otherwise random
  const playRandomMove = function () {
    if (ai.hasMovesToPlay()) {
      const move = ai.getMove();
      playTurn([move[0], move[1]]);
      return move;
    }

    const tile = enemyBoard.getUnplayedTile();
    if (enemyBoard.getBoard()[tile[0]][tile[1]].hasShip()) ai.initialize(tile);
    playTurn(tile);
    return tile;
  };

  const placeShipsRandomly = function () {
    const length = [5, 4, 3, 3, 2];
    const myRandomShips = [];
    let shipNumber = 0;

    for (let i = 0; i < 5; i++) {
      const orientation = Math.random() * 2 > 1 ? 'horizontal' : 'vertical';
      const newShip = Ship(length[i], orientation);
      myRandomShips.push(newShip);
    }

    while (shipNumber < 5) {
      const randomX = Math.floor(Math.random() * 9);
      const randomY = Math.floor(Math.random() * 9);
      ownBoard.placeShip(myRandomShips[shipNumber], [randomY, randomX]);
      shipNumber = ownBoard.getShipsLength();
    }
  };

  const turnState = () => turn;

  return {
    playTurn,
    playRandomMove,
    turnOver,
    isTurn,
    turnState,
    placeShipsRandomly,
  };
};

export { Player };
