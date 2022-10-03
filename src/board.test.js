import { Board, Tile } from './board';

test('Gameboard tile correctly registers hit', () => {
  const tile = Tile();
  // By default, tiles are not hit
  expect(tile.isHit()).toBe(false);
  // Once we hit a tile, it should be marked as such
  tile.setHit();
  expect(tile.isHit()).toBe(true);
});

test('Ship is placed correctly on the board', () => {
  const board = Board();
  board.placeShip(5, [4, 4]);
  // Check that all correct carrier tiles are marked
  expect(board.getBoard()[4][1].hasShip()).toBe(false);
  expect(board.getBoard()[4][2].hasShip()).not.toBe(false);
  expect(board.getBoard()[4][3].hasShip()).not.toBe(false);
  expect(board.getBoard()[4][4].hasShip()).not.toBe(false);
  expect(board.getBoard()[4][5].hasShip()).not.toBe(false);
  expect(board.getBoard()[4][6].hasShip()).not.toBe(false);
  expect(board.getBoard()[4][7].hasShip()).toBe(false);
});

test('Ship is not placed if positions are illegal (2 tiles off board)', () => {
  const board = Board();
  board.placeShip(5, [0, 0]);
  const currentBoard = board.getBoard();
  // Tiles should be empty since not all positions are legal
  expect(currentBoard[0][0].hasShip()).toBe(false);
  expect(currentBoard[0][1].hasShip()).toBe(false);
  expect(currentBoard[0][2].hasShip()).toBe(false);
});

test('Ships cannot be placed on top of each other', () => {
  const board = Board();

  board.placeShip(1, [4, 4]);
  let currentBoard = board.getBoard();
  expect(currentBoard[4][4].hasShip()).not.toBe(false);
  const boat = currentBoard[4][4].getShip().reference;
  // Place a new ship on top of it
  board.placeShip(3, [4, 4]);
  currentBoard = board.getBoard();
  // If the reference matches the first boat, then the second one didnt replace it
  expect(currentBoard[4][4].getShip().reference).toEqual(boat);
});

test('Single hit is registered', () => {
  const board = Board();
  board.placeShip(1, [4, 4]);
  board.receiveAttack([4, 4]);
  const currentBoard = board.getBoard();
  expect(currentBoard[4][4].getShip().reference.isSunk()).toBe(true);
});

test('Corvette correctly sunk by attacking all of its 3 positions', () => {
  const board = Board();
  board.placeShip(3, [4, 4]);

  board.receiveAttack([4, 4]);
  board.receiveAttack([4, 3]);
  board.receiveAttack([4, 5]);

  const isShipSunk = board.getBoard()[4][4].getShip().reference.isSunk();
  expect(isShipSunk).toBe(true);
});

test('Board correctly identifies when all ships on it are sunk', () => {
  const board = Board();

  board.placeShip(1, [2, 4]);
  board.receiveAttack([2, 4]);

  board.placeShip(1, [2, 4]);
  board.receiveAttack([2, 4]);

  board.placeShip(1, [3, 4]);
  board.receiveAttack([3, 4]);

  board.placeShip(1, [4, 4]);
  board.receiveAttack([4, 4]);

  expect(board.allShipsSunk()).toBe(true);
});
