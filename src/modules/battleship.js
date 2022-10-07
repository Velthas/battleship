const Ship = function (length, direction = 'horizontal', name) {
  const shipName = name ? name : '';

  const horizontalOffsets = [
    [[0, 0]],
    [[0, 0], [0, 1]],
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  ];

  const verticalOffsets = [
    [[0, 0]],
    [[0, 0], [1, 0]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
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

  function getName() {
    return shipName;
  }

  return { hit, isSunk, getOffsets, getName };
};

export { Ship };
