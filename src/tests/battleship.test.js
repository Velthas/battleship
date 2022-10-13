import { Ship } from '../modules/battleship';

test('A carrier is considered sunk when all 5 positions are hit', () => {
  const myCarrier = Ship(5);
  myCarrier.hit();
  myCarrier.hit();
  myCarrier.hit();
  myCarrier.hit();
  myCarrier.hit();
  expect(myCarrier.isSunk()).toBe(true);
});

test('A carrier is not sunk when only 2 positions are hit', () => {
  const myCarrier = Ship(5);
  myCarrier.hit();
  myCarrier.hit();
  expect(myCarrier.isSunk()).toBe(false);
});
