const AI = function (Board) {
  const enemyBoard = Board;
  const movesToPlay = [];
  let currentOffsetIndex;

  // Moves to try are four tiles in each main direction
  const upwardOffsets = [[-1, 0], [-2, 0], [-3, 0], [-4, 0]];
  const downwardOffsets = [[1, 0], [2, 0], [3, 0], [4, 0]];
  const leftmostOffsets = [[0, -1], [0, -2], [0, -3], [0, -4]];
  const rightmostOffsets = [[0, 1], [0, 2], [0, 3], [0, 4]];
  const allOffsets = [upwardOffsets, downwardOffsets, leftmostOffsets, rightmostOffsets];

  // Returns true if a move is legal
  const filterLegal = function (position) {
    if (position[0] >= 0 && position[0] < 10
        && position[1] >= 0 && position[1] < 10) {
      return !enemyBoard.getBoard()[position[0]][position[1]].isHit();
    } return false;
  };

  // Creates one moveset array for all main directions
  const calculatePositions = function (position) {
    allOffsets.forEach((set) => {
      const positionsArray = [];

      for (let i = 0; i < set.length; i++) {
        const actualY = position[0] + set[i][0];
        const actualX = position[1] + set[i][1];
        if (!filterLegal([actualY, actualX])) break;
        positionsArray.push([actualY, actualX]);
      }

      // Only push if it has at least one move
      if (positionsArray.length > 0) movesToPlay.push(positionsArray);
    });
  };

  const hasMovesToPlay = () => movesToPlay.length !== 0;

  const removeMovesArray = (index) => movesToPlay.splice(index, 1);

  const doesMoveHit = (move) => enemyBoard.getBoard()[move[0]][move[1]].hasShip();

  // Randomly decides which offset set is to be used
  const selectMoveset = function () {
    const { length } = movesToPlay;
    if (length === 0) currentOffsetIndex = null; // When we ran out of moves, set to null
    else currentOffsetIndex = Math.floor(Math.random() * (length - 1));
  };

  // Populates moves array & select first moveset to try
  const initialize = function (position) {
    calculatePositions(position);
    selectMoveset();
  };

  // Removes empty movesets
  const checkMovesetLength = function () {
    if (movesToPlay[currentOffsetIndex].length === 0) {
      removeMovesArray(currentOffsetIndex);
      selectMoveset();
    }
  };

  const getMove = function () {
    const move = movesToPlay[currentOffsetIndex][0];

    if (doesMoveHit(move)) {
      movesToPlay[currentOffsetIndex].shift(); // Remove move we are about to play
      checkMovesetLength(); // Change moveset if current has no more moves
      return move;
    }

    removeMovesArray(currentOffsetIndex); // Move did not hit, thus remove moveset
    selectMoveset(); // Select other direction to try next
    return move;
  };

  return { hasMovesToPlay, initialize, getMove };
};

export { AI };
