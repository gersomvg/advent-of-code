const {readFileSync} = require('fs');
const {resolve} = require('path');

const passes = readFileSync(resolve(__dirname, 'passes.txt'), 'utf8').split('\n');

function getRow(pass) {
  return parseInt(pass.substring(0, 7).replace(/F/g, 0).replace(/B/g, 1), 2);
}

function getColumn(pass) {
  return parseInt(pass.substring(7, 10).replace(/L/g, 0).replace(/R/g, 1), 2);
}

function getSeatId(pass) {
  return getRow(pass) * 8 + getColumn(pass);
}

function getMax(arr) {
  return arr.reduce((max, number) => Math.max(max, number), -Infinity);
}

const seatIds = passes.map(getSeatId);

const highestSeatId = getMax(seatIds);
console.log(`Answer part one: ${highestSeatId} is the highest seat ID`);

const mySeat = seatIds.sort().find((id, index) => seatIds[index + 1] === id + 2) + 1;
console.log(`Answer part two: ${mySeat} is my seat`);