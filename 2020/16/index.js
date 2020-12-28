const {readFileSync} = require('fs');
const {resolve} = require('path');

const blocks = readFileSync(resolve(__dirname, 'tickets.txt'), 'utf8')
  .split('\n\n');
const matchRule = /^(.+):\s(\d+)-(\d+)\sor\s(\d+)-(\d+)$/;
const rules = blocks[0].split('\n').map(line => {
  const [_, name, l1, u1, l2, u2] = matchRule.exec(line);
  return {name, lower1: Number(l1), upper1: Number(u1), lower2: Number(l2), upper2: Number(u2)};
})
const yourTicket = blocks[1].split('\n').pop().split(',').map(Number);
const otherTickets = blocks[2].split('\n').slice(1).map(line => line.split(',').map(Number));

function numberMatchesRule(number, rule) {
  return (rule.lower1 <= number && rule.upper1 >= number)
    || (rule.lower2 <= number && rule.upper2 >= number);
}

function numberMatchesAnyRule(number, _rules) {
  return _rules.some(rule => numberMatchesRule(number, rule));
}

function getNumbersNotMatchingAnyRule(numbers, _rules) {
  return numbers.filter(number => !numberMatchesAnyRule(number, _rules));
}

function sum(arr) {
  return arr.reduce((agg, curr) => agg + curr, 0);
}

function getErrorScanningRate(tickets, _rules) {
  return sum(getNumbersNotMatchingAnyRule(tickets.flat(), _rules));
}

const answerPartOne = getErrorScanningRate(otherTickets, rules);
console.log(`Answer part one: ${answerPartOne}`);

function getValidTickets(tickets, _rules) {
  return tickets.filter(ticket => getNumbersNotMatchingAnyRule(ticket, _rules).length === 0);
}

function getRuleMatchingAllNumbers(numbers, _rules) {
  return _rules.filter(rule => numbers.every(number => numberMatchesRule(number, rule)))
}

function getRulesPerIndex(tickets, _rules) {
  return tickets[0].map((_, index) =>
    getRuleMatchingAllNumbers(tickets.map(nums => nums[index]).flat(), _rules)
  );
}

function solveRulePerIndex(tickets, _rules) {
  const rulesPerIndex = getRulesPerIndex(tickets, _rules).map(r => new Set(r));
  const rulePerIndex = {};
  for (let _ of tickets[0]) {
    const solvedIndex = rulesPerIndex.findIndex(rls => rls.size === 1);
    const solvedRule = rulesPerIndex[solvedIndex].values().next().value;
    rulePerIndex[solvedIndex] = solvedRule;
    rulesPerIndex.forEach(ruleSet => ruleSet.delete(solvedRule));
  }
  return rulePerIndex;
}

function getAnswerPart2(tickets, _yourTicket, _rules) {
  const validTickets = getValidTickets(tickets, _rules);
  const solved = solveRulePerIndex(validTickets, _rules);
  return Object.keys(solved).reduce((acc, key) => {
    if (solved[key].name.startsWith('departure')) {
      return acc * _yourTicket[key];
    }
    return acc;
  }, 1);
}

const answerPartTwo = getAnswerPart2(otherTickets, yourTicket, rules);
console.log(`Answer part two: ${answerPartTwo}`);