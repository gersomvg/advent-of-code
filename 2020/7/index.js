const {readFileSync} = require('fs');
const {resolve} = require('path');

const rawRules = readFileSync(resolve(__dirname, 'rules.txt'), 'utf8').split('\n');

/**
 * rulesPerColor has this form:
 * 
 * {
 *   'light red': { 'bright white': '1', 'muted yellow': '2' },
 *   'dark orange': { 'bright white': '3', 'muted yellow': '4' },
 *   'black': {}
 * }
 */
const rulesPerColor = rawRules.reduce((agg, rule) => {
  const [_, color, allowList] = /^(.+) bags contain (.*)$/.exec(rule);
  const allowListParsed = allowList.split(', ').reduce((agg2, rulePart) => {
    if (rulePart === 'no other bags.') return agg2;
    const [_, amount, childColor] = /^(\d+) (.+) bags?\.?$/.exec(rulePart);
    agg2[childColor] = Number(amount);
    return agg2;
  }, {});
  agg[color] = allowListParsed;
  return agg;
}, {})

function isColorChildOfParent(childColor, parentColor, rulesPerColor) {
  const allowedInParent = Object.keys(rulesPerColor[parentColor]);
  if (allowedInParent.length === 0) return false;
  if (Object.keys(rulesPerColor[parentColor]).includes(childColor)) return true;
  return allowedInParent.some(allowedColor =>
    isColorChildOfParent(childColor, allowedColor, rulesPerColor)
  );
}

function getParentColorCount(childColor, rulesPerColor) {
  return Object.keys(rulesPerColor).filter(parentColor =>
    isColorChildOfParent(childColor, parentColor, rulesPerColor)
  ).length;
}

function getNumberOfChildBags(color, rulesPerColor) {
  const allowedInParent = Object.keys(rulesPerColor[color]);
  if (allowedInParent.length === 0) return 0;
  return allowedInParent.reduce((sum, allowed) => {
    const selfCount = rulesPerColor[color][allowed];
    const childCount = getNumberOfChildBags(allowed, rulesPerColor);
    return sum + selfCount + selfCount * childCount;
  }, 0);
}

const answerPartOne = getParentColorCount('shiny gold', rulesPerColor);
console.log(`Answer part one: ${answerPartOne} colors can eventually contain shiny gold`);

const answerPartTwo = getNumberOfChildBags('shiny gold', rulesPerColor);
console.log(`Answer part two: ${answerPartTwo} bags are required in shiny gold`);