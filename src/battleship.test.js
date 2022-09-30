import { Ship } from './battleship';

test('Hit method correctly marks position as hit', () => {
  const myCarrier = Ship(5);
  const hitOffset = myCarrier.hit(2);
  expect(hitOffset).toEqual([0, 0]);
});
