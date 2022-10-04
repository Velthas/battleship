const Ship = function (length, direction = 'horizontal') {
  const horizontalOffsets = [
    [[0, 0]],
    [[0, 0], [0, 1]],
    [[0, -1], [0, 0], [0, 1]],
    [[0, -2], [0, -1], [0, 0], [0, 1]],
    [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2]],
  ];

  const verticalOffsets = [
    [[0, 0]],
    [[0, 0], [1, 0]],
    [[-1, 0], [0, 0], [1, 0]],
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],
  ];

  const getOffsets = () => (direction === 'horizontal'
    ? horizontalOffsets[length - 1]
    : verticalOffsets[length - 1]);

  const hitPositions = [];

  function hit(number) {
    if (number > length - 1 || number < 0) return;
    const offset = getOffsets();
    hitPositions.push(offset[number]);
    return offset[number];
  }

  function isSunk() {
    return hitPositions.length === length;
  }

  return { hit, isSunk, getOffsets };
};

export { Ship };
