import { Ship } from '../modules/battleship';

test('Hit method correctly marks position as hit', () => {
  const myCarrier = Ship(5);
  const hitOffset = myCarrier.hit(2);
  expect(hitOffset).toEqual([0, 2]);
});

test('A carrier is considered sunk when all 5 positions are hit', () => {
  const myCarrier = Ship(5);
  myCarrier.hit(0);
  myCarrier.hit(1);
  myCarrier.hit(2);
  myCarrier.hit(3);
  myCarrier.hit(4);
  expect(myCarrier.isSunk()).toBe(true);
});

test('A carrier is not sunk when only 2 positions are hit', () => {
  const myCarrier = Ship(5);
  myCarrier.hit(2);
  myCarrier.hit(4);
  expect(myCarrier.isSunk()).toBe(false);
});
