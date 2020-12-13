const {readFileSync} = require('fs');
const {resolve} = require('path');

const instructions = readFileSync(resolve(__dirname, 'instructions.txt'), 'utf8')
  .split('\n')
  .map(instr => {
    const [_, action, value] = /^(\w)(\d+)$/.exec(instr);
    return {action, value: Number(value)};
  });

const dirMap = {
  N: {
    axis: 'y',
    d: -1,
  },
  E: {
    axis: 'x',
    d: 1,
  },
  S: {
    axis: 'y',
    d: 1,
  },
  W: {
    axis: 'x',
    d: -1,
  },
};

const clockwise = ['N', 'E', 'S', 'W'];

function calcLocForInstruction(location, instruction) {
  if ([...clockwise, 'F'].includes(instruction.action)) {
    const dir = dirMap[instruction.action === 'F' ? location.facing : instruction.action];
    return { ...location,
      [dir.axis]: location[dir.axis] + dir.d * instruction.value
    }
  }
  if (['L', 'R'].includes(instruction.action)) {
    const turns = (instruction.value / 90) % 4;
    const rightTurns = instruction.action === 'L' ? 4 - turns : turns;
    return { ...location,
      facing: clockwise[Math.abs((clockwise.indexOf(location.facing) + rightTurns) % 4)]
    }
  }
  return location;
}

function calcLocForInstructionList(_instructions) {
  let location = { x: 0, y: 0, facing: 'E' };
  for (let instruction of _instructions) {
    location = calcLocForInstruction(location, instruction);
  }
  return location;
}

function calcLocWithWaypointForInstruction(locWithWaypoint, instruction) {
  if (clockwise.includes(instruction.action)) {
    const dir = dirMap[instruction.action];
    return { ...locWithWaypoint, waypoint: { ...locWithWaypoint.waypoint,
      [dir.axis]: locWithWaypoint.waypoint[dir.axis] + dir.d * instruction.value
    }}
  }
  if (instruction.action === 'F') {
    return { ...locWithWaypoint,
      x: locWithWaypoint.x + instruction.value * locWithWaypoint.waypoint.x,
      y: locWithWaypoint.y + instruction.value * locWithWaypoint.waypoint.y,
    }
  }
  if (['L', 'R'].includes(instruction.action)) {
    const turns = (instruction.value / 90) % 4;
    const rightTurns = (instruction.action === 'L' ? 4 - turns : turns) % 4;
    const {x, y} = locWithWaypoint.waypoint;
    return { ...locWithWaypoint,
      waypoint: { ...locWithWaypoint.waypoint,
        x: [x, -y, -x, y][rightTurns],
        y: [y, x, -y, -x][rightTurns],
      }
    }
  }
  return locWithWaypoint;
}

function calcLocWithWaypointForInstructionList(_instructions) {
  let locWithWaypoint = { x: 0, y: 0, waypoint: {x: 10, y: -1} };
  for (let instruction of _instructions) {
    locWithWaypoint = calcLocWithWaypointForInstruction(locWithWaypoint, instruction);
  }
  return locWithWaypoint;
}

function getManhattenDistance(location) {
  return Math.abs(location.x) + Math.abs(location.y);
}

const answerPartOne = getManhattenDistance(calcLocForInstructionList(instructions));
console.log(`Answer part one: ${answerPartOne}`);

const answerPartTwo = getManhattenDistance(calcLocWithWaypointForInstructionList(instructions));
console.log(`Answer part two: ${answerPartTwo}`);