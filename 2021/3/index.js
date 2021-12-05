const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), "utf8").split("\n");
}

function getAnswer1() {
  const l = getInput("input.txt");
  // Trying a one-liner for fun
  // prettier-ignore
  return((g,m='replaceAll',p=parseInt)=>p(g,2)*p(g[m](1,2)[m](0,1)[m](2,0),2))(l.reduce((a,n)=>[...n].forEach((b,i)=>(a[i]+=b*1))||a,[...l[0]].fill(0)).map((s)=>~~(.5+s/l.length)).join(""));

  // Not my own solution
  //return(r=>([r(Array(12).fill().map((_,n)=>(r(l.map(i=>parseInt(i,2)>>(11-n)&1))>500)<<(11-n)))].map(i=>i*(i^4095))))(y=>y.reduce((a,b)=>a+b))
}

function getRating(input, mostCommon) {
  let narrowedInput = [...input];
  [...input[0]].forEach((_, bitIdx) => {
    if (narrowedInput.length === 1) return;
    const bit1frac =
      narrowedInput.reduce((agg, num) => {
        agg += num[bitIdx] * 1;
        return agg;
      }, 0) / narrowedInput.length;
    const chosenBit = String(
      mostCommon ? Number(bit1frac >= 0.5) : Number(bit1frac < 0.5)
    );
    narrowedInput = narrowedInput.filter(
      (num) => num[bitIdx] === String(chosenBit)
    );
  });
  return parseInt(narrowedInput[0], 2);
}

function getAnswer2() {
  const input = getInput("input.txt");
  return getRating(input, true) * getRating(input, false);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
