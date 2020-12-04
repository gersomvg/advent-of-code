const {readFileSync} = require('fs');
const {resolve} = require('path');

const passports = readFileSync(resolve(__dirname, 'passports.txt'), 'utf8')
  .split('\n\n')
  .map(text => text
    .split(/[\n\s]+/)
    .map(field => {
      const [key, value] = field.split(':');
      return {key, value}
    })
  );

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const validators = {
  byr: val => {
    const num = Number(val);
    return num >= 1920 && num <= 2002;
  },
  iyr: val => {
    const num = Number(val);
    return num >= 2010 && num <= 2020;
  },
  eyr: val => {
    const num = Number(val);
    return num >= 2020 && num <= 2030;
  },
  hgt: val => {
    const [_, numText, unit] = /(\d+)(\w+)/.exec(val);
    const num = Number(numText);
    return unit === 'cm' ? num >= 150 && num <= 193 : num >= 59 && num <= 76;
  },
  hcl: val => {
    return /^#[\dabcdef]{6}$/.test(val);
  },
  ecl: val => {
    return ['amb','blu','brn','gry','grn','hzl','oth'].includes(val)
  },
  pid: val => {
    return /^\d{9}$/.test(val)
  },
  cid: () => true
};

function areFieldsPresent(passport) {
  return required.every(key => passport.some(field => field.key === key));
}

function areFieldsValid(passport) {
  return passport.every(({key, value}) => validators[key](value));
}

function areFieldsPresentAndValid(passport) {
  return areFieldsPresent(passport) && areFieldsValid(passport);
}

function countValidPassports(_passports, validator) {
  return _passports.reduce((validCount, passport) => {
    return validator(passport) ? validCount + 1 : validCount;
  }, 0)
}

const validPassportsPartOne = countValidPassports(passports, areFieldsPresent);
console.log(`Answer part one: ${validPassportsPartOne} valid passports`);

const validPassportsPartTwo = countValidPassports(passports, areFieldsPresentAndValid);
console.log(`Answer part one: ${validPassportsPartTwo} valid passports`);