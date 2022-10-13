const Ship = function (length, direction, name) {
  const shipName = name || '';
  const orientation = direction || 'horizontal';
  const size = length;
  let health = size;

  const calculateOffsets = function () {
    const arr = [];
    for (let i = 0; i < size; i++) {
      const x = orientation === 'horizontal' ? i : 0;
      const y = orientation === 'horizontal' ? 0 : i;
      arr.push([y, x]);
    }
    return arr;
  };

  const offsets = calculateOffsets();

  const getOffsets = () => offsets;

  const hit = () => { health -= 1; };

  const isSunk = () => health === 0;

  const getName = () => shipName;

  return {
    hit, isSunk, getOffsets, getName,
  };
};

export { Ship };
