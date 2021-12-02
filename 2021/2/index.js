const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), "utf8")
    .split("\n")
    .map((line) => /(.+) (\d+)/.exec(line))
    .map((match) => ({ direction: match[1], amount: Number(match[2]) }));
}

function calculateEndPosition(commands) {
  return commands.reduce(
    (position, command) => {
      if (command.direction === "forward")
        position.horizontal += command.amount;
      if (command.direction === "up") position.depth -= command.amount;
      if (command.direction === "down") position.depth += command.amount;
      return position;
    },
    { horizontal: 0, depth: 0 }
  );
}

function calculateEndPositionWithAim(commands) {
  return commands.reduce(
    (position, command) => {
      if (command.direction === "forward") {
        position.horizontal += command.amount;
        position.depth += command.amount * position.aim;
      }
      if (command.direction === "up") position.aim -= command.amount;
      if (command.direction === "down") position.aim += command.amount;
      return position;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );
}

function getAnswer1() {
  const input = getInput("input.txt");
  const endPosition = calculateEndPosition(input);
  return endPosition.horizontal * endPosition.depth;
}

function getAnswer2() {
  const input = getInput("input.txt");
  const endPosition = calculateEndPositionWithAim(input);
  return endPosition.horizontal * endPosition.depth;
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part one: ${getAnswer2()}`);
