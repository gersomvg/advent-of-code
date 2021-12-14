const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split('\n')
    .map((line) => line.split('-'));
}

function getPathCount(input, allowOneDoubleVisit) {
  const inputLTR = [
    ...input,
    ...input.map((rule) => rule.slice().reverse()),
  ].filter((rule) => rule[0] !== 'end' && rule[1] !== 'start');
  const finished = new Set();
  const partials = new Set(
    inputLTR.filter((rule) => rule[0] === 'start').map((rule) => rule.join(','))
  );
  const groupedRuleMap = inputLTR.reduce((map, rule) => {
    if (!map[rule[0]]) map[rule[0]] = [];
    map[rule[0]].push(rule[1]);
    return map;
  }, {});
  while (partials.size > 0) {
    for (const partial of partials) {
      const partialArr = partial.split(',');
      const lastCave = partialArr[partialArr.length - 1];
      for (const nextCave of groupedRuleMap[lastCave]) {
        if (nextCave === 'end') {
          finished.add(`${partial},end`);
          continue;
        }
        let prepend = '';
        if (
          nextCave === nextCave.toLowerCase() &&
          partialArr.includes(nextCave)
        ) {
          if (allowOneDoubleVisit && partialArr[0] !== 'xstart') {
            prepend = 'x';
          } else {
            continue;
          }
        }
        partials.add(`${prepend}${partial},${nextCave}`);
      }
      partials.delete(partial);
    }
  }
  return finished.size;
}

function getAnswer1() {
  const input = getInput('input.txt');
  return getPathCount(input, false);
}

function getAnswer2() {
  const input = getInput('input.txt');
  return getPathCount(input, true);
}

console.log(`Answer part one: ${getAnswer1()}`);

const start = performance.now();
console.log(`Answer part two: ${getAnswer2()}`);
console.log(`${performance.now() - start}ms`);
