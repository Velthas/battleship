import { Tile } from './tile';

const Board = function () {
  let board;
  const ships = [];
  const unplayedTiles = Array.from(Array(100).keys());

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

  const isPositionLegal = (coordinate, ship) => {
    const shipOffset = ship.getOffsets();

    const legalPositions = shipOffset.filter((offset) => {
      const realX = coordinate[1] + offset[1];
      const realY = coordinate[0] + offset[0];

      if (realX < 10 && realX >= 0 // Verifies that ship is not off board
      && realY < 10 && realY >= 0) return board[realY][realX].hasShip() === false;

      return false;
    });

    // If all positions are legal, arrays will be of the same length
    return legalPositions.length === shipOffset.length;
  };

  const placeShip = (ship, coordinate) => {
    const shipOffsets = ship.getOffsets();
    if (!isPositionLegal(coordinate, ship)) return;

    shipOffsets.forEach((position) => {
      const coord = [coordinate[0] + position[0], coordinate[1] + position[1]];
      board[coord[0]][coord[1]].setShip(ship);
    });

    // After ship is placed, add it to an array to keep track
    ships.push(ship);
  };

  const receiveAttack = function (coordinate) {
    board[coordinate[0]][coordinate[1]].setHit();
    markTileAsPlayed(coordinate);
  };

  const allShipsSunk = () => ships.filter((ship) => ship.isSunk()).length === ships.length;

  const markTileAsPlayed = function (coordinate) {
    const x = coordinate[1]; // The idea is that we find which of the 100 tiles
    const y = coordinate[0] * 10; // has been hit, and remove it from the array
    const playedTile = x + y; // The CPU can then choose any number out of the lenght
    unplayedTiles.splice(unplayedTiles.indexOf(playedTile), 1); // of the array
    // and they'll have a tile that has not been played
  };

  // Returns random nonhit tile coordinates
  const getUnplayedTile = () => {
    const tile = unplayedTiles[Math.floor(Math.random() * unplayedTiles.length)];
    const x = tile >= 10 ? Number(tile.toString()[1]) : tile;
    const y = tile >= 10 ? Number(tile.toString()[0]) : 0;
    return [y, x];
  };

  const getBoard = () => board;

  const getShipsLength = () => ships.length;

  board = createBoard();

  return {
    placeShip,
    isPositionLegal,
    getBoard,
    receiveAttack,
    markTileAsPlayed,
    getUnplayedTile,
    allShipsSunk,
    getShipsLength,
  };
};

export { Board, Tile };
