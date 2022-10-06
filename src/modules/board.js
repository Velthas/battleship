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

  const board = createBoard(); // A reference to the board itself
  const ships = []; // We store the ships here to check when they are all sunk
  const unplayedTiles = Array.from(Array(100).keys()); // This is useful for CPU, otherwise not

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
      } return false; // If somehow coordinates are skewed consider it illegal
    });
      // If all positions are legal, arrays will be of the same length
    return legalPositions.length === offsets.length;
  };

  const placeShip = (ship, coordinate) => {
    // Make a ship and use offsets to verify if it can be placed
    const newShip = ship;
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
    markTileAsPlayed(coordinate);
  };

  const allShipsSunk = function () {
    const sunkShips = ships.filter((ship) => ship.isSunk());
    return sunkShips.length === ships.length;
  };

  // This function prevents the computer from having to guess
  // too many times before getting a free tile to hit
  const markTileAsPlayed = function (coordinate) {
    const x = coordinate[1];
    const y = coordinate[0] * 10;
    // The idea is that we find which of the 100 tiles
    // has been hit, and remove it from the array
    // The CPU can then choose any number out of the lenght
    // of the array and they'll have a tile that has not been played
    const playedTile = x + y;
    unplayedTiles.splice(unplayedTiles.indexOf(playedTile), 1);
  };
  // Simply returns a copy of the unplayedTiles array
  const getUnplayedTiles = function () {
    const copyOfUnplayedTiles = unplayedTiles;
    return copyOfUnplayedTiles;
  };

  const getBoard = () => {
    const boardCopy = board;
    return boardCopy;
  };

  // Randomly places the 5 expected ships for AI players
  const placeShipsRandomly = function () {
    const length = [5, 4, 3, 3, 2];
    const myRandomShips = [];

    for (let i = 0; i < 5; i++) {
      const orientation = Math.random() * 2 > 1 ? 'horizontal' : 'vertical';
      const newShip = Ship(length[i], orientation);
      myRandomShips.push(newShip);
    }
    // When all 5 ships have been placed, ships array will be of length 5
    while (ships.length < 5) { // that's we can exit the loop
      const randomX = Math.floor(Math.random() * 9); // Get random coordinates to test
      const randomY = Math.floor(Math.random() * 9);
      // Place ship already checks if coordinates are legal.
      // Which means ships lenght will only increase on succesful ship insertion
      placeShip(myRandomShips[ships.length], [randomY, randomX]);
    }

    return ships.length;
  };

  return {
    placeShip,
    placeShipsRandomly,
    getBoard,
    receiveAttack,
    markTileAsPlayed,
    getUnplayedTiles,
    allShipsSunk,
  };
};

export { Board, Tile };
