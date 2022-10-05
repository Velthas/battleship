const Player = function (player, enemyBoard) {
  let turn = player === 1;
  const opponentBoard = enemyBoard;

  // If the attempted move is legal, does it and returns true
  // Otherwise returns false
  const playTurn = function (coordinate) {
    // If it's not the user's turn, turn is not played
    if (turn === false) return false;
    // If the tile has already been hit, turn is not played
    if (opponentBoard.getBoard()[coordinate[0]][coordinate[1]].isHit()) return false;
    // Move is legal, so register the hit
    opponentBoard.receiveAttack(coordinate);
    return true;
  };

  // Looks at the pool of unhit tiles and randomly picks one
  const playRandomMove = function () {
    const unplayedTiles = enemyBoard.getUnplayedTiles();
    const randomNumber = Math.floor(Math.random() * unplayedTiles.length);
    const tile = unplayedTiles[randomNumber];
    const x = tile >= 10 ? Number(tile.toString()[1]) : tile;
    const y = tile >= 10 ? Number(tile.toString()[0]) : 0;
    playTurn([y, x]);
    return [y, x];
  };

  const turnOver = function () {
    turn = false;
  };

  const isTurn = function () {
    turn = true;
  };

  const turnState = function () {
    const turnStatus = turn;
    return turnStatus;
  };

  return {
    playTurn,
    playRandomMove,
    turnOver,
    isTurn,
    turnState,
  };
};

export { Player };
