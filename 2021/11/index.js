const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split('\n')
    .map((line) => line.split('').map(Number));
}

function getNextStep(state) {
  const nextState = [...state.map((line) => [...line.map((num) => num + 1)])];
  let flashCount = 0;
  while (nextState.flat().some((num) => num > 9)) {
    for (const [y, line] of nextState.entries()) {
      for (const [x, num] of line.entries()) {
        if (num <= 9) continue;
        nextState[y][x] = 0;
        flashCount += 1;
        [
          [y - 1, x - 1],
          [y - 1, x],
          [y - 1, x + 1],
          [y, x - 1],
          [y, x + 1],
          [y + 1, x - 1],
          [y + 1, x],
          [y + 1, x + 1],
        ].forEach(([dy, dx]) => {
          if (nextState[dy]?.[dx]) nextState[dy][dx] += 1;
        });
      }
    }
  }
  return { nextState, flashCount };
}

function getAfterNSteps(state, n) {
  return Array(n)
    .fill(0)
    .reduce(
      ({ nextState, flashCount }) => {
        const nextStep = getNextStep(nextState);
        // console.log('\n');
        // console.log(
        //   nextStep.nextState.map((line) => line.join(' ')).join('\n')
        // );
        // console.log('\n');
        return {
          nextState: nextStep.nextState,
          flashCount: flashCount + nextStep.flashCount,
        };
      },
      { nextState: state, flashCount: 0 }
    );
}

function getAnswer1() {
  const input = getInput('input.txt');
  return getAfterNSteps(input, 100).flashCount;
}

function getStepCountUntilSync(state) {
  const numCount = state.length * state[0].length;
  let count = 0;
  let prevState = state;
  while (true) {
    count += 1;
    const { nextState, flashCount } = getNextStep(prevState);
    if (flashCount === numCount) return count;
    prevState = nextState;
  }
}

function getAnswer2() {
  const input = getInput('input.txt');
  return getStepCountUntilSync(input);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
