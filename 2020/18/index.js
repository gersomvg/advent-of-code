const { readFileSync } = require("fs");
const { resolve } = require("path");

const expressions = readFileSync(resolve(__dirname, "input.txt"), "utf8").split(
  "\n"
);

const operationRegex = new RegExp(/^(\d+)\s*([\*\+])\s*(\d+)/);

// Solves any expression that doens't contain nested parentheses
const solveExpressionLeaf = (expression) => {
  let reducedExpression = expression;
  while (/[\*\+]/.test(reducedExpression)) {
    const [, num1, operator, num2] = operationRegex.exec(reducedExpression);
    const result =
      operator === "*"
        ? Number(num1) * Number(num2)
        : Number(num1) + Number(num2);
    reducedExpression = reducedExpression.replace(operationRegex, result);
  }
  return Number(reducedExpression);
};

const leafRegex = new RegExp(/\(([^\(\)]+)\)/);

// Solves an expression including nested expressions wrapped in parentheses
const solveExpression = (expression, solveExpressionLeafFunction) => {
  let reducedExpression = expression;
  let leaf;
  while ((leaf = leafRegex.exec(reducedExpression)?.[1])) {
    reducedExpression = reducedExpression.replace(
      leafRegex,
      solveExpressionLeafFunction(leaf)
    );
  }
  return solveExpressionLeafFunction(reducedExpression);
};

const solveExpressions = (
  expressions,
  solveExpressionLeafFunction = solveExpressionLeaf
) => {
  return expressions.map((expression) =>
    solveExpression(expression, solveExpressionLeafFunction)
  );
};

const reduceToSum = (agg, val) => (agg || 0) + val;

const answerPartOne = solveExpressions(expressions).reduce(reduceToSum);
console.log(`Answer part one: ${answerPartOne}`);

const additionRegex = new RegExp(/(\d+)\s*[\+]\s*(\d+)/);
const multiplicationRegex = new RegExp(/(\d+)\s*[\*]\s*(\d+)/);
const solveExpressionLeafWithPrecedence = (expression) => {
  let reducedExpression = expression;
  while (additionRegex.test(reducedExpression)) {
    const [, num1, num2] = additionRegex.exec(reducedExpression);
    const result = Number(num1) + Number(num2);
    reducedExpression = reducedExpression.replace(additionRegex, result);
  }
  while (multiplicationRegex.test(reducedExpression)) {
    const [, num1, num2] = multiplicationRegex.exec(reducedExpression);
    const result = Number(num1) * Number(num2);
    reducedExpression = reducedExpression.replace(multiplicationRegex, result);
  }
  return Number(reducedExpression);
};

const answerPartTwo = solveExpressions(
  expressions,
  solveExpressionLeafWithPrecedence
).reduce(reduceToSum);
console.log(`Answer part two: ${answerPartTwo}`);
