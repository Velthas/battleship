import { Board, Tile } from '../modules/board';
import { Ship } from '../modules/battleship';

test('Gameboard tile correctly registers hit', () => {
  const tile = Tile();
  // By default, tiles are not hit
  expect(tile.isHit()).toBe(false);
  // Once we hit a tile, it should be marked as such
  tile.setHit();
  expect(tile.isHit()).toBe(true);
});

test('Ship in horizontal orientation is placed correctly on the board', () => {
  const board = Board();

  const carrier = Ship(5);
  board.placeShip(carrier, [4, 4]);
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
  const carrier = Ship(5);
  board.placeShip(carrier, [0, 0]);
  const currentBoard = board.getBoard();
  // Tiles should be empty since not all positions are legal
  expect(currentBoard[0][0].hasShip()).toBe(false);
  expect(currentBoard[0][1].hasShip()).toBe(false);
  expect(currentBoard[0][2].hasShip()).toBe(false);
});

test('Ships cannot be placed on top of each other', () => {
  const board = Board();
  const lifeboat = Ship(1);
  const destroyer = Ship(3);

  board.placeShip(lifeboat, [4, 4]);
  let currentBoard = board.getBoard();
  expect(currentBoard[4][4].hasShip()).not.toBe(false);
  const boat = currentBoard[4][4].getShip().reference;
  // Place a new ship on top of it
  board.placeShip(destroyer, [4, 4]);
  currentBoard = board.getBoard();
  // If the reference matches the first boat, then the second one didnt replace it
  expect(currentBoard[4][4].getShip().reference).toEqual(boat);
});

test('Single hit is registered', () => {
  const board = Board();
  const lifeboat = Ship(1);
  board.placeShip(lifeboat, [4, 4]);
  board.receiveAttack([4, 4]);
  const currentBoard = board.getBoard();
  expect(currentBoard[4][4].getShip().reference.isSunk()).toBe(true);
});

test('Corvette correctly sunk by attacking all of its 3 positions', () => {
  const board = Board();
  const corvette = Ship(3);
  board.placeShip(corvette, [4, 4]);

  board.receiveAttack([4, 4]);
  board.receiveAttack([4, 3]);
  board.receiveAttack([4, 5]);

  const isShipSunk = board.getBoard()[4][4].getShip().reference.isSunk();
  expect(isShipSunk).toBe(true);
});

test('Board correctly identifies when all ships on it are sunk', () => {
  const board = Board();

  const lifeboat1 = Ship(1);
  const lifeboat2 = Ship(1);
  const lifeboat3 = Ship(1);
  const lifeboat4 = Ship(1);

  board.placeShip(lifeboat1, [1, 4]);
  board.receiveAttack([1, 4]);

  board.placeShip(lifeboat2, [2, 4]);
  board.receiveAttack([2, 4]);

  board.placeShip(lifeboat3, [3, 4]);
  board.receiveAttack([3, 4]);

  board.placeShip(lifeboat4, [4, 4]);
  board.receiveAttack([4, 4]);

  expect(board.allShipsSunk()).toBe(true);
});

test('Check if 5 ships are properly laid out on board', () => {
  const board = Board();
  expect(board.placeShipsRandomly()).toBe(5);
});
