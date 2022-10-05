const domElements = (function () {
  function createGridDivs() {
    const enemySea = document.querySelector('#enemy-board');
    const friendlySea = document.querySelector('#player-board');
    for (let i = 0; i < 100; i++) {
      const newDivOne = document.createElement('div');
      newDivOne.classList.add('tile');

      const newDivTwo = document.createElement('div');
      newDivTwo.classList.add('tile');

      enemySea.appendChild(newDivOne);
      friendlySea.appendChild(newDivTwo);
    }
  }

  function markHit(board, coordinate, friendOrFoe) {
    // Coordinate is an array with y and x of board.
    const tile = board.getBoard()[coordinate[0]][coordinate[1]];
    if (!tile.isHit()) return; // If the tile is not hit there was a problem in the game module

    const y = coordinate[0] * 10;
    const x = coordinate[1];
    const tileCoord = x + y; // Here I just calculate the 1-100 coordinate number;

    const boardTilesQuery = `#${friendOrFoe} div`; // Use this query to determine which board to hit
    const boardTiles = Array.from(document.querySelectorAll(boardTilesQuery));

    if (tile.hasShip()) {
      boardTiles[tileCoord].classList.add('hit'); // Add styling for hit ship
      boardTiles[tileCoord].classList.add('ship'); // Add styling for hit ship
    } else {
      boardTiles[tileCoord].classList.add('hit'); // Add styling for empty ship
    }
  }
  return { createGridDivs, markHit };
}());

export { domElements };
