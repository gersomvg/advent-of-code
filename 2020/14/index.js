const {readFileSync} = require('fs');
const {resolve} = require('path');

const regexMask = /^mask\s=\s([01X]+)$/;
const regexWrite = /^mem\[(\d+)\]\s=\s(\d+)$/;

const program = readFileSync(resolve(__dirname, 'program.txt'), 'utf8')
  .split('\n')
  .map(line => {
    const matchMask = regexMask.exec(line);
    if (matchMask) return { mask: matchMask[1] };
    const matchWrite = regexWrite.exec(line);
    return { address: Number(matchWrite[1]), value: Number(matchWrite[2]) };
  });

function applyMaskOnNumber(number, mask) {
  let bitstring = (number >>> 0).toString(2).padStart(mask.length, '0');
  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i] === 'X') continue;
    bitstring = bitstring.substring(0, i) + mask[i] + bitstring.substr(i + 1);
  }
  return parseInt(bitstring, 2);
}

function getProgramResult(_program) {
  let result = {};
  let bitmask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  for (const [index, line] of _program.entries()) {
    if (line.mask) {
      bitmask = line.mask;
      continue;
    }
    result[line.address] = applyMaskOnNumber(line.value, bitmask);
  }
  return result;
}

function getSumOfAllAddresses(_result) {
  return Object.values(_result).reduce((agg, curr) => agg + curr, 0);
}

const answerPartOne = getSumOfAllAddresses(getProgramResult(program));
console.log(`Answer part one: ${answerPartOne}`);

function getAddressesForMaskAndAddress(address, mask) {
  let bitstringBase = (address >>> 0).toString(2).padStart(mask.length, '0');
  let bitstrings = [''];
  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i] === 'X') {
      bitstrings = [
        ...bitstrings.map(str => str + '0'),
        ...bitstrings.map(str => str + '1'),
      ];
    } else {
      const add = mask[i] === '1' ? '1' : bitstringBase[i];
      bitstrings = bitstrings.map(str => str + add);
    }
  }
  return bitstrings.map((str) => parseInt(str, 2));
}

function getProgramResult2(_program) {
  let result = {};
  let bitmask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  for (const [index, line] of _program.entries()) {
    if (line.mask) {
      bitmask = line.mask;
      continue;
    }
    getAddressesForMaskAndAddress(line.address, bitmask).forEach(addr => {
      result[addr] = line.value;
    });
  }
  return result;
}

const answerPartTwo = getSumOfAllAddresses(getProgramResult2(program));
console.log(`Answer part two: ${answerPartTwo}`);