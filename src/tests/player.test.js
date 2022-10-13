import { Board } from '../modules/board';
import { Player } from '../modules/player';

test('Turn is played and correctly registered on board', () => {
  const enemyBoard = Board();
  const friendlyBoard = Board();
  const playerOne = Player(true, friendlyBoard, enemyBoard);
  playerOne.playTurn([4, 4]);
  expect(enemyBoard.getBoard()[4][4].isHit()).toBe(true);
});

test('Turn is not played because tile is already hit', () => {
  const enemyBoard = Board();
  const friendlyBoard = Board();
  const playerOne = Player(true, friendlyBoard, enemyBoard);
  enemyBoard.receiveAttack([4, 4]);
  playerOne.playTurn([4, 4]);
  expect(playerOne.turnState()).toBe(true); // If turn was not played it should still be P1 turn
});

test('Turn is not played because it is not players turn', () => {
  const enemyBoard = Board();
  const friendlyBoard = Board();
  const playerOne = Player(true, friendlyBoard, enemyBoard);
  playerOne.turnOver();
  playerOne.playTurn([4, 4]);
  expect(enemyBoard.getBoard()[4][4].isHit()).toBe(false);
});

test('Turn is played randomly for CPU', () => {
  const playerOneBoard = Board();
  const cpuBoard = Board();
  const cpuPlayer = Player(true, cpuBoard, playerOneBoard);
  const move = cpuPlayer.playRandomMove();
  // If unplayed tile array length is not 100
  // it means one move was played
  expect(playerOneBoard.getBoard()[move[0]][move[1]].isHit()).toBe(true);
});

test('Check if 5 ships are properly laid out on board', () => {
  const enemyBoard = Board();
  const friendlyBoard = Board();
  const playerOne = Player(true, friendlyBoard, enemyBoard);
  playerOne.placeShipsRandomly();
  expect(friendlyBoard.getShipsLength()).toBe(5);
});
