const domElements = (function () {
  const friendlyBoard = document.querySelector('#friendly-sea');
  const enemyBoard = document.querySelector('#enemy-sea');

  // Creates the two necessary boards for the game
  function createGridDivs() {
    const enemySea = document.createElement('div'); // Create two containers to house tiles
    enemySea.setAttribute('id', 'enemy-board');

    const friendlySea = document.createElement('div'); // One per each player
    friendlySea.setAttribute('id', 'player-board');

    for (let i = 0; i < 100; i++) { // Create all the tiles
      const newDivOne = document.createElement('div');
      newDivOne.classList.add('tile');

      const newDivTwo = document.createElement('div');
      newDivTwo.classList.add('tile');

      enemySea.appendChild(newDivOne);
      friendlySea.appendChild(newDivTwo);
    }
    // Append the two grids to the appropriate container
    friendlyBoard.appendChild(friendlySea);
    enemyBoard.appendChild(enemySea);
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
      boardTiles[tileCoord].classList.add('ship');
    } else {
      boardTiles[tileCoord].classList.add('hit'); // Add styling for empty tile hit
    }
  }
  // Used to reset the boards for the game
  const deleteExistingBoards = function () {
    const playerBoard = friendlyBoard.querySelector('#player-board');
    const opponentBoard = enemyBoard.querySelector('#enemy-board');
    if (playerBoard) playerBoard.remove();
    if (opponentBoard) enemyBoard.remove();
  };

  return { createGridDivs, markHit, deleteExistingBoards };
}());

export { domElements };
