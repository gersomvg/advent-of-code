const {readFileSync} = require('fs');
const {resolve} = require('path');

const OCCUPIED = '#';
const EMPTY = 'L';
const FLOOR = '.';

const seats = readFileSync(resolve(__dirname, 'seats.txt'), 'utf8')
  .split('\n').map(row => row.split(''));

function getAdjacentSeats(y, x, _seats) {
  const surrounding = [];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      const isSelf = dx === 0 && dy === 0;
      const surrSeat = (_seats[y + dy] || {})[x + dx];
      if (isSelf || !surrSeat) continue;
      surrounding.push(surrSeat);
    }
  }
  return surrounding;
}

function getVisibleSeats(y, x, _seats) {
  const surrounding = [];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      if (dx === 0 && dy === 0) continue;
      for (let dz = 1; true; dz += 1) {
        const surrSeat = (_seats[y + dy * dz] || {})[x + dx * dz];
        if (surrSeat === FLOOR) continue;
        if (surrSeat) surrounding.push(surrSeat);
        break;
      }
    }
  }
  return surrounding;
}

function applyHumanBehaviour(_seats, occupancyTolerance, getRelevantSeatsFunc) {
  return _seats.map((row, y) => row.map((seat, x) => {
    const surr = getRelevantSeatsFunc(y, x, _seats);
    if (seat === EMPTY && surr.filter(s => s === OCCUPIED).length === 0) {
      return OCCUPIED;
    }
    if (seat === OCCUPIED && surr.filter(s => s === OCCUPIED).length > occupancyTolerance) {
      return EMPTY;
    }
    return seat;
  }));
}

function modelIsStable(prev, next) {
  return next.every((row, y) => row.every((seat, x) => {
    return seat === prev[y][x];
  }))
}

function modelHumanBehaviourUntilStable(_seats, occupancyTolerance, getRelevantSeatsFunc) {
  let prevState = _seats;
  while (true) {
    const newState = applyHumanBehaviour(prevState, occupancyTolerance, getRelevantSeatsFunc);
    if (modelIsStable(prevState, newState)) return newState;
    prevState = newState;
  }
}

function countSeatsOfType(_seats, type) {
  return _seats
    .map(row => row.filter(seat => seat === type).length)
    .reduce((agg, count) => agg + count, 0);
}

const stableStateOne = modelHumanBehaviourUntilStable(seats, 3, getAdjacentSeats);
const answerPartOne = countSeatsOfType(stableStateOne, OCCUPIED);
console.log(`Answer part one: ${answerPartOne}`);

const stableStateTwo = modelHumanBehaviourUntilStable(seats, 4, getVisibleSeats);
const answerPartTwo = countSeatsOfType(stableStateTwo, OCCUPIED);
console.log(`Answer part two: ${answerPartTwo}`);