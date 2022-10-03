import { Ship } from './battleship';

const Tile = function () {
  let hit = false; // Holds information about tile status
  let ship = false; // Is false by default

  const isHit = () => hit;
  const setHit = () => {
    if (hit) return;
    if (ship) {
      ship.reference.hit(ship.position);
    }
    hit = true;
  };

  const hasShip = () => (ship !== false); // False if there isn't a ship, true if there is
  const setShip = (shipObject, position) => {
    ship = {
      reference: shipObject,
      position, // This is a simple integer from 0 to 5;
    };
  };
  const getShip = () => { if (hasShip()) return ship; };
  return {
    isHit, setHit, setShip, hasShip, getShip,
  };
};

const Board = function () {
  // Board is 10x10 multi-dim. array where each item is a 'tile' object
  const createBoard = () => {
    const newBoard = [];
    for (let i = 0; i < 10; i++) {
      const newRow = [];
      for (let j = 0; j < 10; j++) {
        const newTile = Tile();
        newRow.push(newTile);
      }
      newBoard.push(newRow);
    }
    return newBoard;
  };

  const board = createBoard();
  const ships = []; // Array to store ships that populate board

  const isPositionLegal = (coordinate, offsets) => {
    const coordinateX = coordinate[1];
    const coordinateY = coordinate[0];

    const legalPositions = offsets.filter((offset) => {
      const offsetX = offset[1];
      const offsetY = offset[0];
      // Actual position coordinates
      const actualX = coordinateX + offsetX;
      const actualY = coordinateY + offsetY;
      // Check to see if the offset causes the ship to be off the board
      if (actualX < 10 && actualX >= 0
            && actualY < 10 && actualY >= 0) {
        // This verifies is a ship is already on the tile
        return board[actualY][actualX].hasShip() === false;
      }
    });
      // If all positions are legal, arrays will be of the same length
    return legalPositions.length === offsets.length;
  };

  const placeShip = (size, coordinate) => {
    // Make a ship and use offsets to verify if it can be placed
    const newShip = Ship(size);
    const shipOffsets = newShip.getOffsets();
    // Returns false if ship cannot be laid where requested
    if (!isPositionLegal(coordinate, shipOffsets)) return;
    // If everything is fine, place the ship
    shipOffsets.forEach((position, index) => {
      const coord = [coordinate[0] + position[0], coordinate[1] + position[1]];
      board[coord[0]][coord[1]].setShip(newShip, index);
    });
    // After ship is placed, add it to an array to keep track
    ships.push(newShip);
  };

  const receiveAttack = function (coordinate) {
    board[coordinate[0]][coordinate[1]].setHit();
  };

  const allShipsSunk = function () {
    const sunkShips = ships.filter(ship => ship.isSunk());
    return sunkShips.length === ships.length;
  };

  const getBoard = () => {
    const boardCopy = board;
    return boardCopy;
  };

  return {
    placeShip,
    getBoard,
    receiveAttack,
    allShipsSunk,
  };
};

export { Board, Tile };
