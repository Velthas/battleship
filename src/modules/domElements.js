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

  const addEventListenersToEnemyBoard = function (playGameTurn) {
    const allTiles = Array.from(document.querySelectorAll('#enemy-board div'));
    allTiles.forEach((tile, index) => {
      tile.addEventListener('click', () => {
        const x = index >= 10 ? Number(index.toString()[1]) : index;
        const y = index >= 10 ? Number(index.toString()[0]) : 0;
        playGameTurn([y, x]);
      });
    });
  };

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
    if (opponentBoard) opponentBoard.remove();
  };

  const createResetDiv = function (didPlayerWin, resetGameFunction) {
    const resetDiv = document.createElement('div');
    resetDiv.classList.add('reset');

    const gameResult = document.createElement('h1');
    gameResult.textContent = didPlayerWin ? 'You win' : 'You lose';
    resetDiv.appendChild(gameResult);

    const resetPara = document.createElement('p');
    resetPara.textContent = didPlayerWin ? 'We got them! Well done, admiral. Shall we try again?'
      : 'Seems like we lost this time. Would you like another try, admiral?';
    resetDiv.appendChild(resetPara);

    const resetButton = document.createElement('button');
    resetButton.addEventListener('click', () => {
      resetDiv.remove();
      resetGameFunction();
    });
    resetButton.textContent = 'Restart';
    resetDiv.appendChild(resetButton);

    document.querySelector('body').appendChild(resetDiv);
  };

  const setFriendlyBoard = function (gameBoard, arrayOfShips) {
    let placedShips = 0; // Serves as a counter
    let orientation = 'horizontal'; // By default, orientation of ships is horizontal

    const verticalShips = arrayOfShips[1]; // This is where we draw the ships from
    const horizontalShips = arrayOfShips[0]; // Two arrays give us the complete pool

    const placeShipsContainer = document.createElement('div'); // Container to add low opacity backdrop
    placeShipsContainer.classList.add('place-container');

    const placeShipsDiv = document.createElement('div'); // This is the actual 'form' container
    placeShipsDiv.classList.add('place-ships');
    placeShipsContainer.appendChild(placeShipsDiv);

    const divTitle = document.createElement('h1'); // Title of the form
    divTitle.textContent = 'PLACE YOUR SHIPS';
    placeShipsDiv.appendChild(divTitle);

    const paraInfo = document.createElement('p'); // This paragraph to provide commentary
    paraInfo.textContent = 'Please place your Carrier'; // on what ship must be placed
    placeShipsDiv.appendChild(paraInfo);

    const sandboxGrid = document.createElement('div'); // This is the board where we are planting ships
    sandboxGrid.classList.add('mock-grid'); // it's just a prop to do the placing

    // This loop creates all the tiles and applies event listeners.
    for (let i = 0; i < 100; i++) { // Create all the tiles
      const tile = document.createElement('div');
      tile.classList.add('tile');

      // eslint-disable-next-line no-loop-func
      tile.addEventListener('mouseenter', () => { // When the mouse enters a tile,
        const previousPreview = document.querySelector('.ship-preview'); // it creates an absolutely positioned div
        if (previousPreview) previousPreview.remove(); // that is of the ship size

        const shipPreview = document.createElement('div');
        shipPreview.classList.add('ship-preview'); // Horizontal or vertical is the same here
        shipPreview.classList.add(`${horizontalShips[placedShips].getName().toLowerCase()}`); // just need the name

        // Works on either array because ships at the same index have same length
        const shipLength = horizontalShips[placedShips].getOffsets().length;

        if (orientation === 'horizontal') { // Warning: changing the css size of the board will break this.
          shipPreview.setAttribute('style', `width:${shipLength * 35}px; height:35px;`);
        } else { // this is intended for a 10x10 grid of size 350.
          shipPreview.setAttribute('style', `width:35px; height:${shipLength * 35}px;`);
        }
        tile.appendChild(shipPreview);
      });

      // eslint-disable-next-line no-loop-func
      tile.addEventListener('click', () => { // If position is legal, it appends the ship to the board
        const y = i > 9 ? Number(i.toString()[0]) : 0; // and moves counter forward for the next
        const x = i < 10 ? i : Number(i.toString()[1]); // When 5 ships are placed, deletes form.

        const currentShip = orientation === 'horizontal'
          ? horizontalShips[placedShips]
          : verticalShips[placedShips];

        if (gameBoard.isPositionLegal([y, x], currentShip.getOffsets())) {
          gameBoard.placeShip(currentShip, [y, x]);
          // Every time a ship is placed, display it on the mock grid
          displayFleet('.mock-grid', gameBoard);
          // Increasing this counter allows us to place the subsequent ship
          placedShips += 1;

          if (placedShips < horizontalShips.length) {
            paraInfo.textContent = `Please place your ${horizontalShips[placedShips].getName()}`;
          }
        }

        if (placedShips === horizontalShips.length) { // When condition met ships have been placed
          placeShipsContainer.remove(); // Remove the ship placing form
          domElements.displayFleet('#player-board', gameBoard); // And display the ships of the friendly board.
          // If this game is made to be PvP, the query should be made into a parameter and passed.
        }
      });
      sandboxGrid.appendChild(tile);
    }

    placeShipsDiv.appendChild(sandboxGrid); // When the loop is done, we append the grid

    const rotateButton = document.createElement('button'); // Finally the button to allow ship rotation
    rotateButton.addEventListener('click', () => {
      const previousPreview = document.querySelector('.ship-preview');
      if (previousPreview) previousPreview.remove();
      orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    });
    rotateButton.textContent = 'Rotate';

    placeShipsDiv.appendChild(rotateButton);

    document.querySelector('body').appendChild(placeShipsContainer);
  };

  const displayFleet = function (query, gameBoard) {
    const chosenBoard = document.querySelector(query);
    const tiles = Array.from(chosenBoard.querySelectorAll('div.tile'));
    const board = gameBoard.getBoard();

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j].hasShip()) {
          const currentShip = board[i][j].getShip();
          const shipName = currentShip.reference.getName().toLowerCase();
          tiles[(i * 10) + j].classList.add(shipName);
        }
      }
    }
  };

  return {
    createGridDivs,
    addEventListenersToEnemyBoard,
    markHit,
    deleteExistingBoards,
    createResetDiv,
    setFriendlyBoard,
    displayFleet,
  };
}());

export { domElements };
