const {readFileSync} = require('fs');
const {resolve} = require('path');

const ACTIVE = '#';
const INACTIVE = '.';

const slice = readFileSync(resolve(__dirname, 'cubes.txt'), 'utf8')
  .split('\n').map(row => row.split(''));

function makeSpace(slice, dimensions) {
  const prepend = new Array(dimensions - 2).fill(0);
  let space = new Set();
  for (let [y, row] of slice.entries()) {
    for (let [x, cube] of row.entries()) {
      if (cube === ACTIVE)
        space.add([...prepend, y, x].join(','));
    }
  }
  return space;
}

const space3d = makeSpace(slice, 3);
const space4d = makeSpace(slice, 4);

function getNeighborCoords(coords, depth = 1) {
  let neighbors = [];
  for (let i = -1; i <= 1; i += 1) {
    const dc = coords[depth - 1] + i;
    if (depth === coords.length)
      neighbors.push([dc]);
    else
      getNeighborCoords(coords, depth + 1).forEach(part => neighbors.push([dc, ...part]));
  }
  return neighbors;
}

function countActiveNeighbors(coords, space) {
  let count = 0;
  for (let neighbor of getNeighborCoords(coords)) {
    const coordString = neighbor.join(',');
    if (coordString === coords.join(',')) continue;
    if (space.has(coordString)) count += 1;
  }
  return count;
}

function cycle(space) {
  const coordsProneToChange = new Set(space);
  for (let activeCoords of space.values()) {
    const activeCoordsArr = activeCoords.split(',').map(Number);
    for (let neighborOfActiveCoords of getNeighborCoords(activeCoordsArr)) {
      coordsProneToChange.add(neighborOfActiveCoords.join(','));
    }
  }
  const nextSpace = new Set(space);
  for (let coords of coordsProneToChange.values()) {
    const coordsArr = coords.split(',').map(Number);
    const activeNeighbors = countActiveNeighbors(coordsArr, space);
    const isActive = space.has(coords);
    if (!isActive && activeNeighbors === 3) nextSpace.add(coords);
    if (isActive && ![2,3].includes(activeNeighbors)) nextSpace.delete(coords);
  }
  return nextSpace;
}

function boot(space, cycles = 6) {
  let current = space;
  for (let i = 0; i < cycles; i += 1) {
    current = cycle(current);
  }
  return current;
}

const answerPartOne = boot(space3d).size;
console.log(`Answer part one: ${answerPartOne}`);

const answerPartTwo = boot(space4d).size;
console.log(`Answer part two: ${answerPartTwo}`);