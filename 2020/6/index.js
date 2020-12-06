const {readFileSync} = require('fs');
const {resolve} = require('path');

const groups = readFileSync(resolve(__dirname, 'answers.txt'), 'utf8').split('\n\n');
const uniqueYesPerGroup = groups.map(group => new Set(group.replace(/\n/g, '').split('')));

const sumPartOne = uniqueYesPerGroup.reduce((sum, uniqueYes) => sum + uniqueYes.size, 0);
console.log(`Answer part one: ${sumPartOne}`);

const personAnswersByGroup = groups.map(group => 
  group.split('\n').map(answers => answers.split(''))
)
const sumPartTwo = personAnswersByGroup.reduce((sum, group, index) => {
  return sum + Array.from(uniqueYesPerGroup[index]).filter(question =>
    group.every(person => person.includes(question))  
  ).length;
}, 0);
console.log(`Answer part two: ${sumPartTwo}`);