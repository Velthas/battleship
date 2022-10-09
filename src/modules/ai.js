const AI = function (Board) {
  // A reference to the enemy board to run checks on positions
  const enemyBoard = Board;

  // This contains arrays with moves yet to be made in all 4 directions.
  const movesToPlay = [];

  // This will store the index of the set of moves we are currently exploring
  let currentOffsetIndex; // that way, even when our turn resumes we know where to pick up again

  // Given that the longest ship is at most 5 in lenght
  // it theoretically suffices to hit 5 - 1 adjacent positions in any direction
  // If any of the hits fail, just move on to the next direction.
  const upwardOffsets = [[-1, 0], [-2, 0], [-3, 0], [-4, 0]];
  const downwardOffsets = [[1, 0], [2, 0], [3, 0], [4, 0]];
  const leftmostOffsets = [[0, -1], [0, -2], [0, -3], [0, -4]];
  const rightmostOffsets = [[0, 1], [0, 2], [0, 3], [0, 4]];

  const allOffsets = [upwardOffsets, downwardOffsets, leftmostOffsets, rightmostOffsets];

  // This function populates the moves to play array
  // Each array it produces has the legal moves for a different direction
  // that is: up/down/left/right
  const calculatePositions = function (position) {
    const positionY = position[0];
    const positionX = position[1];
    // Goes over each set
    allOffsets.forEach((set) => {
      const positionsArray = [];

      for (let i = 0; i < set.length; i++) {
        const offsetY = set[i][0];
        const offsetX = set[i][1];

        const actualY = positionY + offsetY;
        const actualX = positionX + offsetX;

        if (!filterLegal([actualY, actualX])) break;
        positionsArray.push([actualY, actualX]);
      }
      const legalPositions = positionsArray.filter(filterLegal); // Filter out illegal moves
      // If the array is not empty, it contains moves that need to be played
      if (legalPositions.length > 0) movesToPlay.push(legalPositions);
    });
  };

  // Helper function for filter method, only returns legal moves
  const filterLegal = function (position) {
    if (position[0] >= 0 && position[0] < 10
      && position[1] >= 0 && position[1] < 10) {
      // If the position is not hit returns true
      return !enemyBoard.getBoard()[position[0]][position[1]].isHit();
    } return false;
  };

  // Signals CPU wether to let AI Handle things or hit random tiles
  const hasMovesToPlay = function () {
    return movesToPlay.length !== 0;
  };

  // When we miss a hit in a direction or we have gone through
  // all the moves, we must remove the array with moves from the 'movesToPlay' array.
  const removeMovesArray = function (index) {
    movesToPlay.splice(index, 1);
  };

  const doesMoveHit = function (move) {
    return enemyBoard.getBoard()[move[0]][move[1]].hasShip();
  };

  // Randomly decides which offset set is to be used
  const selectMoveset = function () {
    const { length } = movesToPlay;
    if (length === 0) currentOffsetIndex = null; // When we ran out of moves, set to null
    else currentOffsetIndex = Math.floor(Math.random() * (length - 1));
  };

  // Takes a registered hit as position, and sets up
  // all we need to attack adjacent tiles.
  const initialize = function (position) {
    calculatePositions(position);
    selectMoveset();
  };

  // It checks when a moveset is empty, and if it is found to be, removes it
  // and replaces it with the next one
  const checkMovesetLength = function () {
    if (movesToPlay[currentOffsetIndex].length === 0) {
      removeMovesArray(currentOffsetIndex);
      selectMoveset(); // Selects any of the available movesets
    }
  };

  const getMove = function () {
    const move = movesToPlay[currentOffsetIndex][0];
    const moveHit = doesMoveHit(move);

    if (moveHit) {
      movesToPlay[currentOffsetIndex].shift(); // remove the first move so the next can be processed
      checkMovesetLength(); // If the moveset is empty, just remove it
      return move; // give it back to the player module so it can be played
    }

    removeMovesArray(currentOffsetIndex); // this direction does not work, so scrap it
    selectMoveset(); // we randomly decide another direction to try
    // When there will be no more movesets to try, the CPU will just resume to hit randomly
    // Until a hit is found, and AI initialized again.
    return move; // we return the move for the player to play
  };

  return { hasMovesToPlay, initialize, getMove };
};

export { AI };
