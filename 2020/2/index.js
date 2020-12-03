const {readFileSync} = require('fs');
const {resolve} = require('path')

const lines = readFileSync(resolve(__dirname, 'passwords.txt'), 'utf8').split('\n');
const parsedLines = lines
  .map(line => /(\d+)-(\d+)\s(\w):\s(\w+)/.exec(line))
  .map(line => ({left: Number(line[1]), right: Number(line[2]), char: line[3], password: line[4]}));

const validPasswordCount1 = parsedLines.filter(({left, right, char, password}) => {
  const charCount = password.split(char).length - 1;
  return charCount >= left && charCount <= right;
}).length;

console.log(`Answer part one: ${validPasswordCount1} passwords are valid`);

function xor(a,b) { return a ? !b : b; }
const validPasswordCount2 = parsedLines.filter(({left, right, char, password}) => {
  return xor(password[left - 1] === char, password[right - 1] === char);
}).length;

console.log(`Answer part two: ${validPasswordCount2} passwords are valid`);