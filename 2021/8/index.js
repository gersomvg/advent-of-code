const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split('\n')
    .map((line) => line.split(' | ').map((part) => part.split(' ')));
}

function getAnswer1() {
  const input = getInput('input.txt');
  return input
    .map((line) => line[1])
    .flat()
    .reduce((count, pattern) => {
      if ([2, 3, 4, 7].includes(pattern.length)) {
        count += 1;
      }
      return count;
    }, 0);
}

function getPatternsSorted(patterns) {
  return patterns.map((pattern) => [...pattern].sort().join(''));
}

function patternWithout(pattern, signals) {
  return signals.reduce((agg, sig) => agg.replace(sig, ''), pattern);
}

function patternWith(pattern, signals) {
  return getPatternsSorted([`${pattern}${signals.join('')}`])[0];
}

function commonSignal(base, patterns, length) {
  return [...base].find((sig) =>
    patterns.every((patt) => patt.length !== length || patt.includes(sig))
  );
}

function uniqueSignal(pattern1, pattern2) {
  return [...pattern1].find((sig) => !pattern2.includes(sig));
}

function solveEntry(entry) {
  const patterns = getPatternsSorted(entry[0]);
  const output = getPatternsSorted(entry[1]);

  const map = [];
  const seg = {};
  map[1] = patterns.find((patt) => patt.length === 2);
  map[4] = patterns.find((patt) => patt.length === 4);
  map[7] = patterns.find((patt) => patt.length === 3);
  map[8] = patterns.find((patt) => patt.length === 7);
  seg.a = uniqueSignal(map[7], map[1]);
  seg.f = commonSignal(map[1], patterns, 6);
  seg.c = patternWithout(map[1], [seg.f]);
  seg.d = commonSignal(map[4], patterns, 5);
  seg.b = patternWithout(map[4], [seg.c, seg.d, seg.f]);
  map[6] = patternWithout(map[8], [seg.c]);
  map[0] = patternWithout(map[8], [seg.d]);
  map[9] = patterns.find(
    (patt) => patt.length === 6 && ![map[6], map[0]].includes(patt)
  );
  seg.g = patternWithout(map[9], [seg.a, seg.b, seg.c, seg.d, seg.f]);
  map[2] = patternWithout(map[8], [seg.f, seg.b]);
  map[3] = patternWithout(map[9], [seg.b]);
  map[5] = patternWith('', [seg.a, seg.b, seg.d, seg.f, seg.g]);
  return Number(output.map((patt) => map.indexOf(patt)).join(''));
}

function getAnswer2() {
  const input = getInput('input.txt');
  const outputs = input.map(solveEntry);
  const sum = outputs.reduce((a, b) => a + b, 0);
  return sum;
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
