import { Board } from '../modules/board';
import { Player } from '../modules/player';

test('Turn is played and correctly registered on board', () => {
  const enemyBoard = Board();
  const playerOne = Player(1, enemyBoard);
  playerOne.playTurn([4, 4]);
  expect(enemyBoard.getBoard()[4][4].isHit()).toBe(true);
});

test('Turn is not played because tile is already hit', () => {
  const enemyBoard = Board();
  const playerOne = Player(1, enemyBoard);
  enemyBoard.receiveAttack([4, 4]);
  playerOne.playTurn([4, 4]);
  expect(playerOne.turnState()).toBe(true); // If turn was not played it should still be P1 turn
});

test('Turn is not played because it is not players turn', () => {
  const enemyBoard = Board();
  const playerOne = Player(1, enemyBoard);
  playerOne.turnOver();
  playerOne.playTurn([4, 4]);
  expect(enemyBoard.getBoard()[4][4].isHit()).toBe(false);
});

test('Turn is played randomly for CPU', () => {
  const playerOneBoard = Board();
  const cpuPlayer = Player(1, playerOneBoard);
  cpuPlayer.playRandomMove();
  // If unplayed tile array length is not 100
  // it means one move was played
  expect(playerOneBoard.getUnplayedTiles().length).toBe(99);
});
