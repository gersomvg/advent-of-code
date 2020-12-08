const {readFileSync} = require('fs');
const {resolve} = require('path');

const instructions = readFileSync(resolve(__dirname, 'program.txt'), 'utf8')
  .split('\n')
  .map(instruction => {
    const [_, command, amount] = /^(\w+)\s([+-]\d+)$/.exec(instruction);
    return {command, amount: Number(amount)};
  });

function getAccumulatorBeforeEndOrLoop(_instructions) {
  let lineIndex = 0;
  let visitedLines = new Set();
  let accumulator = 0;
  while (true) {
    if (visitedLines.has(lineIndex) || _instructions.length <= lineIndex || lineIndex < 0) break;
    visitedLines.add(lineIndex);
    const instruction = _instructions[lineIndex];
    accumulator += instruction.command === 'acc' ? instruction.amount : 0;
    lineIndex += instruction.command === 'jmp' ? instruction.amount : 1;
  }
  return accumulator;
}

function hasInfiniteLoop(_instructions) {
  let lineIndex = 0;
  let visitedLines = new Set();
  while (true) {
    if (visitedLines.has(lineIndex)) return true;
    if (_instructions.length <= lineIndex) return false;
    visitedLines.add(lineIndex);
    const instruction = _instructions[lineIndex];
    lineIndex += instruction.command === 'jmp' ? instruction.amount : 1;
  }
}

function getAccumulatorForLooplessPermutation(_instructions) {
  let lineIndex = 0;
  while (true) {
    const instruction = _instructions[lineIndex];
    if (['jmp', 'nop'].includes(instruction.command)) {
      const permutatedCommand = instruction.command === 'jmp' ? 'nop' : 'jmp';
      const permutatedInstructions = [..._instructions];
      permutatedInstructions[lineIndex] = {...instruction, command: permutatedCommand};
      if (!hasInfiniteLoop(permutatedInstructions)) {
        return getAccumulatorBeforeEndOrLoop(permutatedInstructions);
      }
    }
    lineIndex += instruction.command === 'jmp' ? instruction.amount : 1;
  }
}

const answerPartOne = getAccumulatorBeforeEndOrLoop(instructions);
console.log(`Answer part one: ${answerPartOne} is the value of the accumulator before the infinite loop`);

const answerPartTwo = getAccumulatorForLooplessPermutation(instructions);
console.log(`Answer part one: ${answerPartTwo} is the value of the accumulator when solving the infinite loop`);