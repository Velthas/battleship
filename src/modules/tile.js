const Tile = function () {
  let hit = false; // Holds information about tile status
  let ship = false; // Is false by default

  const isHit = () => hit;

  const setHit = () => {
    if (hit) return;
    if (ship) ship.hit();
    hit = true;
  };

  const hasShip = () => (ship !== false); // False if there isn't a ship, true if there is

  const setShip = (shipObject) => { ship = shipObject; };

  const getShip = () => ship;

  return {
    isHit, setHit, setShip, hasShip, getShip,
  };
};

export { Tile };
