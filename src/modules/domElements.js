import { Ship } from './battleship';

const domElements = (function () {
  const friendlyBoard = document.querySelector('#friendly-sea');
  const enemyBoard = document.querySelector('#enemy-sea');
  let shipOrientation = 'horizontal';

  // Creates the two necessary boards for the game
  function createGridDivs() {
    const enemySea = document.createElement('div');
    enemySea.setAttribute('id', 'enemy-board');

    const friendlySea = document.createElement('div');
    friendlySea.setAttribute('id', 'player-board');

    for (let i = 0; i < 100; i++) {
      const newDivOne = document.createElement('div');
      newDivOne.classList.add('tile');

      const newDivTwo = document.createElement('div');
      newDivTwo.classList.add('tile');

      enemySea.appendChild(newDivOne);
      friendlySea.appendChild(newDivTwo);
    }

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
    const tile = board.getBoard()[coordinate[0]][coordinate[1]];
    if (!tile.isHit()) return;

    const tileCoord = coordinate[0] * 10 + coordinate[1];

    const boardTilesQuery = `#${friendOrFoe} div`; // Use this query to determine which board to hit
    const boardTiles = Array.from(document.querySelectorAll(boardTilesQuery));

    if (tile.hasShip()) boardTiles[tileCoord].classList.add('hit', 'ship');
    else boardTiles[tileCoord].classList.add('hit');
  }

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

  const displayFleet = function (query, board) {
    const chosenBoard = document.querySelector(query);
    const tiles = Array.from(chosenBoard.querySelectorAll('div.tile'));
    const gboard = board.getBoard();

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (gboard[i][j].hasShip()) {
          const shipName = gboard[i][j].getShip().getName().toLowerCase();
          tiles[(i * 10) + j].classList.add(shipName);
        }
      }
    }
  };

  const updateInfoPara = (name) => { document.querySelector('.place-ships p').textContent = `Please place your ${name}`; };

  const endShipPlacement = (query, board) => {
    document.querySelector('.place-container').remove();
    displayFleet(query, board);
  };

  const addShipPreview = function (e, board) {
    const shipsLength = [5, 4, 3, 3, 2];
    const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patroller'];
    const index = board.getShipsLength();
    const ship = Ship(shipsLength[index], shipOrientation, shipNames[index]);

    const previousPreview = document.querySelector('.ship-preview');
    if (previousPreview) previousPreview.remove();

    const shipPreview = document.createElement('div');
    shipPreview.classList.add('ship-preview', `${ship.getName().toLowerCase()}`);

    const shipLength = ship.getOffsets().length;
    const boardCellWidth = e.target.offsetWidth;
    const boardCellHeight = e.target.offsetHeight;

    if (shipOrientation === 'horizontal') {
      shipPreview.setAttribute('style', `width:${boardCellWidth * shipLength}px; height:${boardCellHeight}px;`);
    } else {
      shipPreview.setAttribute('style', `width:${boardCellWidth}px; height:${boardCellHeight * shipLength}px;`);
    }

    e.target.appendChild(shipPreview);
  };

  const placeShip = function (board, coord) {
    const shipsLength = [5, 4, 3, 3, 2];
    const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patroller'];
    let index = board.getShipsLength();
    const ship = Ship(shipsLength[index], shipOrientation, shipNames[index]);

    if (board.isPositionLegal(coord, ship)) {
      board.placeShip(ship, coord);
      displayFleet('.mock-grid', board);
      index += 1;
      if (index < 5) updateInfoPara(shipNames[index]);
    }

    if (index === 5) endShipPlacement('#player-board', board);
  };

  const createPlaceShipGrid = function (board) {
    const mockGrid = document.createElement('div');
    mockGrid.classList.add('mock-grid');

    for (let i = 0; i < 100; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      const x = i < 10 ? i : Number(i.toString()[1]);
      const y = i < 10 ? 0 : Number(i.toString()[0]);

      tile.addEventListener('mouseenter', (e) => { addShipPreview(e, board); });
      tile.addEventListener('click', () => { placeShip(board, [y, x]); });

      mockGrid.appendChild(tile);
    }

    return mockGrid;
  };

  const createRotateButton = () => {
    const rotateButton = document.createElement('button');
    rotateButton.textContent = 'Rotate';

    rotateButton.addEventListener('click', () => {
      const previousPreview = document.querySelector('.ship-preview');
      if (previousPreview) previousPreview.remove();
      shipOrientation = shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    });

    return rotateButton;
  };

  const setFriendlyBoard = function (board) {
    const placeShipsContainer = document.createElement('div');
    placeShipsContainer.classList.add('place-container');

    const placeShipsDiv = document.createElement('div');
    placeShipsDiv.classList.add('place-ships');
    placeShipsContainer.appendChild(placeShipsDiv);

    const divTitle = document.createElement('h1');
    divTitle.textContent = 'PLACE YOUR SHIPS';
    placeShipsDiv.appendChild(divTitle);

    const paraInfo = document.createElement('p');
    paraInfo.textContent = 'Please place your Carrier';
    placeShipsDiv.appendChild(paraInfo);

    const mockGrid = createPlaceShipGrid(board);
    placeShipsDiv.appendChild(mockGrid);

    const rotateButton = createRotateButton();
    placeShipsDiv.appendChild(rotateButton);

    document.querySelector('body').appendChild(placeShipsContainer);
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
