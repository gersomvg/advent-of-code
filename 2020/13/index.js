const {readFileSync} = require('fs');
const {resolve} = require('path');

const rows = readFileSync(resolve(__dirname, 'notes.txt'), 'utf8')
  .split('\n');

const startTime = Number(rows[0]);
const buses = rows[1].split(',').filter(val => val !== 'x').map(Number);

function getBusForTimeIfAny(time, buses) {
  return buses.find(bus => time % bus === 0);
}

function findEarliestBusTime(startTime, buses) {
  for (let time = startTime; true; time += 1) {
    const bus = getBusForTimeIfAny(time, buses);
    if (bus) return { bus, wait: time - startTime };
  }
}

const {bus, wait} = findEarliestBusTime(startTime, buses);
const answerPartOne = bus * wait;
console.log(`Answer part one: ${answerPartOne}`);

const offsets = rows[1].split(',').reduce((agg, bus, index) => {
  if (bus === 'x') return agg;
  agg[bus] = index;
  return agg;
}, {})

function isSolution(offsets, time) {
  return Object.keys(offsets).map(Number).every(id => (offsets[id] + time) % id === 0);
}

function findGoldCoinSolution__tooSlow(offsets) {
  const ids = Object.keys(offsets).map(Number);
  const highestID = ids.reduce((agg, id) => Math.max(agg, id), 0);
  const a = Date.now();
  for (let i = 0; true; i += 1) {
    const time = i * highestID - offsets[highestID];
    if (isSolution(ids, offsets, time)) return time;
    if (time > 1000000000) return console.log(Date.now() - a);
  }
}

function findGoldCoinSolution(offsets) {
  const ids = Object.keys(offsets).map(Number).sort((a,b) => a-b);
  let patternStart = 0;
  let patternRepeatsEvery = 1;
  for (let id of ids) {
    let foundFirst = false;
    for (let i = 0; true; i += 1) {
      const pointer = patternStart + patternRepeatsEvery * i;
      if ((pointer + offsets[id]) % id === 0) {
        if (!foundFirst) {
          patternStart = pointer;
          foundFirst = true;
        } else {
          patternRepeatsEvery = pointer - patternStart;
          break;
        }
      }
    }
  }
  return patternStart;
}

const answerPartTwo = findGoldCoinSolution(offsets);
console.log(`Answer part two: ${answerPartTwo}`);