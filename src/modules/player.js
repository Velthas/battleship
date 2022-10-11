import { AI } from './ai';
import { Ship } from './battleship';

const Player = function (player, playerBoard, enemyBoard) {
  let turn = player === 1;
  const opponentBoard = enemyBoard;
  const ownBoard = playerBoard;
  const cortana = AI(opponentBoard);

  // If the attempted move is legal, does it and returns true
  // Otherwise returns false
  const playTurn = function (coordinate) {
    // If it's not the user's turn, turn is not played
    if (turn === false) return false;
    // If the tile has already been hit, turn is not played
    if (opponentBoard.getBoard()[coordinate[0]][coordinate[1]].isHit()) return false;
    // Move is legal, so register the hit
    opponentBoard.receiveAttack(coordinate);
    return true;
  };

  // Looks at the pool of unhit tiles and randomly picks one
  const playRandomMove = function () {
    if (cortana.hasMovesToPlay()) {
      const move = cortana.getMove();
      playTurn([move[0], move[1]]);
      return move;
    }
    const unplayedTiles = enemyBoard.getUnplayedTiles();
    const randomNumber = Math.floor(Math.random() * unplayedTiles.length);
    const tile = unplayedTiles[randomNumber];
    const x = tile >= 10 ? Number(tile.toString()[1]) : tile;
    const y = tile >= 10 ? Number(tile.toString()[0]) : 0;
    playTurn([y, x]);
    if (enemyBoard.getBoard()[y][x].hasShip()) cortana.initialize([y, x]);
    return [y, x]; // Returns the coordinate hit for checking
  };

  // Creates both horizontal and vertical version of each ship
  const createUserShips = function () { // we then serve this multidim. array to a DOM Function
    const shipLengths = [5, 4, 3, 3, 2]; // which uses it to allow users to place their ships
    const verticalShips = []; // with their choosen orientation
    const horizontalShips = [];
    const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patroller'];

    for (let i = 0; i < shipLengths.length; i++) {
      verticalShips.push(Ship(shipLengths[i], 'vertical', shipNames[i]));
      horizontalShips.push(Ship(shipLengths[i], 'horizontal', shipNames[i]));
    }

    return [horizontalShips, verticalShips];
  };

  // Randomly places the 5 expected ships for AI players
  const placeShipsRandomly = function () {
    const length = [5, 4, 3, 3, 2];
    const myRandomShips = [];
    let shipNumber = 0;

    for (let i = 0; i < 5; i++) {
      const orientation = Math.random() * 2 > 1 ? 'horizontal' : 'vertical';
      const newShip = Ship(length[i], orientation);
      myRandomShips.push(newShip);
    }
    // When all 5 ships have been placed, ships array will be of length 5
    while (shipNumber < 5) {
      const randomX = Math.floor(Math.random() * 9); // Get random coordinates to test
      const randomY = Math.floor(Math.random() * 9);
      // Place ship already checks if coordinates are legal
      // which means ships lenght will only increase on succesful ship insertion
      ownBoard.placeShip(myRandomShips[shipNumber], [randomY, randomX]);
      shipNumber = ownBoard.getShipsLength();
    }
    return shipNumber;
  };

  const turnOver = function () {
    turn = false;
  };

  const isTurn = function () {
    turn = true;
  };

  const turnState = function () {
    const turnStatus = turn;
    return turnStatus;
  };

  return {
    playTurn,
    playRandomMove,
    turnOver,
    isTurn,
    turnState,
    createUserShips,
    placeShipsRandomly,
  };
};

export { Player };
